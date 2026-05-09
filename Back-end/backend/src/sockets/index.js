const logger = require("../utils/logger");
const { subscribe } = require("../services/redisService");

function registerSockets(io) {
  // Bridge Redis Pub/Sub → Socket.io
  const channels = [
    "face_detected",
    "tracking_alert",
    "privacy_enabled",
    "privacy_disabled",
    "analytics_update",
    "camera_connected",
  ];

  channels.forEach((channel) => {
    subscribe(channel, (data) => {
      io.emit(channel, data);
    });
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Client can subscribe to specific rooms/cameras
    socket.on("subscribe_camera", (cameraId) => {
      socket.join(`camera:${cameraId}`);
      logger.info(`Socket ${socket.id} subscribed to camera:${cameraId}`);
    });

    socket.on("unsubscribe_camera", (cameraId) => {
      socket.leave(`camera:${cameraId}`);
      logger.info(`Socket ${socket.id} unsubscribed from camera:${cameraId}`);
    });

    // Client can request current status
    socket.on("request_status", () => {
      const analyticsService = require("../services/analyticsService");
      socket.emit("analytics_update", analyticsService.getCounters());
    });

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  logger.info("Socket.io handlers registered");
}

module.exports = registerSockets;
