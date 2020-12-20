import nextConnect from "next-connect";
import morgan from "morgan";
import git from "simple-git/promise";
import { queryParams } from "./_utils";

export async function remoteExists(repo) {
  try {
    console.log(`Checking if ${repo} exists...`);
    await git().listRemote([`http://github.com/${repo}`]);
    console.log(`http://github.com/${repo} seems to exists...`);
    return true;
  } catch (err) {
    console.log(`http://github.com/${repo} does not exists...`);
    return false;
  }
}

export const repoExistsHandler = async (req, res) => {
  const { repo } = req.query;
  const exists = await remoteExists();
  if (!exists) return res.status(404).end(`Repository ${repo} not found.`);
  return res.status(200).end();
};

export default nextConnect()
  .use(morgan("dev"))
  .use(queryParams(["repo"]))
  .get(repoExistsHandler);
