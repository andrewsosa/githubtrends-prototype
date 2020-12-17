/**
 * Usage:
 *  - /api/activity?repo=andrew/andrewsosa.dev
 */

import nextConnect from "next-connect";
import morgan from "morgan";
import got from "got";

const handler = nextConnect({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end(err.toString());
  },
});

handler.use(morgan("dev"));
handler.post(async (req, res) => {
  const { repo } = req.query;

  console.log(repo);

  // Make sure repo was included
  if (!repo) {
    return res.status(400).send("Invalid Request");
  }

  // Check if repo exists
  try {
    // If it's not an "OK" code, it raises err.
    await got(`https://github.com/${repo}`);
  } catch (err) {
    console.log("err");
    return res.status(err.response.statusCode).json(null);
  }

  try {
    await got(`http://${req.headers.host}/api/activity/download`, {
      searchParams: {
        repo,
        callbackUrl: `http://${req.headers.host}/api/db/git/commits/upload`,
      },
    });
    return res.status(202).json(null);
  } catch (err) {
    console.error(err);
    return res.status(500).json(null);
  }
});

export default handler;
