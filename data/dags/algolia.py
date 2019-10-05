from datetime import datetime, timedelta
from os import path

from airflow import DAG
from airflow.operators.bash_operator import BashOperator


default_args = {
    "owner": "andrew",
    "depends_on_past": False,
    "start_date": datetime(2015, 6, 1),
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
    "algolia",
    default_args=default_args,
    schedule_interval=timedelta(days=1),
    catchup=False,
) as dag:

    load_bq_to_algolia = BashOperator(
        task_id="load_bq_to_algolia",
        bash_command="set -e; python {{ params.filepath }} {{ ds }}",
        params=dict(
            filepath=path.abspath(
                path.join(path.dirname(__file__), "../functions/bigquery-to-algolia.py")
            )
        ),
    )
