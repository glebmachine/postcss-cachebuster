var postcss = require('postcss');
var expect  = require('chai').expect;
var plugin = require('../');
var fs = require('fs');


var assert = function (input, output, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-cachebuster', function () {
    var horseMtime = fs.statSync('test').mtime.getTime().toString(16);

    it('Process image, with relative path', function (done) {
        assert('.test1 {  background-image : url("images/horse.jpg");}.test2 {  background-image : url("/images/horse.jpg");}.test3 {  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAYAAACI7Fo9AAFS4UlEQVR4Aezae6xm113Y/e+67MtzP5c5Q6=");}.test4 {  background-image : url("imDSDSDages/horse.jpg");}.test5 {  background-image : url("images/horse with spaces.jpg");}', 'a{ }', { }, done);

        //assert('a { background-image : url("images/horse.png"); }', 
        //     'a { background-image : url("images/horse.png?'+horseMtime+'"); }', { }, done);
    });

});
