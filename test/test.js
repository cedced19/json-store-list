const assert = require('assert');
const path = require('path');
const fs = require('fs');
const examplePath = path.join(process.cwd(),'/example.json');
const exampleContent = JSON.parse(fs.readFileSync(examplePath));

describe('JSON Storage List', function () {

    it('the module can be required without throwing', function () {
        var JSONStorage = require('../');
    });

    describe('run test', function () {

        beforeEach(function () {
            fs.writeFileSync(examplePath, JSON.stringify(exampleContent));
        });

        after(function () {
            fs.writeFileSync(examplePath, JSON.stringify(exampleContent));
        });

        it('should give the content of example.json', function () {
            var content = require('../')(examplePath).getAll();
            assert.equal(content.length, 2);
        });

        it('should give the element with id "2"', function (done) {
            require('../')(examplePath).get('id', 2, function (err, element) {
                assert.equal(err, null);
                assert.equal(element.name, 'string 2');
                done();
            });
        });

        it('should give the elements with  "prop" equal to "this"', function (done) {
            require('../')(examplePath).get('prop', 'this', function (err, list) {
                assert.equal(err, null);
                assert.equal(list.length, 2);
                assert.equal(list[0].prop, 'this');
                assert.equal(list[1].prop, 'this');
                done();
            });
        });

        it('should give the element with "other" equal to "foo"', function (done) {
            require('../')(examplePath).get('other', 'foo', function (err, element) {
                assert.equal(err, null);
                assert.equal(element.name, 'string 1');
                done();
            });
        });

        it('should remove the element with id "2"', function (done) {
            var store = require('../')(examplePath);
            store.delete('id', 2, function (err) {
                assert.equal(err, null);
                assert.equal(store.getAll().length, 1);
                done();
            });
        });

        it('should change the element with id "2"', function (done) {
            var store = require('../')(examplePath);
            store.put('id', 2, {id: 2, name: "new string"}, function (err) {
                assert.equal(err, null);
                assert.equal(store.getAll().length, 2);
                store.get('id', 2, function (err, element) {
                    assert.equal(err, null);
                    assert.equal(element.name, 'new string');
                    done();
                });
            });
        });

        it('should add an element', function (done) {
            var store = require('../')(examplePath);
            store.post({id: 3}, function (err) {
                assert.equal(err, null);
                assert.equal(store.getAll().length, 3);
                done();
            });
        });

        it('should create new file if it does not exist', function () {
            var example2Path = path.join(process.cwd(),'/example2.json');
            assert.equal(fs.existsSync(example2Path), false);
            var store = require('../')(example2Path);
            assert.equal(fs.existsSync(example2Path), true);
            fs.unlinkSync(example2Path);
        });


    });
});