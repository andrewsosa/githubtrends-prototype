require("dotenv").config();
const axios = require("axios");
const redis = require("ioredis");

const { REDIS_PASS, REDIS_HOST } = process.env;
const client = new redis(`redis://:${REDIS_PASS}@${REDIS_HOST}/0`);

function wrapped(handler) {
  return async (request, response) => {
    try {
      return handler(request, response);
    } catch (e) {
      // if (e instanceof Error )
      return response.status(500).send(e);
    }
  };
}

function log(message) {
  console.log(`[${new Date()}]: ${message}`);
}

function fetch(repo, counter) {
  counter = counter || 0;

  log(`Fetch ${repo} attempt ${counter}`);
  return new Promise((resolve, reject) => {
    if (counter >= 3) reject("Too many retries");
    axios
      .get(`https://api.github.com/repos/${repo}/stats/contributors`)
      .then(resp => {
        const { data, status } = resp;
        if (status === 202)
          setTimeout(() => {
            return fetch(repo, counter + 1)
              .then(resolve)
              .catch(reject);
          }, 5000);
        else resolve(data);
      })
      .catch(reject);
  });
}

async function handler(request, response) {
  const repo = request.url.slice(1);
  const cache = JSON.parse(await client.get(repo));

  log(`${repo} cache ${cache ? "hit" : "miss"}`);
  if (cache) {
    return response.status(200).send(cache);
  }

  const data = await fetch(repo);

  await client.set(repo, JSON.stringify(data), "EX", 60 * 60 * 24);
  return response.status(201).send(data);
}

exports.http = wrapped(handler);
