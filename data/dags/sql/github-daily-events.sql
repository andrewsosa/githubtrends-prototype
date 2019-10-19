#standardSQL
SELECT
  repo.name as repo_name,
  type,
  SUM(1) AS count,
  COUNT(DISTINCT actor.login) AS actors,
  DATE(created_at) as ds
FROM `githubarchive.day.{{ ds_nodash }}`
GROUP BY
  type,
  repo.name,
  ds
ORDER BY
  actors DESC,
  count DESC
LIMIT 5000
