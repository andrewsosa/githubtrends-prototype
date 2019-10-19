.PHONY: sync deps

sync:
	gsutil -m cp -r ./dags gs://us-east1-production-1ca1bb8a-bucket/

deps:
	gcloud composer environments update production --location us-east1 \
		--update-pypi-packages-from-file requirements.txt

