/* eslint-disable no-await-in-loop */
import axios from "axios";

/* eslint-disable class-methods-use-this */
export default class CommitService {
  async wait(ms = 1000) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async pull(repo) {
    let statusCode = 202;
    while ([201, 202].includes(statusCode)) {
      try {
        const { status, data: commits } = await axios({
          method: "get",
          url: "http://localhost:3000/api/db/git/histogram",
          params: {
            repo,
          },
        });
        statusCode = status;
        if (status === 200) {
          return { status, repo, commits };
        }
        await this.wait();
      } catch (error) {
        console.error(error);
        break;
      }
    }
    return { statusCode };
  }
}
