import configly
import flask
from sqlalchemy.engine.url import URL

from api.db.models import db
from api.db.views import api

app = flask.Flask(__name__)
config = configly.Config.from_yaml("flask-config.yml")
app.config["SQLALCHEMY_DATABASE_URI"] = str(URL(**config.postgres.to_dict()))
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.url_map.strict_slashes = False


db.init_app(app)

app.register_blueprint(api, url_prefix="/api/db")
