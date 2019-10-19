import json
from os import getenv
from airflow.hooks.base_hook import BaseHook
from algoliasearch.search_client import SearchClient
from google.cloud import bigquery
from google.cloud.bigquery.job import QueryJobConfig


def bigquery_to_algolia(**kwargs):
    query = kwargs["templates_dict"]["query"]
    algolia_app_id = kwargs["templates_dict"]["algolia_app_id"]
    algolia_key = kwargs["templates_dict"]["algolia_key"]

    # load gcp project id
    conn = BaseHook.get_connection("google_cloud_default")
    gcp_project = json.loads(conn.get_extra())["extra__google_cloud_platform__project"]

    # Init clients
    algolia = SearchClient.create(algolia_app_id, algolia_key)
    bq = bigquery.Client(project=gcp_project)

    # Run the query against the cloud
    job = bq.query(
        query, location="US", job_config=QueryJobConfig(use_legacy_sql=False)
    )

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
