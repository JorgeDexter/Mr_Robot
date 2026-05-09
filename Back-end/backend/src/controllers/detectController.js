const { processDetection } = require("../services/detectionService");

async function postDetect(request, reply) {
  const payload = request.body || {};

  if (!payload.camera_id) {
    return reply.status(400).send({
      error: "camera_id is required",
      example: {
        camera_id: "cam_01",
        confidence: 0.92,
        bbox: { x: 120, y: 80, w: 200, h: 200 },
        metadata: { label: "person_A" },
      },
    });
  }

  const detection = await processDetection(payload, request.server.io);

  return reply.status(201).send({
    success: true,
    detection,
  });
}

module.exports = { postDetect };
