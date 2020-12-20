from api.db.decorators import query_parameters
import logging
from datetime import datetime

import flask

from api.db.models import Commit, RepoLastUpdate, db
from api.db.schemas import FlatCommitSchema, UploadSchema
from api.db.views import api

logger = logging.getLogger(__name__)


@api.route("/git/commits", methods=["GET"])
@query_parameters("repo")
def git_commits(repo: str):
    commits = db.session.query(Commit).filter(Commit.repo == repo).all()
    if not commits:
        return flask.Response(f"No commits found for repo {repo}", status=204)

    return flask.jsonify([FlatCommitSchema().dump(commit) for commit in commits])


@api.route("/git/commits", methods=["POST"])
def git_commits_upload():
    if not flask.request.is_json:
        return flask.Response(status=400)

    upload: UploadSchema = UploadSchema().load(flask.request.get_json())

    for row in upload["commits"]:
        try:
            db.session.merge(row)
        except Exception as err:
            db.session.rollback()
            logger.warning(err, exc_info=True)
            continue

    db.session.merge(RepoLastUpdate(repo=upload["repo"], last_update=datetime.now()))
    db.session.commit()

    return flask.Response("OK", status=200)
