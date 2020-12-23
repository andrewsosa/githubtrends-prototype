import enum
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


@enum.unique
class INTERVALS(enum.Enum):
    ONE_YEARS = "ONE_YEARS"
    TWO_YEARS = "TWO_YEARS"
    FIVE_YEARS = "FIVE_YEARS"
    TEN_YEARS = "TEN_YEARS"

    @classmethod
    def _missing_(cls, value: object):
        return cls.ONE_YEARS

    @property
    def params(self) -> tuple:
        return {
            INTERVALS.ONE_YEARS: ("1 year", "1 month"),
            INTERVALS.TWO_YEARS: ("2 year", "2 month"),
            INTERVALS.FIVE_YEARS: ("5 year", "6 month"),
            INTERVALS.TEN_YEARS: ("10 year", "12 month"),
            # "ALL_TIME": ('12 month', '1 month'),
        }[self]


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
                date_trunc('month', CURRENT_DATE - INTERVAL :start) :: TIMESTAMP,
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
@query_parameters("repo", "interval")
def git_histogram(repo: str, interval: str):

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

    start_date, chunk_by = INTERVALS(interval).params
    histogram: ResultProxy = db.session.execute(
        text(HISTOGRAM_QUERY),
        {
            "repo": repo,
            "table": AsIs(Commit.__tablename__),
            "start": start_date,
        },
    )

    if not histogram.rowcount:
        return flask.Response(status=204)  # no content

    return flask.jsonify([HistogramSchema().dump(row) for row in histogram])
