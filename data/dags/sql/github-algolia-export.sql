#standardSQL
SELECT
  repo_name,
  count,
  actors,
  ds
FROM
  `githubtrends-255020.github_trends.github_daily_events`
WHERE
  ds = '{{ ds }}'
ORDER BY
  actors DESC,
  count DESC
LIMIT 5000
