const { query } = require("./postgresService");
const { publish } = require("./redisService");
const logger = require("../utils/logger");

// In-memory counters (always available even without DB)
const counters = {
  totalDetections: 0,
  activeCameras: 0,
  alertsTriggered: 0,
  privacyMode: false,
  uptime: Date.now(),
};

function getCounters() {
  return {
    ...counters,
    uptimeSeconds: Math.floor((Date.now() - counters.uptime) / 1000),
  };
}

function incrementDetections() {
  counters.totalDetections += 1;
}

function incrementAlerts() {
  counters.alertsTriggered += 1;
}

function setActiveCameras(count) {
  counters.activeCameras = count;
}

function setPrivacyMode(enabled) {
  counters.privacyMode = enabled;
}

async function getAnalyticsSnapshot() {
  const snapshot = getCounters();

  // Try to persist snapshot to DB
  try {
    await query(
      `INSERT INTO analytics_snapshots (total_detections, active_cameras, alerts_triggered, privacy_mode)
       VALUES ($1, $2, $3, $4)`,
      [snapshot.totalDetections, snapshot.activeCameras, snapshot.alertsTriggered, snapshot.privacyMode]
    );
  } catch (err) {
    logger.warn("Analytics snapshot DB write skipped");
  }

  return snapshot;
}

async function broadcastAnalyticsUpdate(io) {
  const snapshot = getCounters();
  io.emit("analytics_update", snapshot);
  await publish("analytics_update", snapshot);
}

module.exports = {
  getCounters,
  incrementDetections,
  incrementAlerts,
  setActiveCameras,
  setPrivacyMode,
  getAnalyticsSnapshot,
  broadcastAnalyticsUpdate,
};
