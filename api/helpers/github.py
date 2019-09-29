import requests

def url(repo):
    return "https://api.github.com/repos/{repo}/stats/contributors".format(repo=repo)


