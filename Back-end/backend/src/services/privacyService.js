const analyticsService = require("./analyticsService");
const { publish } = require("./redisService");
const { query } = require("./postgresService");
const logger = require("../utils/logger");

async function enablePrivacy(io) {
  analyticsService.setPrivacyMode(true);

  const event = {
    privacy: true,
    timestamp: new Date().toISOString(),
    message: "Privacy mode enabled — all tracking suspended",
  };

  try {
    await query(`INSERT INTO events_log (event_type, payload) VALUES ($1, $2)`, [
      "privacy_enabled",
      event,
    ]);
  } catch {
    // silent
  }

  if (io) io.emit("privacy_enabled", event);
  await publish("privacy_enabled", event);

  logger.info("Privacy mode ENABLED");
  return event;
}

async function disablePrivacy(io) {
  analyticsService.setPrivacyMode(false);

  const event = {
    privacy: false,
    timestamp: new Date().toISOString(),
    message: "Privacy mode disabled — tracking resumed",
  };

  try {
    await query(`INSERT INTO events_log (event_type, payload) VALUES ($1, $2)`, [
      "privacy_disabled",
      event,
    ]);
  } catch {
    // silent
  }

  if (io) io.emit("privacy_disabled", event);
  await publish("privacy_disabled", event);

  logger.info("Privacy mode DISABLED");
  return event;
}

function getPrivacyStatus() {
  return { privacyMode: analyticsService.getCounters().privacyMode };
}

module.exports = { enablePrivacy, disablePrivacy, getPrivacyStatus };
