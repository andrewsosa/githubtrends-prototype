#standardSQL
SELECT
  repo.name as repo_name,
  SUM(1) AS count,
  COUNT(DISTINCT actor.login) AS actors,
  DATE(created_at) as ds
FROM `githubarchive.day.{{ ds_nodash }}`
GROUP BY
  repo.name,
  ds
ORDER BY
  actors DESC,
  count DESC
LIMIT 10000
