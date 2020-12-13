CREATE TABLE raw.commits (
    hash VARCHAR(255) PRIMARY KEY,
    author_email TEXT,
    author_name TEXT,
    body TEXT,
    ts TIMESTAMP,
    files_changed INTEGER,
    line_deletions INTEGER,
    line_additions INTEGER,
    message TEXT,
    repo TEXT
);
