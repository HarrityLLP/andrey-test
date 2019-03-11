module.exports = {
  log: {
    level: process.env.LOG_LEVEL || 'verbose'
  },
  app: {
    port: process.env.PORT || 3000,
    ip: process.env.IP
  },
  db: {
    url: `mongodb://${process.env.DBHOST || process.env.IP || '127.0.0.1'}`,
    name: process.env.DBNAME || 'patents',
    options: {
      useNewUrlParser: true
    }
  }
};
