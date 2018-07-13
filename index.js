var fs = require('fs');

function Store(path) {
    this.path = path;
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));
    this.Store = JSON.parse(fs.readFileSync(path));
}

Store.prototype.getAll = function () {
    return this.Store;
}

Store.prototype.get = function (label, key, cb) {
    if (!label) {
        let err = new Error('No label has been provided.')
        return cb(err);
    }
    if (!key) {
        let err = new Error('No key has been provided.')
        return cb(err);
    }
    let search = this.Store.find(o => o[label] == key);
    if (typeof search === undefined) {
        let err = new Error('No items match this request.')
        return cb(err);
    }
    return cb(null, search);
}

Store.prototype.post = function (value, cb) {
    this.Store.push(value);
    this.save(cb);
}

Store.prototype.delete = function (label, key, cb) {
    if (!label) {
        let err = new Error('No label has been provided.');
        return cb(err);
    }
    if (!key) {
        let err = new Error('No key has been provided.');
        return cb(err);
    }
    this.Store.forEach((o, k) => {
        if (o[label] == key) {
            this.Store.splice(k, 1);
        }
    });
    this.save(cb);
}

Store.prototype.put = function (label, key, newValue, cb) {
    if (!label) {
        let err = new Error('No label has been provided.');
        return cb(err);
    }
    if (!key) {
        let err = new Error('No key has been provided.');
        return cb(err);
    }
    this.Store.forEach((o, k) => {
        if (o[label] == key) {
            this.Store.splice(k, 1);
        }
    });
    this.Store.push(newValue);
    this.save(cb);
}

Store.prototype.save = function (cb) {
    fs.writeFile(this.path, JSON.stringify(this.Store), cb);
}

module.exports = function (path) {
    return new Store(path);
}