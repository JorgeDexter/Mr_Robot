const { query } = require("../services/postgresService");
const logger = require("../utils/logger");

/**
 * Aggregation queries for analytics dashboard data.
 * These are heavier queries meant for periodic or on-demand analytics,
 * not per-request hot paths.
 */

async function getDetectionsByCamera(limit = 10) {
  try {
    const result = await query(
      `SELECT camera_id, COUNT(*) as detection_count, AVG(confidence) as avg_confidence
       FROM detections
       GROUP BY camera_id
       ORDER BY detection_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

async function getDetectionsOverTime(intervalMinutes = 60) {
  try {
    const result = await query(
      `SELECT
         date_trunc('minute', created_at) as bucket,
         COUNT(*) as count
       FROM detections
       WHERE created_at > NOW() - INTERVAL '${intervalMinutes} minutes'
       GROUP BY bucket
       ORDER BY bucket ASC`
    );
    return result.rows;
  } catch {
    return [];
  }
}

async function getRecentAlerts(limit = 20) {
  try {
    const result = await query(
      `SELECT event_type, payload, created_at
       FROM events_log
       WHERE event_type IN ('tracking_alert', 'privacy_enabled', 'privacy_disabled')
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

async function getHighConfidenceDetections(threshold = 0.9, limit = 20) {
  try {
    const result = await query(
      `SELECT detection_id, camera_id, confidence, metadata, created_at
       FROM detections
       WHERE confidence >= $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [threshold, limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

module.exports = {
  getDetectionsByCamera,
  getDetectionsOverTime,
  getRecentAlerts,
  getHighConfidenceDetections,
};
