import { send } from "micro";
import moment from "moment";
import Joi from "@hapi/joi";
import * as BigQuery from "../lib/api/bigquery";
import withCache from "../lib/api/cache";
import middleware, { validate } from "../lib/api/middleware";
import qs from "../lib/api/querystring";

const withJoi = validate(
  Joi.object({
    repo: Joi.string()
      .pattern(/^[A-Za-z0-9\-.]+\/[A-Za-z0-9\-.]+$/)
      .required(),
    start: Joi.date().required(),
  })
);

async function handler(req, resp, save) {
  const { repo, start } = qs(req);
  const end = moment().format("YYYY-MM-DD");

  const rows = await BigQuery.query(
    `
    SELECT
      ds,
      SUM(count) as count,
      SUM(actors) as actors
    FROM
      \`githubtrends-255020.github_trends.github_all_daily_events\`
    WHERE
      repo_name = "${repo}"
      AND ds >= DATE "${start}"
      AND ds <= DATE "${end}"
    GROUP BY
      ds
    ORDER BY
      ds DESC
    `
  );

  send(
    resp,
    200,
    save(rows.map(({ actors, ds }) => ({ t: ds.value, y: actors })))
  );
}

const ttl = 60 * 60 * 24;
export default middleware(withJoi(withCache(ttl, handler)));
