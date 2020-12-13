import os from "os";
import path from "path";

import nextConnect from "next-connect";
import morgan from "morgan";
import git from "simple-git/promise";
import got from "got";
import rimraf from "rimraf";
import { v4 as uuid } from "uuid";

export async function downloadHistory(repo) {
  const repoPath = path.resolve(os.tmpdir(), uuid());
  let records = [];

  // Clone the repo
  try {
    console.log(`Starting download of ${repo} into ${repoPath}...`);
    await git().clone(`http://github.com/${repo}`, repoPath, ["--no-checkout"]);
    console.log(`Downloaded ${repo}.`);

    // Get and return log
    const { all: commits } = await git(repoPath).log([
      `--all`,
      `--no-merges`,
      `--shortstat`,
    ]);

    // Annotate records with the repo
    records = Array.from(commits).map((el) => ({ ...el, repo }));
  } catch (err) {
    // If there's an error anywhere, catch and report
    console.error(err);
  } finally {
    // Lastly, make sure we cleanup
    try {
      await new Promise((res, rej) => {
        rimraf(repoPath, (err) => {
          if (err) rej(err);
          else {
            console.log(`Removed ${repoPath}.`);
            res();
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  return records;
}

const handler = nextConnect();

handler.use(morgan("dev"));
handler.get(async function gitlog(req, res) {
  const { repo, callbackUrl } = req.query;

  if (!repo) {
    return res.status(400).end("Invalid Request");
  }

  if (callbackUrl) {
    res.status(200).end(null);
    const commits = await downloadHistory(repo);
    return got.post(callbackUrl, {
      json: commits,
    });
  }

  const commits = await downloadHistory(repo);
  return res.status(200).json(commits);
});

export default handler;
