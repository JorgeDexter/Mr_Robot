const { v4: uuidv4 } = require("uuid");
const { query } = require("./postgresService");
const { publish } = require("./redisService");
const analyticsService = require("./analyticsService");
const logger = require("../utils/logger");

/**
 * Process a face detection event.
 * Persists to PostgreSQL, publishes to Redis, broadcasts via Socket.io.
 */
async function processDetection(payload, io) {
  const detection = {
    detection_id: payload.detection_id || uuidv4(),
    camera_id: payload.camera_id || "cam_unknown",
    confidence: payload.confidence || 0,
    bbox: payload.bbox || null,
    metadata: payload.metadata || {},
    timestamp: new Date().toISOString(),
  };

  // Persist to DB
  try {
    await query(
      `INSERT INTO detections (detection_id, camera_id, confidence, bbox, metadata)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (detection_id) DO NOTHING`,
      [detection.detection_id, detection.camera_id, detection.confidence, detection.bbox, detection.metadata]
    );
  } catch (err) {
    logger.warn("Detection DB write skipped");
  }

  // Log event
  try {
    await query(
      `INSERT INTO events_log (event_type, payload) VALUES ($1, $2)`,
      ["face_detected", detection]
    );
  } catch {
    // silent
  }

  // Update in-memory analytics
  analyticsService.incrementDetections();

  // Check for high-confidence alert
  if (detection.confidence >= 0.85) {
    analyticsService.incrementAlerts();
    const alert = {
      type: "high_confidence_detection",
      detection_id: detection.detection_id,
      camera_id: detection.camera_id,
      confidence: detection.confidence,
      timestamp: detection.timestamp,
    };

    if (io) io.emit("tracking_alert", alert);
    await publish("tracking_alert", alert);
  }

  // Broadcast detection event
  if (io) io.emit("face_detected", detection);
  await publish("face_detected", detection);

  return detection;
}

module.exports = { processDetection };
