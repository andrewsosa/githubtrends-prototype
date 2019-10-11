from datetime import datetime, timedelta
from os import path

from airflow import DAG
from airflow.contrib.operators.bigquery_operator import BigQueryOperator
from airflow.contrib.operators.bigquery_to_gcs import BigQueryToCloudStorageOperator
from airflow.contrib.operators.datastore_import_operator import DatastoreImportOperator


default_args = {
    "owner": "andrew",
    "depends_on_past": False,
    "start_date": datetime(2019, 10, 1),
    "email": ["andrew@andrewsosa.com"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=1),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
}

with DAG(
    "github-activity",
    default_args=default_args,
    schedule_interval="@daily",
    catchup=True,
) as dag:

    # bq mk githubtrends:github_trends
    # bq mk --time_partitioning_type=DAY githubtrends:github_trends.github_daily_metrics

    DAILY_SNAPSHOT_TABLE = (
        "githubtrends-255020.github_trends.github_daily_events${{ ds_nodash }}"
    )
    # GCS_BUCKET = "github_trends_exports"

    bq_query_daily_snapshot = BigQueryOperator(
        task_id="bq_github_daily_events",
        bigquery_conn_id="google_cloud_default",
        sql="./sql/github-daily-events.sql",
        destination_dataset_table=DAILY_SNAPSHOT_TABLE,
        create_disposition="CREATE_NEVER",
        write_disposition="WRITE_TRUNCATE",
        allow_large_results=True,
        use_legacy_sql=False,
        location="US",
    )

    # bq_export_snapshot_to_gcs = BigQueryToCloudStorageOperator(
    #     task_id="bq_export_snapshot_to_gcs",
    #     bigquery_conn_id="google_cloud_default",
    #     source_project_dataset_table=DAILY_SNAPSHOT_TABLE,
    #     destination_cloud_storage_uris=[
    #         "gs://{{ params.GCS_BUCKET }}/daily_metrics/{{ ds_nodash }}/daily_metrics_{{ ds_nodash }}.csv"
    #     ],
    #     export_format="CSV",
    #     params=dict(GCS_BUCKET=GCS_BUCKET),
    # )

    # ds_import_gcs_snapshot = DatastoreImportOperator(
    #     task_id="gds_import_gcs_snapshot",
    #     bucket="gs://{GCS_BUCKET}/",

    # )

    # bq_query_daily_snapshot >> bq_export_snapshot_to_gcs

