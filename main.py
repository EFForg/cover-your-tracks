from flask import Flask, render_template, send_from_directory, request
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('front.html')

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
