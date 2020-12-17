# These commands are for Python stuff, as Node is handled by `npm run [CMD]`
.PHONY: format lint

PYTHONFILES = api/db

# For dev, run Flask API as seperate proc from Vercel Lambda for
# better change dectection and faster reloads
flask:
	FLASK_ENV=development FLASK_APP=api/db/index.py flask run --reload

vercel:
	vercel -A vercel.dev.json dev

# Code QA
format:
	isort --recursive --quiet $(PYTHONFILES)
	black $(PYTHONFILES)

lint:
	isort --recursive --quiet --check --diff $(PYTHONFILES) || exit 1
	flake8 $(PYTHONFILES) || exit 1
	mypy $(PYTHONFILES) || exit 1
	bandit -r $(PYTHONFILES) || exit 1
	black --check --diff $(PYTHONFILES) || exit 1
