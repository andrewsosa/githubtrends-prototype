.PHONY: contributor-activity

contributor-activity:
	gcloud functions deploy contributor-activity \
		--source=functions/contributor-activity \
		--env-vars-file=functions/contributor-activity/.env.yaml
		--entry-point=http \
		--trigger-http \
		--stage-bucket=githubtrends-bucket \
		--runtime nodejs10

render-chartdata:
	gcloud functions deploy render-chartdata \
		--source=functions/render-chartdata \
		--env-vars-file=functions/render-chartdata/.env.yaml
		--entry-point=handler \
		--trigger-http \
		--stage-bucket=githubtrends-bucket \
		--runtime nodejs10


