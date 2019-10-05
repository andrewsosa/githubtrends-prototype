.PHONY: contributor-activity

contributor-activity:
	gcloud functions deploy contributor-activity \
		--source=functions/contributor-activity \
		--entry-point=http \
		--trigger-http \
		--stage-bucket=codefresh-bucket \
		--runtime nodejs10


