import logging
import urllib.parse

import flask
from psycopg2.extensions import AsIs
from sqlalchemy.engine import ResultProxy
from sqlalchemy.sql import text

from api.db.decorators import query_parameters
from api.db.models import Commit, RepoDownloadStatus, RepoLastUpdate, db
from api.db.schemas import HistogramSchema
from api.db.views import api

logger = logging.getLogger(__name__)

HISTOGRAM_QUERY = """
SELECT
    calendar.ts,
    COALESCE(files, 0) AS files,
    COALESCE(adds, 0) AS adds,
    COALESCE(dels, 0) AS dels,
    COALESCE(commits, 0) AS commits,
    :repo as repo
FROM
    (
        SELECT
            generate_series(
                date_trunc('month', CURRENT_DATE - INTERVAL '12 month') :: TIMESTAMP,
                date_trunc('month', CURRENT_DATE) :: TIMESTAMP,
                INTERVAL '1 month'
            ) :: TIMESTAMP AS ts
    ) calendar
    LEFT JOIN (
        SELECT
            date_trunc('month', ts) AS ts,
            SUM(files_changed) AS files,
            SUM(additions) AS adds,
            SUM(deletions) AS dels,
            SUM(1) AS commits,
            repo
        FROM
            :table
        WHERE repo = :repo
        GROUP BY
            date_trunc('month', ts),
            repo
    ) commits ON commits.ts = calendar.ts
ORDER BY
    ts desc,
repo
"""


def _download_required(repo) -> bool:
    return (
        not db.session.query(RepoLastUpdate)
        .filter(RepoLastUpdate.repo == repo)
        .one_or_none()
    )


def _get_download_status(repo) -> RepoDownloadStatus:
    return (
        db.session.query(RepoDownloadStatus)
        .filter(RepoDownloadStatus.repo == repo)
        .one_or_none()
    )


@api.route("/git/histogram", methods=["GET"])
@query_parameters("repo")
def git_histogram(repo: str):

    # Check if a download is required
    if _download_required(repo):
        # If a download is already started, just wait
        status = _get_download_status(repo)
        if status and status.in_progress:
            return flask.Response(status=202)  # accepted

        # Redirect browser to download endpoint
        download_url = flask.current_app.config["DOWNLOAD_URL"]
        upload_url = flask.current_app.config["UPLOAD_URL"]
        query_string = urllib.parse.urlencode({"repo": repo, "callbackUrl": upload_url})
        return flask.redirect(
            f"{download_url}?{query_string}", code=307  # temp redirect
        )

    histogram: ResultProxy = db.session.execute(
        text(HISTOGRAM_QUERY), {"repo": repo, "table": AsIs(Commit.__tablename__)}
    )

    if not histogram.rowcount:
        return flask.Response(status=204)  # no content

    return flask.jsonify([HistogramSchema().dump(row) for row in histogram])
