from flask import Flask, render_template, send_from_directory, request, session
from fingerprint_agent import FingerprintAgent
from fingerprint_recorder import FingerprintRecorder
from time import time

import config

app = Flask(__name__)
app.secret_key = config.secret_key
app.debug = config.debug

@app.route("/")
def index():
    return render_template('front.html')

@app.route("/ajax-fingerprint", methods=['POST'])
def ajax_fingerprint():
    # set a long-lived session cookie.  this helps to determine if we've
    # already recorded your fingerprint in the database
    if 'long_cookie' not in session or time() - session['long_cookie'] >= 7776000:
        session['long_cookie'] = time()
    server_whorls = FingerprintAgent(request).detect_server_whorls()
    whorls = server_whorls.copy()
    for i in request.form.keys():
        whorls[i] = request.form.get(i)
    whorls['js'] = "1"
    return "success"

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
