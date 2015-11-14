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
    var horseMtime = fs.statSync('./test/images/horse.jpg').mtime.getTime().toString(16);

    it('Process image, with relative path', function (done) {
        assert('a { background-image : url("images/horse.jpg"); }', 
               'a { background-image : url("images/horse.jpg?v'+horseMtime+'"); }', 
               { cssPath : '/test/'}, done);
    });

    it('Process image, with absolute path', function (done) {
        assert('a { background-image : url("/images/horse.jpg"); }', 
               'a { background-image : url("/images/horse.jpg?v'+horseMtime+'"); }', 
               { imagesPath : '/test/'}, done);
    });

    it('Process image, with spaces in name', function (done) {
        assert('a { background-image : url("/images/horse with spaces.jpg"); }', 
               'a { background-image : url("/images/horse%20with%20spaces.jpg?v'+horseMtime+'"); }', 
               { imagesPath : '/test/'}, done);
    });

    it('Skip base64 images', function (done) {
        assert('a { background-image : url("data:image/png;base64,iVBORw0"); }', 
               'a { background-image : url("data:image/png;base64,iVBORw0"); }', 
               { imagesPath : '/test/'}, done);
    });

    it('Skip unresolved images', function (done) {
        assert('a { background-image : url("there/is/no/image.jpg"); }', 
               'a { background-image : url("there/is/no/image.jpg"); }', 
               { imagesPath : '/test/'}, done);
    });

});
