import flask

api = flask.Blueprint("api", __name__)


from . import commits, histogram  # noqa
