import flask

app = flask.Flask(__name__)


@app.route("/api/db")
def hello_world():
    return "Hello, World!"

