from argparse import ArgumentParser
from algoliasearch.search_client import SearchClient
from google.cloud import bigquery
from google.cloud.bigquery.job import QueryJobConfig

# Get the timestamp
parser = ArgumentParser()
parser.add_argument("ds")
args = parser.parse_args()
ds = args.ds

# Init clients
algolia = SearchClient.create("ENR4KIKXXV", "d5a9caca8f387a115af07f957d08ade9")
bq = bigquery.Client()

# Format query with timestamp
query = """
#standardSQL
SELECT
  repo_name,
  SUM(count) as count,
  SUM(actors) as actors,
  ANY_VALUE(ds) as ds
FROM
  `githubtrends-255020.github_trends.github_all_daily_events`
WHERE
  ds = '{ds}'
GROUP BY
  repo_name
ORDER BY
  actors DESC,
  count DESC
LIMIT 9500
""".strip().format(
    ds=ds
)

# Run the query against the cloud
job = bq.query(query, location="US", job_config=QueryJobConfig(use_legacy_sql=False))


# Parse results
def convert_row(row):
    repo = dict(row)
    repo["objectID"] = repo["repo_name"]
    owner, name = repo["repo_name"].split("/")
    repo["owner"] = owner
    repo["name"] = name
    return repo


# Use parser, save results
index = algolia.init_index("github_repos")
index.replace_all_objects([convert_row(row) for row in job])
