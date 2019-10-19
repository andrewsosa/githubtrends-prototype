const qs = require("qs");
const url = require("url");

export default req =>
  qs.parse(url.parse(req.url).search, { ignoreQueryPrefix: true });
