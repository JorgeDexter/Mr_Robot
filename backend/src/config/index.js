module.exports = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER || "surveillance",
    password: process.env.POSTGRES_PASSWORD || "surveillance_secret",
    database: process.env.POSTGRES_DB || "surveillance_db",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  },
  demo: {
    enabled: process.env.DEMO_MODE === "true",
    intervalMs: parseInt(process.env.DEMO_INTERVAL_MS, 10) || 3000,
  },
};
