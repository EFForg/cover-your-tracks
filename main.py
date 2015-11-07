from flask import Flask, render_template, send_from_directory, request, session, jsonify
from time import time
import json

import env_config as config
from fingerprint_agent import FingerprintAgent
from fingerprint_recorder import FingerprintRecorder
from fingerprint_helper import FingerprintHelper
from tracking_recorder import TrackingRecorder
from entropy_helper import EntropyHelper
from util import number_format

app = Flask(__name__)
app.secret_key = config.secret_key
app.debug = config.debug

with open(config.keyfile, 'r') as fp:
    key = fp.read(16)


@app.before_request
def set_cookie():
    # set a long-lived session cookie.  this helps to determine if we've
    # already recorded your fingerprint in the database
    if 'long_cookie' not in session or time() - session['long_cookie'] >= 7776000:
        session['long_cookie'] = time()


@app.route("/")
def index():
    return render_template('front.html')


@app.route("/fingerprint-js")
def fingerprint_js():
    return render_template('fingerprint_js.html')


def fingerprint_generic(ajax):
    # detect server whorls, merge with client whorls
    server_whorls = FingerprintAgent(request).detect_server_whorls()
    whorls = server_whorls.copy()
    if ajax:
        for i in request.form.keys():
            whorls[i] = request.form.get(i)
        whorls['js'] = "1"
    else:
        whorls['js'] = "0"

    # record the fingerprint we've crafted
    FingerprintRecorder.record_fingerprint(
        whorls, session['long_cookie'], request.remote_addr, key)

    # calculate the values we'll need to display to the user
    counts, total, matching, bits, group, uniqueness = EntropyHelper.calculate_values(
        whorls)
    return render_template('ajax_fingerprint.html',
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


@app.route("/fingerprint-nojs")
def fingerprint_nojs():
    return render_template('fingerprint_nojs.html', content=fingerprint_generic(False))


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

    return render_template('tracker.html', next_link=next_link, third_party_trackers=config.third_party_trackers)


@app.route("/tracking-tally")
def tracking_tally():
    return render_template('tracking_tally.html')


@app.route("/tracker-nojs")
def tracker_nojs():
    return render_template('tracker_nojs.html')


@app.route("/results")
def results():
    return render_template('results.html',
                           a_loads=len(request.args.get('a') or ''),
                           t_loads=len(request.args.get('t') or ''),
                           dnt_loads=len(request.args.get('dnt') or ''),
                           third_party_trackers=config.third_party_trackers)


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


@app.route("/clear-cookies")
def clear_cookies():
    return render_template('clear_cookies.html')


@app.route("/ajax-fingerprint", methods=['POST'])
def ajax_fingerprint():
    return fingerprint_generic(True)


@app.route("/privacy")
def privacy():
    return render_template('privacy.html', title="Privacy Policy")


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
    app.run()
