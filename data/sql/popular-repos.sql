#legacySQL
SELECT
  repo.name,
  repo.url,
  COUNT(DISTINCT actor.login) as actors,
  CURRENT_DATE() as record_date,
FROM (TABLE_DATE_RANGE([githubarchive:day.],
  TIMESTAMP('{ds}'),
  TIMESTAMP('{ds}')
))
GROUP BY repo.name, repo.url
ORDER BY actors DESC
LIMIT 10000

