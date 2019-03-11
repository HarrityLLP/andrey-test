module.exports = logger =>
  async function(req, res, next) {
    const start = new Date();
    res.on('finish', () => {
      let currentLevel;
      if (res.statusCode >= 500) {
        currentLevel = 'error';
      } else if (res.statusCode >= 400) {
        currentLevel = 'warn';
      } else if (res.statusCode >= 100) {
        currentLevel = 'info';
      }

      if (process.env.NODE_ENV !== 'test') {
        logger.log(
          currentLevel,
          `${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} ${new Date() - start}ms`
        );
      }
    });
    next();
  };
