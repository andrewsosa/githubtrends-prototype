#standardSQL
SELECT
  repo.name as repo_name,
  repo.url as repo_url,
  type,
  SUM(1) AS count,
  COUNT(DISTINCT actor.login) AS actors,
  DATE '{{ ds }}' AS ds
FROM `githubarchive.day.{{ ds_nodash }}`
GROUP BY
  type,
  repo.name,
  repo.url
LIMIT
  16000
