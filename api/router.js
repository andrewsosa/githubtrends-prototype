/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/newline-after-import: 0 */

require("dotenv").config();

const cors = require("micro-cors")();
const logger = require("morgan")("dev");
const router = require("./util/router");

const routes = ["/api/ticket", "/api/event"];
const handler = routes.map(r => ({ url: `${r}*`, fn: require(`.${r}`) }));

// Use logger in prod, not in dev.
const log =
  process.env.NODE_ENV === "development"
    ? fn => (req, res) => fn(req, res)
    : fn => (req, res) => logger(req, res, () => fn(req, res));

module.exports = cors(log(router(handler)));
