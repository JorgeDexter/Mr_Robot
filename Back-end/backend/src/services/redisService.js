const logger = require("../utils/logger");

async function connectRedis() {
  logger.warn("Redis disabled for local MVP development");
  return null;
}

function getRedis() {
  return null;
}

function getSubscriber() {
  return null;
}

async function publish(channel, data) {
  logger.info(`Mock publish to ${channel}`);
}

function subscribe(channel, handler) {
  logger.info(`Mock subscribe to ${channel}`);
}

module.exports = {
  connectRedis,
  getRedis,
  getSubscriber,
  publish,
  subscribe,
};