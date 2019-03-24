const logger = require("./logger");
const app = require("./app");
const config = require("./config");
const db = require("./db");

let server;

db.connect(config.db.url, config.db.name, config.db.options)

  .then(() => (server = app.listen(config.app.port, config.app.ip)))
  .then(() => logger.verbose(`Listening on port ${config.app.port}`))
  .catch(e => {
    logger.error(e && e.message);
    process.exit(1);
  });

const shutdown = signal => {
  logger.verbose("Server is shutting down...");
  db.close();
  logger.verbose("Database connection closed...");
  server &&
    server.close(e => {
      if (e) {
        logger.error(e && e.message);
        process.exit(1);
      }
      logger.warn(`Server stopped (${signal}).`);
      process.exit();
    });
};

process.on("SIGINT", () => {
  logger.verbose("Got SIGINT. Server shutdown started.");
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  logger.verbose("Got SIGTERM. Server shutdown started.");
  shutdown("SIGTERM");
});

process.on("unhandledRejection", (rejection) => {
  logger.error(
    `An unhandledRejection occurred: ${rejection && rejection.message}`
  );
  shutdown("unhandledRejection");
});

module.exports = app;
