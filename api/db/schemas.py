from datetime import datetime

from marshmallow import EXCLUDE, Schema, fields, post_load

from api.db.models import Commit


class CommitDiffSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    insertions = fields.Integer(required=True)
    deletions = fields.Integer(required=True)
    changed = fields.Integer(required=True)


class CommitSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    hash = fields.Str(required=True)
    repo = fields.Str(required=True)
    date = fields.DateTime("%Y-%m-%d %H:%M:%S %z", required=True)

    author_email = fields.Str(required=True)
    author_name = fields.Str(required=True)
    body = fields.Str(required=True)
    message = fields.Str(required=True)

    diff = fields.Nested(CommitDiffSchema)

    @post_load
    def flatten(self, data, **kwargs) -> Commit:
        dt: datetime = data["date"]

        commit = Commit(
            hash=data["hash"],
            repo=data["repo"],
            ts=dt,
            author_email=data["author_email"],
            author_name=data["author_name"],
        )

        if "diff" in data:
            additions = data["diff"]["insertions"]
            deletions = data["diff"]["deletions"]
            delta_change = max(additions, deletions)

            commit.additions = additions
            commit.deletions = deletions
            commit.delta_change = delta_change
            commit.files_changed = data["diff"]["changed"]

        return commit


class UploadSchema(Schema):
    repo = fields.String(required=True)
    commits = fields.List(fields.Nested(CommitSchema))


class FlatCommitSchema(Schema):
    class Meta:
        fields = (
            "hash",
            "repo",
            "ts",
            "author_email",
            "author_name",
            "additions",
            "deletions",
            "delta_change",
            "files_changed",
        )


class HistogramSchema(Schema):
    class Meta:
        fields = (
            "repo",
            "ts",
            "files",
            "adds",
            "dels",
            "commits",
        )
