from api.db.decorators import query_parameters
import logging
from datetime import datetime
from typing import Union

import flask

from api.db.models import RepoDownloadStatus, db
from api.db.views import api

logger = logging.getLogger(__name__)


def _get_current_download(repo: str) -> Union[RepoDownloadStatus, None]:
    return (
        db.session.query(RepoDownloadStatus)
        .filter(RepoDownloadStatus.repo == repo)
        .one_or_none()
    )


@api.route("/status/start", methods=["POST"])
@query_parameters("repo")
def status_download_start(repo: str):
    status = _get_current_download(repo)

    # If download in progress, don't start another download
    if status and status.in_progress:
        return flask.Response("Download in progress", status=400)

    # If no status stored, create a new object
    if not status:
        status = RepoDownloadStatus(repo=repo)

    # Notate start of new download
    status.download_started = datetime.now()

    db.session.merge(status)
    db.session.commit()
    return flask.Response(status=200)


@api.route("/status/finish", methods=["POST"])
@query_parameters("repo")
def status_download_finish(repo: str):
    status = _get_current_download(repo)

    # If no stored status, or download not running, gtfo
    if not status or not status.in_progress:
        return flask.Response("No download in progress", status=400)

    # Notate end of download
    status.download_finished = datetime.now()

    db.session.merge(status)
    db.session.commit()
    return flask.Response(status=200)
