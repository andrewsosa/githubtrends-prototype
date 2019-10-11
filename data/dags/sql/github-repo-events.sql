SELECT
  ds,
  type,
  count,
  actors
FROM
  `githubtrends-255020.github_trends.github_all_daily_events`
WHERE
  repo_name = {{ params.repo_name }}
ORDER BY
  ds DESC,
  type
