# Githubtrends


event types:

WatchEvent PullRequestEvent CommitCommentEvent PullRequestReviewCommentEvent ForkEvent GollumEvent PublicEvent ReleaseEvent IssueCommentEvent PushEvent CreateEvent DeleteEvent IssuesEvent MemberEvent

workflow:

get top 10K most popular repos from "today"
github_daily_top_repos
load all events from those repos into snapshot table
github_top_repo_daily_events
load top repos
