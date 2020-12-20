from datetime import datetime, timedelta

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.declarative import DeclarativeMeta

db = SQLAlchemy()
BaseModel: DeclarativeMeta = db.Model


class Commit(BaseModel):

    __tablename__ = "commits"

    hash = db.Column(db.Text, primary_key=True)
    repo = db.Column(db.Text, nullable=False)
    ts = db.Column(db.DateTime, nullable=False)

    author_email = db.Column(db.Text, nullable=True)
    author_name = db.Column(db.Text, nullable=True)

    additions = db.Column(db.Integer, nullable=False)
    deletions = db.Column(db.Integer, nullable=False)
    delta_change = db.Column(db.Integer, nullable=False)
    files_changed = db.Column(db.Integer, nullable=False)


class RepoLastUpdate(BaseModel):

    __tablename__ = "repo_lastupdate"

    repo = db.Column(db.Text, primary_key=True)
    last_update = db.Column(db.DateTime, nullable=False)


class RepoDownloadStatus(BaseModel):

    __tablename__ = "repo_downloadstatus"

    repo = db.Column(db.Text, primary_key=True)
    download_started = db.Column(db.DateTime, nullable=True)
    download_finished = db.Column(db.DateTime, nullable=True)

    @property
    def in_progress(self) -> bool:
        return (
            # check if a download is started and not finished
            (
                (self.download_started and not self.download_finished)
                or (
                    # start after finish
                    self.download_started
                    > self.download_finished
                )
            )
            # 5m timeout
            and datetime.now() - self.download_started < timedelta(minutes=5)
        )
