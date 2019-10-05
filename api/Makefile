.PHONY: contributor-activity

contributor-activity:
	gcloud functions deploy contributor-activity \
		--source=functions/contributor-activity \
		--env-vars-file=functions/contributor-activity/.env.yaml
		--entry-point=http \
		--trigger-http \
		--stage-bucket=codefresh-bucket \
		--runtime nodejs10


