import { BigQuery } from "@google-cloud/bigquery";

export function client() {
  return new BigQuery({
    projectId: "githubtrends-255020",
    credentials: JSON.parse(Buffer.from(process.env.GCP_KEYFILE, "base64")),
    scopes: ["https://www.googleapis.com/auth/bigquery"],
  });
}

export async function query(sql) {
  const [job] = await client().createQueryJob({
    query: sql,
    location: "US",
  });

  const [rows] = await job.getQueryResults();
  return rows;
}
