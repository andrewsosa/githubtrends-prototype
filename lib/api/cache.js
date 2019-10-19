import Redis from "ioredis";
import { send } from "micro";

const { REDIS_HOST, REDIS_PASSWORD } = process.env;
const client = new Redis(`redis://:${REDIS_PASSWORD}@${REDIS_HOST}/0`);

export default function cache(seconds, handler) {
  return async (request, response) => {
    try {
      console.log("CACHE URL", request.url);
      const data = await client.get(request.url);
      if (data) {
        console.log("CACHE HIT", request.url);
        return send(response, 200, JSON.parse(data));
      }
      console.log("CACHE MISS", request.url);
    } catch (e) {
      console.error("Failed to access cache");
    }
    return handler(request, response, data => {
      client
        .set(request.url, JSON.stringify(data), "EX", seconds)
        .catch(e => console.error(e));
      return data;
    });
  };
}
