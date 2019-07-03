const loki = require('lokijs');
const db = new loki('automate_server_cache.json');

module.exports = {
  AccessKeysCollection: class {
    constructor() {
      this.createDB();
    }

    createDB() {
      this.collection = db.addCollection('asset',{
        unique: ["user_id"],
        autoupdate: true
      });
    }

    addNewKeys(keys) {
      db.removeCollection('asset');
      this.createDB();
      for (let i = 0; i < keys.length; i++) {
        this.createKey(keys[i]);
      }
    }

    createKey(key_data) {
      const key = this.collection.find({user_id: key_data['_id']})[0];
      return key ? key : this.collection.insert(key_data);
    }

    getKeyByPin(access_pin) {
      return this.collection.find({access_pin: access_pin})[0];
    }

    get() {
      return this.collection.find();
    }
  },
  OfflineAccessLogCollection: db.addCollection('asset')
};