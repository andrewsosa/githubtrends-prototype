/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/newline-after-import: 0 */

const Router = require("router");
const final = require("finalhandler");

module.exports = handler => {
  const router = Router();
  handler.map(r => router.route(r.url).all(r.fn));
  return (req, res) => router(req, res, final(req, res));
};
