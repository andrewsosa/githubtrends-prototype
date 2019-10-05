const algolia = require("algoliasearch");
const { BigQuery } = require("@google-cloud/bigquery");

async function loadBigQueryData() {
  const bq = new BigQuery();

  const query = `
    #legacySQL
    SELECT
      repo.name,
      repo.url,
      COUNT(DISTINCT actor.login) as actors,
      CURRENT_DATE() as record_date,
    FROM (TABLE_DATE_RANGE([githubarchive:day.],
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP()
    ))
    GROUP BY repo.name, repo.url
    ORDER BY actors DESC
    LIMIT 10000
  `;

  const [job] = await bq.createQueryJob({
    query,
    location: "US",
    use_legacy_sql: true
  });
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();
  return rows;
}

async function uploadToAlgolia(data) {
  const client = algoliasearch("YourApplicationID", "YourAdminAPIKey");
  const index = client.init_index("github_repos");

  batch = data.map(row => {
    const [owner, name] = row.repo_name.split("/");

    return {
      ...row,
      objectID: row.repo_name,
      owner,
      name
    };
  });

  index.save_objects(batch);

  return "Done";
}

exports.http = async (request, response) => {
  try {
    const rows = await loadBigQueryData();
    const resp = await uploadToAlgolia(rows);
    response.status(200).send(resp);
  } catch (e) {
    response.status(500).send(e);
  }
};
