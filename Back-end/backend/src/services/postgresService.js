const { Pool } = require("pg");
const config = require("../config");
const logger = require("../utils/logger");

let pool = null;

async function connectPostgres() {
  pool = new Pool({
    host: config.postgres.host,
    port: config.postgres.port,
    user: config.postgres.user,
    password: config.postgres.password,
    database: config.postgres.database,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err) => {
    logger.warn({ err }, "PostgreSQL pool error — running without database");
  });

  // Attempt a test query; gracefully degrade if DB is unavailable
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    logger.info("PostgreSQL connected");

    // Bootstrap schema
    await bootstrapSchema();
  } catch (err) {
    logger.warn("PostgreSQL unavailable — running in degraded mode (in-memory only)");
  }

  return pool;
}

async function bootstrapSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS detections (
      id            SERIAL PRIMARY KEY,
      detection_id  VARCHAR(64) UNIQUE NOT NULL,
      camera_id     VARCHAR(64),
      confidence    REAL DEFAULT 0,
      bbox          JSONB,
      metadata      JSONB DEFAULT '{}',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS analytics_snapshots (
      id                SERIAL PRIMARY KEY,
      total_detections  INT DEFAULT 0,
      active_cameras    INT DEFAULT 0,
      alerts_triggered  INT DEFAULT 0,
      privacy_mode      BOOLEAN DEFAULT false,
      snapshot_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events_log (
      id          SERIAL PRIMARY KEY,
      event_type  VARCHAR(64) NOT NULL,
      payload     JSONB DEFAULT '{}',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_detections_camera ON detections(camera_id);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events_log(event_type);
  `;

  try {
    await pool.query(schema);
    logger.info("Database schema bootstrapped");
  } catch (err) {
    logger.warn({ err }, "Schema bootstrap failed");
  }
}

function getPool() {
  return pool;
}

async function query(text, params) {
  if (!pool) return { rows: [] };
  return pool.query(text, params);
}

module.exports = {
  connectPostgres,
  getPool,
  query,
};
