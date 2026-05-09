const Fastify = require("fastify");
const cors = require("@fastify/cors");
const helmet = require("@fastify/helmet");
const rateLimit = require("@fastify/rate-limit");
const { Server: SocketServer } = require("socket.io");

const logger = require("./utils/logger");
const { connectRedis, getRedis } = require("./services/redisService");
const { connectPostgres } = require("./services/postgresService");
const registerSockets = require("./sockets");
const { startDemoEmitter } = require("./sockets/demoEmitter");

// Routes
const statusRoutes = require("./routes/status");
const analyticsRoutes = require("./routes/analytics");
const detectRoutes = require("./routes/detect");
const privacyRoutes = require("./routes/privacy");

async function buildApp() {
  const app = Fastify({
    logger: false,
  });

  // --- Security & middleware ---
  await app.register(helmet, { global: true });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  });

  // --- External services ---
  await connectRedis();
  await connectPostgres();

  // Decorate fastify instance so routes/controllers can access services
  app.decorate("redis", getRedis());

  // --- REST routes ---
  app.register(statusRoutes, { prefix: "/" });
  app.register(analyticsRoutes, { prefix: "/" });
  app.register(detectRoutes, { prefix: "/" });
  app.register(privacyRoutes, { prefix: "/privacy" });

  // --- Socket.io ---
  // Attach after fastify is ready so we have the raw http server
  app.addHook("onReady", async () => {
    const io = new SocketServer(app.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
      },
    });

    app.decorate("io", io);
    registerSockets(io);

    // Start fake demo event emitter when in demo mode
    if (process.env.DEMO_MODE === "true") {
      startDemoEmitter(io);
      logger.info("Demo mode ACTIVE — emitting fake events");
    }
  });

  return app;
}

module.exports = buildApp;
