var url = require('url');
var fs = require('fs');
var crypto = require('crypto');

var postcss = require('postcss');
var path = require('canonical-path');

var checksums = {};

module.exports = postcss.plugin('postcss-cachebuster', function (opts) {
  opts = opts || {};
  opts.imagesPath = opts.imagesPath || '';
  opts.type = opts.type || 'mtime';

  return function (css) {

    var inputFile = css.source.input.file;

    css.walkDecls(function(declaration){

      // only image and font related declarations
      if (declaration.prop !== 'background' &&
          declaration.prop !== 'background-image' &&
          declaration.prop !== 'border-image' &&
          declaration.prop !== 'src') {
        return;
      }

      // only url
      if (!/url\(('|")?[^'"\)]+('|")?\)/.test(declaration.value)) return;

      var background = /^(.*?)url\(('|")?([^'"\)]+)('|")?\)(.*?)$/.exec(declaration.value);
      var assetUrl = url.parse(background[3]);
      var inputPath = url.parse(inputFile);

      // only locals
      if (inputPath.host) return;
      if (assetUrl.pathname.indexOf('//') == 0) return;
      if (assetUrl.pathname.indexOf(';base64') !== -1) return;

      // resolve path
      if (/^\//.test(assetUrl.pathname)) {
        // absolute
        assetPath = path.normalize(process.cwd()+ '/'+opts.imagesPath+'/' + assetUrl.pathname)
      } else {
        // relative
        assetPath = path.dirname(inputFile)+'/'+assetUrl.pathname;
        assetPath = path.normalize(assetPath);
      }

      // cachebuster
      var cachebuster = null;

      if (opts.type == 'checksum') {
        if (checksums[assetPath]) {
          cachebuster = checksums[assetPath];
        } else {
          var data = fs.readFileSync(assetPath).toString();
          cachebuster = crypto.createHash('md5')
            .update(data)
            .digest('hex');

          checksums[assetPath] = cachebuster;
        }

      } else {
        var mtime = fs.statSync(assetPath).mtime;
        cachebuster = mtime.getTime().toString(16);
      }

      // complete url with cachebuster
      if (assetUrl.search && assetUrl.search.length > 1) {
        assetUrl.search = assetUrl.search + '&v' + cachebuster;
      } else {
        assetUrl.search = '?v' + cachebuster;
      }

      // replace old value
      declaration.value = background[1]+"url('"+url.format(assetUrl)+"')"+background[5];

    })

  };
});
