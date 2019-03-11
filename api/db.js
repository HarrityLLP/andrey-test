const MongoClient = require('mongodb').MongoClient;

const instance = {
  connect: (connection, dbName, options) =>
    MongoClient.connect(connection, options).then(client => {
      instance.client = client;
      instance.db = client.db(dbName);

      return instance.db.collection('patents').createIndex({
        // title: 'text',
        text: 'text'
      });
    }),
  close: () => {
    if (instance.client) {
      instance.client.close();
      instance.client = null;
      instance.db = null;
    }
  },
  get patents() {
    return this.db && this.db.collection('patents');
  }
};

module.exports = instance;
