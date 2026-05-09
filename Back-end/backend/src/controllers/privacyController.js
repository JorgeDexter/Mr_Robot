const privacyService = require("../services/privacyService");

async function enablePrivacy(request, reply) {
  const event = await privacyService.enablePrivacy(request.server.io);
  return reply.send({ success: true, ...event });
}

async function disablePrivacy(request, reply) {
  const event = await privacyService.disablePrivacy(request.server.io);
  return reply.send({ success: true, ...event });
}

async function getPrivacyStatus(request, reply) {
  const status = privacyService.getPrivacyStatus();
  return reply.send(status);
}

module.exports = { enablePrivacy, disablePrivacy, getPrivacyStatus };
