/**
 * Custom per-route rate limiter config.
 * Use as a Fastify route-level option alongside the global @fastify/rate-limit.
 *
 * Example:
 *   fastify.post("/detect", { config: { rateLimit: detectRateLimit } }, handler);
 */

const detectRateLimit = {
  max: 30,
  timeWindow: "1 minute",
};

const privacyRateLimit = {
  max: 10,
  timeWindow: "1 minute",
};

const analyticsRateLimit = {
  max: 60,
  timeWindow: "1 minute",
};

module.exports = {
  detectRateLimit,
  privacyRateLimit,
  analyticsRateLimit,
};
