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
algolia = SearchClient.create("7OG9E7U0M9", "6f2b8b1468b757c902ecbdd87977c05c")
bq = bigquery.Client()

# Format query with timestamp
query = """
#legacySQL
SELECT
  repo.name,
  repo.url,
  COUNT(DISTINCT actor.login) as actors,
  CURRENT_DATE() as record_date,
FROM (TABLE_DATE_RANGE([githubarchive:day.],
  TIMESTAMP('{ds}'),
  TIMESTAMP('{ds}')
))
GROUP BY repo.name, repo.url
ORDER BY actors DESC
LIMIT 2
""".strip().format(
    ds=ds
)

# Run the query against the cloud
job = bq.query(query, location="US", job_config=QueryJobConfig(use_legacy_sql=True))


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
index.save_objects([convert_row(row) for row in job])
