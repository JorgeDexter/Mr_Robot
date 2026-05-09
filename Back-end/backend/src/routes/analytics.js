const { getAnalytics } = require("../controllers/analyticsController");

async function analyticsRoutes(fastify) {
  fastify.get("/analytics", getAnalytics);
}

module.exports = analyticsRoutes;
