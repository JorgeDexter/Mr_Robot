const { postDetect } = require("../controllers/detectController");

async function detectRoutes(fastify) {
  fastify.post("/detect", postDetect);
}

module.exports = detectRoutes;
