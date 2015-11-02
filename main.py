from flask import Flask, render_template
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

if __name__ == "__main__":
    app.run()
