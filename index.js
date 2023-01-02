var fs = require('fs');

function Store(path, maxEl) {
    this.path = path;
    if (typeof maxEl == 'number') {
        this.maxEl = maxEl;
    } else {
        this.maxEl = false;
    }
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));
    this.Store = JSON.parse(fs.readFileSync(path));
}

Store.prototype.getAll = function () {
    return this.Store;
}

Store.prototype.get = function (label, key, cb) {
    if (typeof label !== 'string') {
        let err = new Error('No correct label has been provided.')
        return cb(err);
    }
    let list = [];
    this.Store.forEach((o, k) => {
        if (o[label] == key) {
            list.push(o);
        }
    });
    if (list.length > 1) {
        cb(null, list);
    } else if (list.length === 1) {
        cb(null, list[0]);
    } else {
        let err = new Error('No item match this request.');
        err.status = 404;
        return cb(err);
    }
}

Store.prototype.post = function (value, cb) {
    this.Store.push(value);
    this.save(cb);
}

Store.prototype.delete = function (label, key, cb) {
    if (typeof label !== 'string') {
        let err = new Error('No correct label has been provided.');
        return cb(err);
    }
    let found = false;
    this.Store.forEach((o, k) => {
        if (o[label] == key) {
            found = true;
            this.Store.splice(k, 1);
        }
    });
    if (found) {
        this.save(cb);
    } else {
        let err = new Error('No item match this request.');
        err.status = 404;
        return cb(err);
    }
}

Store.prototype.put = function (label, key, newValue, cb) {
    if (typeof label !== 'string') {
        let err = new Error('No correct label has been provided.');
        return cb(err);
    }
    if (typeof newValue !== 'object') {
        let err = new Error('No correct object has been provided.');
        return cb(err);
    }
    let found = false;
    this.Store.forEach((o, k) => {
        if (o[label] == key) {
            found = true;
            this.Store.splice(k, 1);
        }
    });
    if (found) {
        this.Store.push(newValue);
        this.save(cb);
    } else {
        let err = new Error('No item match this request.');
        err.status = 404;
        return cb(err);
    }
}

Store.prototype.save = function (cb) {
    if (this.maxEl) {
        this.Store = this.Store.slice(-this.maxEl);
    }
    fs.writeFile(this.path, JSON.stringify(this.Store), cb);
}

module.exports = function (path, maxEl) {
    return new Store(path, maxEl);
}