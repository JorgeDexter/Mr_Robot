require("dotenv").config();

const buildApp = require("./src/app");
const logger = require("./src/utils/logger");

const start = async () => {
  const app = await buildApp();

  const host = process.env.HOST || "0.0.0.0";
  const port = parseInt(process.env.PORT, 10) || 3001;

  try {
    await app.listen({ host, port });
    logger.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    logger.error(err, "Failed to start server");
    process.exit(1);
  }
};

start();
