FROM python:3.6
ARG AIRFLOW_HOME=/usr/local/airflow/
WORKDIR ${AIRFLOW_HOME}
ENV AIRFLOW_HOME=${AIRFLOW_HOME}

# Install dependencies
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt
ADD airflow.prod.cfg airflow.cfg
ADD dags/ functions/ plugins/ sql/ ${AIRFLOW_HOME}

# Run the server
CMD [ "sh", "-c", "airflow --help" ]
