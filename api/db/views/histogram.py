import logging

import flask
from psycopg2.extensions import AsIs
from sqlalchemy.engine import ResultProxy
from sqlalchemy.sql import text

from api.db.models import Commit, RepoLastUpdate, db
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
                min(date_trunc('month', ts)) :: TIMESTAMP,
                max(date_trunc('month', ts)) :: TIMESTAMP,
                INTERVAL '1 month'
            ) :: TIMESTAMP AS ts
        FROM
            :table c
        WHERE repo = :repo
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


@api.route("/git/histogram", methods=["GET"])
def git_histogram():
    repo: str = flask.request.args.get("repo")
    if not repo:
        return flask.Response("`repo` query param is required.", status=400)

    if (
        not db.session.query(RepoLastUpdate)
        .filter(RepoLastUpdate.repo == repo)
        .one_or_none()
    ):
        return flask.Response(status=204)

    histogram: ResultProxy = db.session.execute(
        text(HISTOGRAM_QUERY), {"repo": repo, "table": AsIs(Commit.__tablename__)}
    )

    if not histogram.rowcount:
        return flask.Response(status=204)

    return flask.jsonify([HistogramSchema().dump(row) for row in histogram])
