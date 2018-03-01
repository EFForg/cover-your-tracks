from flask import Flask, render_template, send_from_directory, request, session, jsonify, make_response, redirect
from flask_bower import Bower
from raven.contrib.flask import Sentry
from time import time
from datetime import timedelta
from random import random
from urllib.parse import urlparse
import json

import env_config as config
from fingerprint import FingerprintAgent, FingerprintRecorder, FingerprintHelper
from tracking import TrackingRecorder
from entropy_helper import EntropyHelper
from util import number_format, detect_browser_and_platform, get_tool_recommendation

app = Flask(__name__)
app.secret_key = config.secret_key
app.debug = config.debug
app.permanent_session_lifetime = timedelta(days=config.session_lifetime)
Bower(app)

if config.sentry_dsn:
    app.config['SENTRY_DSN'] = config.sentry_dsn
    sentry = Sentry(app)

with open(config.keyfile, 'rb',) as fp:
    key = fp.read(16)


@app.before_request
def set_cookie():
    session.permanent = True
    # set a long-lived session cookie.  this helps to determine if we've
    # already recorded your fingerprint in the database
    lifetime_seconds = app.permanent_session_lifetime.total_seconds()
    if 'long_cookie' not in session or time() - session['long_cookie'] >= lifetime_seconds:
        session['long_cookie'] = time()


@app.route("/")
def index():
    cb = random()
    return render_template('front.html',
                           third_party_trackers=config.third_party_trackers,
                           cb=cb)


@app.route("/fingerprint-js")
@app.route("/fingerprint")
def fingerprint_js():
    return render_template('fingerprint_js.html')


# route accessed via fingerprint-js
@app.route("/ajax-fingerprint", methods=['POST'])
def ajax_fingerprint():
    return fingerprint_generic(True)


@app.route("/fingerprint-nojs")
def fingerprint_nojs():
    return render_template('fingerprint_nojs.html', content=fingerprint_generic(False))


def fingerprint_generic(ajax_request, provide_additional_info=False):
    # detect server whorls, merge with client whorls
    server_whorls = FingerprintAgent(request).detect_server_whorls()
    whorls = server_whorls.copy()
    if ajax_request:
        for i in request.form.keys():
            whorls[i] = request.form.get(i)

    # record the fingerprint we've crafted
    FingerprintRecorder.record_fingerprint(
        whorls, session['long_cookie'], request.remote_addr, key)

    # calculate the values we'll need to display to the user
    counts, total, matching, bits, group, uniqueness = EntropyHelper.calculate_values(
        whorls)

    markup = render_template('ajax_fingerprint.html',
                             counts=counts,
                             total=total,
                             total_formatted=number_format(total),
                             sample_string=EntropyHelper.size_words(total),
                             matching=matching,
                             bits=bits,
                             group=group,
                             labels=FingerprintHelper.whorl_names,
                             whorls=whorls,
                             uniqueness=uniqueness)

    if ajax_request:
        return jsonify({'matching': matching, 'markup': markup})
    elif provide_additional_info:
        return matching, markup
    else:
        return markup


# first-party redirect route
@app.route("/tracker")
def tracker():
    try:
        i = config.first_party_trackers.index(request.host)
    except ValueError:
        return "Invalid domain.  Please check your config settings."

    if i < 2:
        next_link = "https://" + \
            config.first_party_trackers[i + 1] + "/tracker?"
    else:
        next_link = "https://" + config.first_party_trackers[0] + "/results?"

    if request.args.get('aat'):
        next_link = next_link + "aat=" + request.args.get('aat')

    return render_template('tracker.html', next_link=next_link, third_party_trackers=config.third_party_trackers)


# third-party route accessed in an iframe for tallying up domains seen
@app.route("/tracking-tally")
def tracking_tally():
    return render_template('tracking_tally.html')


# this route is no longer used, but may be useful in the future for users
# with domain-based blockers without js
@app.route("/tracker-preflight-nojs")
def tracker_preflight_nojs():
    return render_template('tracker_preflight_nojs.html', third_party_trackers=config.third_party_trackers)


# first party redirect route, no js
@app.route("/tracker-nojs")
def tracker_nojs():
    # try2 is for tracking weather a domain has been blocked heuristically,
    # after all third party domains have attempted 3 times to set cookies
    try2 = False
    if request.args.get('try2') == "true":
        try2 = True

    try:
        i = config.first_party_trackers.index(request.host)
    except ValueError:
        return "Invalid domain.  Please check your config settings."

    if i < 2:
        next_link = "https://" + \
            config.first_party_trackers[i + 1] + "/tracker-nojs"
    else:
        if try2:
            next_link = "https://" + \
                config.third_party_trackers['ad_server'] + \
                "/tracker-reporting-nojs"
        else:
            next_link = "https://" + \
                config.first_party_trackers[i] + \
                "/tracker-nojs?try2=true"

    cb = random()
    return render_template('tracker_nojs.html',
                           next_link=next_link,
                           third_party_trackers=config.third_party_trackers,
                           cb=cb,
                           try2=try2)


# third-party route, no js. accessed in an iframe for tallying up domains seen
@app.route("/tracking-tally-nojs")
def tracking_tally_nojs():
    site_cookie = request.cookies.get('site', "")
    site_list = site_cookie.split(" ")
    site_dict = {}
    for site in site_list:
        site_dict[site] = True
    if request.referrer != None:
        u = urlparse(request.referrer)
        if request.args.get('try2') == "true":
            site_dict[u.hostname + "_try2"] = True
        else:
            site_dict[u.hostname] = True
    resp = make_response(" ".join(list(site_dict.keys())))
    resp.set_cookie('site', " ".join(list(site_dict.keys())))
    return resp


# third party redirect route, no js.  this is accessed after /tracker-nojs
# in order to tally up the results and send them along via GET.
@app.route("/tracker-reporting-nojs")
def tracker_reporting_nojs():
    site_cookie = request.cookies.get('site', "")
    if request.host == config.third_party_trackers['ad_server']:
        next_link = "https://" + \
            config.third_party_trackers['tracker_server'] + \
            "/tracker-reporting-nojs?a=" + site_cookie
    elif request.host == config.third_party_trackers['tracker_server']:
        next_link = "https://" + \
            config.third_party_trackers['dnt_server'] + \
            "/tracker-reporting-nojs?a=" + \
            request.args.get('a') + "&t=" + site_cookie
    elif request.host == config.third_party_trackers['dnt_server']:
        next_link = "https://" + \
            config.first_party_trackers[0] + \
            "/results-nojs?a=" + request.args.get('a') + \
            "&t=" + request.args.get('t') + \
            "&dnt=" + site_cookie

    return redirect(next_link, 302)


# results for the tracker test
@app.route("/results")
def results():
    return render_template('results.html',
                           a_loads=len(request.args.get('a') or ''),
                           t_loads=len(request.args.get('t') or ''),
                           dnt_loads=len(request.args.get('dnt') or ''),
                           acceptable_ads_test=len(request.args.get('aat') or ''),
                           third_party_trackers=config.third_party_trackers)


@app.route("/results-nojs")
def results_nojs():
    yes = render_template('_yes.html')
    no = render_template('_no.html')
    partial = render_template('_partial.html')

    ad_result = tracker_result = dnt_result = no
    if get_count_from_str(request.args.get('a')) < 4:
        ad_result = yes
    if get_count_from_str(request.args.get('t')) < 4:
        tracker_result = yes
    # if for the last pageload (the fourth one, or try2) we block some 3rd
    # party trackers but not the dnt one, then we're using privacy badger
    if get_count_from_str(
            " ".join([
                request.args.get('t'),
                request.args.get('a'),
                request.args.get('dnt')
            ]), heuristic_filter) < 3:
        if get_count_from_str(request.args.get('dnt'), heuristic_filter) == 1:
            dnt_result = yes

    tool_recommendation = None
    detection = None
    if ad_result == yes and tracker_result == yes and dnt_result == yes:
        summary_sentence = render_template('_summary_sentence_yes.html')
    elif ad_result == yes and tracker_result == yes and dnt_result == no:
        summary_sentence = render_template(
            '_summary_sentence_yes_sans_dnt.html')
    else:
        if ad_result == no and tracker_result == no:
            summary_sentence = render_template('_summary_sentence_no.html')
        else:
            summary_sentence = render_template('_summary_sentence_mixed.html')
        detection = detect_browser_and_platform(
            request.headers.get('User-Agent'))

        tool_recommendation = get_tool_recommendation(detection)

        if detection['platform'] == "desktop" and (detection['browser'] == "chrome" or detection['browser'] == "firefox"):
            summary_sentence += " <strong>installing EFF's Privacy Badger</strong>"
        elif detection['platform'] == "desktop" and detection['browser'] != "opera" and detection['browser'] != "ie":
            summary_sentence += " switching to a browser or OS that offers better protections."
        else:
            summary_sentence += " <strong>installing extra protections</strong>.  Privacy Badger isn't available for your browser / OS, but <a id='tool-recommendation' target='_blank' href='" + \
                tool_recommendation['url'] + "'>" + tool_recommendation['name'] + \
                "</a> may work for you."

    fingerprint_matching, fingerprint_content = fingerprint_generic(
        False, True)
    if fingerprint_matching <= 20:
        fingerprint_result = no
    elif fingerprint_matching <= 100:
        fingerprint_result = partial
    else:
        fingerprint_result = yes

    retest_link = "https://" + \
        config.third_party_trackers['ad_server'] + "/clear-all-cookies-nojs"

    return render_template('results_nojs.html',
                           summary_sentence=summary_sentence,
                           tool_recommendation=tool_recommendation,
                           detection=detection,
                           fingerprint_content=fingerprint_content,
                           ad_result=ad_result,
                           tracker_result=tracker_result,
                           dnt_result=dnt_result,
                           fingerprint_result=fingerprint_result,
                           retest_link=retest_link)


def get_count_from_str(string, extra_filter=lambda x: True):
    string = string.split(" ")
    return len(filter(extra_filter, filter(lambda x: x != "", string)))


def heuristic_filter(x):
    return x == config.first_party_trackers[2] + "_try2"


# record results via an ajax call from the tracker results page
@app.route("/record-results", methods=['POST'])
def record_results():
    results = json.loads(request.data)

    constrained_results = ['ad', 'tracker', 'dnt']
    allowed_values = ['yes', 'no', 'partial']
    for i in constrained_results:
        if results[i] not in allowed_values:
            del results[i]

    results['known_blockers'] = ",".join(results['known_blockers'])

    if TrackingRecorder.record_tracking_results(session['long_cookie'], results, request.remote_addr, key):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})


# clear all 'site' cookies for a specific domain
@app.route("/clear-cookies")
def clear_cookies():
    resp = make_response("")
    resp.set_cookie('site', "")
    return resp


# a redirect loop that clears all 'site' cookies from third party domains
@app.route("/clear-all-cookies-nojs")
def clear_all_cookies_nojs():
    if request.host == config.third_party_trackers['ad_server']:
        next_link = "https://" + \
            config.third_party_trackers['tracker_server'] + \
            "/clear-all-cookies-nojs"
    elif request.host == config.third_party_trackers['tracker_server']:
        next_link = "https://" + \
            config.third_party_trackers['dnt_server'] + \
            "/clear-all-cookies-nojs"
    elif request.host == config.third_party_trackers['dnt_server']:
        next_link = "https://" + \
            config.first_party_trackers[0] + "/tracker-nojs"

    resp = make_response(redirect(next_link, 302))
    resp.set_cookie('site', "")
    return resp


@app.route("/api/v1/whorl-uniqueness", methods=['POST'])
def api_v1_ua_uniqueness():
    whorl = json.loads(request.data)
    return jsonify(EntropyHelper.single_whorl_uniqueness(whorl['name'], whorl['value']))


@app.route("/privacy")
def privacy():
    return render_template('privacy.html', title="Privacy Policy")


@app.route("/privacy-1.0")
def privacy_1_0():
    return render_template('privacy_1_0.html', title="Privacy Policy")

@app.route("/privacy-2.0")
def privacy_2_0():
    return render_template('privacy_2_0.html', title="Privacy Policy")

@app.route("/privacy-3.0")
def privacy_3_0():
    return render_template('privacy_3_0.html', title="Privacy Policy") 

@app.route("/about")
def about():
    return render_template('about.html', title="About")


@app.route("/faq")
def faq():
    return render_template('faq.html', title="Frequently asked questions about Panopticlick")


@app.route("/self-defense")
def self_defense():
    return render_template('self-defense.html', title="Self-Defense")


@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])


@app.route('/.well-known/dnt-policy.txt')
def dnt():
    if request.host == config.third_party_trackers['ad_server'] or request.host == config.third_party_trackers['tracker_server']:
        return 404
    return send_from_directory(app.static_folder, request.path[1:])

if __name__ == "__main__":
    if config.public:
        app.run(host='0.0.0.0')
    else:
        app.run()
