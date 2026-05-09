const {
  enablePrivacy,
  disablePrivacy,
  getPrivacyStatus,
} = require("../controllers/privacyController");

async function privacyRoutes(fastify) {
  fastify.post("/enable", enablePrivacy);
  fastify.post("/disable", disablePrivacy);
  fastify.get("/", getPrivacyStatus);
}

module.exports = privacyRoutes;
