/**
 * Usage:
 *  - /api/activity/callback?repo=andrew/andrewsosa.dev
 */

import nextConnect from "next-connect";
import morgan from "morgan";
import database from "../../../middleware/database";

const handler = nextConnect();

handler.use(morgan("dev"));
handler.use(database);

handler.post(async (req, res) => {
  // Iterate commits, upserting each one into collection
  req.body.forEach((commit) => {
    try {
      req.db
        .collection("commits")
        .updateOne(
          { hash: commit.hash },
          { $set: { ...commit } },
          { upsert: true, multi: false }
        );
    } catch (err) {
      console.error(err);
      console.log("duuurrr");
    }
  });
  return res.status(200).json(null);
});

export default handler;
