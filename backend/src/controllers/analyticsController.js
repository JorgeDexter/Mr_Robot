const analyticsService = require("../services/analyticsService");
const { query } = require("../services/postgresService");

async function getAnalytics(request, reply) {
  const snapshot = await analyticsService.getAnalyticsSnapshot();

  // Try to fetch recent detections from DB
  let recentDetections = [];
  try {
    const result = await query(
      `SELECT detection_id, camera_id, confidence, created_at
       FROM detections ORDER BY created_at DESC LIMIT 20`
    );
    recentDetections = result.rows;
  } catch {
    // DB unavailable — return empty
  }

  // Try to fetch recent events from DB
  let recentEvents = [];
  try {
    const result = await query(
      `SELECT event_type, payload, created_at
       FROM events_log ORDER BY created_at DESC LIMIT 20`
    );
    recentEvents = result.rows;
  } catch {
    // DB unavailable
  }

  return reply.send({
    snapshot,
    recentDetections,
    recentEvents,
    generatedAt: new Date().toISOString(),
  });
}

module.exports = { getAnalytics };
