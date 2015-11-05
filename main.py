from flask import Flask, render_template, send_from_directory, request, session
from time import time

import config
from fingerprint_agent import FingerprintAgent
from fingerprint_recorder import FingerprintRecorder
from fingerprint_helper import FingerprintHelper
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


@app.route("/ajax-fingerprint", methods=['POST'])
def ajax_fingerprint():
    # detect server whorls, merge with client whorls
    server_whorls = FingerprintAgent(request).detect_server_whorls()
    whorls = server_whorls.copy()
    for i in request.form.keys():
        whorls[i] = request.form.get(i)
    whorls['js'] = "1"

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
@app.route('/.well-known/dnt-policy.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

if __name__ == "__main__":
    app.run()
