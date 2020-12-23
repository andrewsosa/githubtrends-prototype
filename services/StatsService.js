/* eslint-disable no-await-in-loop */
import axios from "axios";

/* eslint-disable class-methods-use-this */
export default class StatsService {
  async getStats(repo) {
    const stats = await axios({
      method: "get",
      url: `https://api.github.com/repos/${name}`,
    })
      .then((resp) => resp.data)

      // eslint-disable-next-line camelcase
      .then(({ stargazers_count, open_issues, created_at, pushed_at }) => ({
        stargazersCount: stargazers_count,
        openIssues: open_issues,
        createdAt: created_at,
        pushedAt: pushed_at,
      }));

    return stats;
  }
}
