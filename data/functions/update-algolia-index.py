#!/usr/bin/env python

import sys
import json
import pprint
from algoliasearch.search_client import SearchClient

client = SearchClient.create("7OG9E7U0M9", "6f2b8b1468b757c902ecbdd87977c05c")
batch = json.load(sys.stdin)

for repo in batch:
    repo['objectID'] = repo['repo_name']


index = client.init_index("github_repos")
index.save_objects(batch)
