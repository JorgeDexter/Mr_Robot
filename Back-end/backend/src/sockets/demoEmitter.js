const { v4: uuidv4 } = require("uuid");
const config = require("../config");
const logger = require("../utils/logger");
const { processDetection } = require("../services/detectionService");
const { broadcastAnalyticsUpdate } = require("../services/analyticsService");
const { publish } = require("../services/redisService");

const CAMERA_IDS = ["cam_lobby_01", "cam_entrance_02", "cam_parking_03", "cam_hallway_04", "cam_server_room_05"];
const LABELS = ["person_alpha", "person_beta", "person_gamma", "unknown", "employee_142", "visitor_067"];

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Starts the demo event emitter.
 * Cycles through realistic fake surveillance events every N seconds.
 */
function startDemoEmitter(io) {
  const intervalMs = config.demo.intervalMs || 3000;
  let tick = 0;

  const interval = setInterval(async () => {
    tick++;
    const eventType = tick % 5;

    try {
      switch (eventType) {
        // --- face_detected ---
        case 0: {
          const detection = {
            camera_id: randomItem(CAMERA_IDS),
            confidence: randomFloat(0.55, 0.99),
            bbox: {
              x: randomInt(0, 1280),
              y: randomInt(0, 720),
              w: randomInt(80, 300),
              h: randomInt(80, 300),
            },
            metadata: {
              label: randomItem(LABELS),
              frame: randomInt(1, 99999),
            },
          };
          await processDetection(detection, io);
          break;
        }

        // --- tracking_alert ---
        case 1: {
          const alert = {
            type: "perimeter_breach",
            camera_id: randomItem(CAMERA_IDS),
            severity: randomItem(["low", "medium", "high", "critical"]),
            detection_id: uuidv4(),
            message: `Unauthorized movement detected in ${randomItem(["Zone A", "Zone B", "Restricted Area", "Server Room"])}`,
            timestamp: new Date().toISOString(),
          };
          io.emit("tracking_alert", alert);
          await publish("tracking_alert", alert);
          break;
        }

        // --- camera_connected ---
        case 2: {
          const camEvent = {
            camera_id: randomItem(CAMERA_IDS),
            status: randomItem(["online", "online", "online", "reconnecting"]),
            resolution: randomItem(["1920x1080", "1280x720", "3840x2160"]),
            fps: randomItem([24, 30, 60]),
            timestamp: new Date().toISOString(),
          };
          io.emit("camera_connected", camEvent);
          await publish("camera_connected", camEvent);
          break;
        }

        // --- analytics_update ---
        case 3: {
          await broadcastAnalyticsUpdate(io);
          break;
        }

        // --- mixed: another detection with high confidence to trigger alert ---
        case 4: {
          const hotDetection = {
            camera_id: randomItem(CAMERA_IDS),
            confidence: randomFloat(0.88, 0.99),
            bbox: {
              x: randomInt(0, 1280),
              y: randomInt(0, 720),
              w: randomInt(100, 250),
              h: randomInt(100, 250),
            },
            metadata: {
              label: randomItem(LABELS),
              flagged: true,
            },
          };
          await processDetection(hotDetection, io);
          break;
        }
      }
    } catch (err) {
      logger.warn({ err }, "Demo emitter event error");
    }
  }, intervalMs);

  // Emit initial camera_connected burst
  setTimeout(() => {
    CAMERA_IDS.forEach((cam) => {
      const event = {
        camera_id: cam,
        status: "online",
        resolution: "1920x1080",
        fps: 30,
        timestamp: new Date().toISOString(),
      };
      io.emit("camera_connected", event);
    });
    logger.info(`Demo: ${CAMERA_IDS.length} cameras connected`);
  }, 1000);

  return interval;
}

module.exports = { startDemoEmitter };
