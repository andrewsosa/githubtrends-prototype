require("dotenv").config();
const axios = require("axios");
const redis = require("ioredis");

const { REDIS_PASS, REDIS_HOST } = process.env;
const client = new redis(`redis://:${REDIS_PASS}@${REDIS_HOST}/0`);

/**
 * Wraps an http request handler in some simple error handling logic
 * @param {*} handler http request handler
 */
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

/**
 * A simple logging function prepending message with a date.
 * @param {string} message text to print to console
 */
function log(message) {
  console.log(`[${new Date()}]: ${message}`);
}

/**
 * Recursive fetch call which handles retries if data is not prepared.
 * @param {string} repo github repository name, e.g. "facebook/react"
 * @param {number} counter recursive control counter
 * @return {Promise<Array<{}>} Resolves to a promise containing an array
 * of contributor entries.
 */
function fetch(repo, counter) {
  counter = counter || 0;

  log(`fetch -- ${repo} attempt ${counter}`);
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

/**
 * Handles checking redis for cached response, and then checking github
 * otherwise.
 * @param {*} request gcloud http request object
 * @param {*} response gcloud http response oject
 */
async function handler(request, response) {
  const repo = request.url.slice(1);
  const cache = JSON.parse(await client.get(repo));

  log(`cache -- ${repo} ${cache ? "hit" : "miss"}`);
  if (cache) {
    return response.status(200).send(cache);
  }

  const data = await fetch(repo);

  await client.set(repo, JSON.stringify(data), "EX", 60 * 60 * 24);
  return response.status(201).send(data);
}

exports.http = wrapped(handler);
