const { getStatus } = require("../controllers/statusController");

async function statusRoutes(fastify) {
  fastify.get("/status", getStatus);

  // Root health check
  fastify.get("/", async (request, reply) => {
    return reply.send({
      service: "surveillance-backend",
      version: "1.0.0",
      status: "running",
      docs: {
        "GET  /status": "Service health + counters",
        "GET  /analytics": "Full analytics snapshot + recent data",
        "POST /detect": "Submit a face detection event",
        "POST /privacy/enable": "Enable privacy mode",
        "POST /privacy/disable": "Disable privacy mode",
        "WS   /": "Socket.io realtime events",
      },
    });
  });
}

module.exports = statusRoutes;
