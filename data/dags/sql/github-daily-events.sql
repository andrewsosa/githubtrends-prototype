#standardSQL
SELECT
  repo.name as repo_name,
  type,
  SUM(1) AS count,
  COUNT(DISTINCT actor.login) AS actors,
  CAST(DATE(created_at) AS DATE) as ds
FROM `githubarchive.day.{{ ds_nodash }}`
GROUP BY
  type,
  repo.name,
  CAST(DATE(created_at) AS DATE)
LIMIT
  16000
