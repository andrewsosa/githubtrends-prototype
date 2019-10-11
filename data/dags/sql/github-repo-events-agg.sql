SELECT
  ds,
  SUM(count) as count,
  SUM(actors) as actors
FROM
  `githubtrends-255020.github_trends.github_all_daily_events`
WHERE
  repo_name = {{ params.repo_name }}
GROUP BY
  ds
ORDER BY
  ds DESC
