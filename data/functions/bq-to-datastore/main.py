from argparse import ArgumentParser
from google.cloud import bigquery, datastore

# Get the timestamp
# parser = ArgumentParser()
# parser.add_argument("ds")
# args = parser.parse_args()
# ds = args.ds

project_name = "MY_PROJECT"
bucket_name = "MY_BUCKET"
dataset_name = "MY_DATASET"
table_name = "MY_TABLE"

bq = bigquery.Client()
ds = datastore.Client()


def handler(request):
    bq_client = bigquery.Client(project=project_name)

    dataset = bq_client.dataset(dataset_name, project=project_name)
    table_to_export = dataset.table(table_name)

    job_config = bigquery.job.ExtractJobConfig()

    extract_job = bq_client.extract_table(
        table_to_export,
        destination_uri,
        # Location must match that of the source table.
        location="US",
        job_config=job_config,
    )

    return "Job with ID {} started exporting data from {}.{} to {}".format(
        extract_job.job_id, dataset_name, table_name, destination_uri
    )

