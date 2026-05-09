const analyticsService = require("../services/analyticsService");
const { getRedis } = require("../services/redisService");
const { getPool } = require("../services/postgresService");

async function getStatus(request, reply) {
  const counters = analyticsService.getCounters();

  let redisOk = false;
  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      redisOk = true;
    }
  } catch {
    redisOk = false;
  }

  let pgOk = false;
  try {
    const pool = getPool();
    if (pool) {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      pgOk = true;
    }
  } catch {
    pgOk = false;
  }

  return reply.send({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: counters.uptimeSeconds,
    services: {
      redis: redisOk ? "connected" : "disconnected",
      postgres: pgOk ? "connected" : "disconnected",
    },
    counters: {
      totalDetections: counters.totalDetections,
      activeCameras: counters.activeCameras,
      alertsTriggered: counters.alertsTriggered,
      privacyMode: counters.privacyMode,
    },
  });
}

module.exports = { getStatus };
