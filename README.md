# json-store-list

[![Build Status](https://travis-ci.org/cedced19/json-store-list.svg?branch=master)](https://travis-ci.org/cedced19/json-store-list)

Simple JSON database to use with a Rest Api.

```bash
npm i --save json-store-list
```

This module is inspired from [juliangruber/json-store](https://github.com/juliangruber/json-store). The main difference is that `json-store-list` store data as an array and asynchronously.

First init the store (make sure that the path is correctly defined):
```javascript
var JSONStore = require('json-store-list');
var db = JSONStore('./index.json');
```

## Functions

* `db.getAll()`: get the whole file
* `db.get(label, key, cb)`: search an object, example: `db.get('id', 1, function (err, obj) {...})`
* `db.post(obj, cb)`: add a new object in the store
* `db.delete(label, key, cb)`: delete an object, example: `db.get('id', 1, function (err) {...})`
* `db.put(label, key, newValue, cb)`: replace an object by a new one, example: `db.get('id', 1, function (err) {...})`