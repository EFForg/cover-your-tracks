from flask import Flask, render_template, send_from_directory, request, session, jsonify, make_response, redirect
from flask.ext.bower import Bower
from raven.contrib.flask import Sentry
from time import time
from datetime import timedelta
from random import random
from urlparse import urlparse
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

with open(config.keyfile, 'r') as fp:
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
@app.route("/fingerprint-js")
@app.route("/fingerprint")
@app.route("/ajax-fingerprint", methods=['POST'])
@app.route("/fingerprint-nojs")
@app.route("/tracker")
@app.route("/tracking-tally")
@app.route("/tracker-preflight-nojs")
@app.route("/tracker-nojs")
@app.route("/tracking-tally-nojs")
@app.route("/tracker-reporting-nojs")
@app.route("/results")
@app.route("/results-nojs")
@app.route("/record-results", methods=['POST'])
@app.route("/clear-cookies")
@app.route("/clear-all-cookies-nojs")
@app.route("/api/v1/whorl-uniqueness", methods=['POST'])
def index():
    return render_template('front.html');


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
