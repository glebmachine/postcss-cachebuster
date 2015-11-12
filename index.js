var url = require('url');
var fs = require('fs');

var postcss = require('postcss');
var path = require('canonical-path');

module.exports = postcss.plugin('postcss-cachebuster', function (opts) {
  opts = opts || {};
  opts.imagesPath = opts.imagesPath || '';

  return function (css) {

    var inputFile = css.source.input.file;

    css.walkDecls(function(declaration){

      // only background, background-image declarations
      if (declaration.prop !== 'background' && declaration.prop !== 'background-image') return;

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
        assetPath = path.dirname(inputPath.pathname)+'/'+assetUrl.pathname;
        assetPath = path.normalize(assetPath);
      }

      // cachebuster
      var mtime = fs.statSync(assetPath).mtime;
      var cachebuster = mtime.getTime().toString(16);

      // complete url with cachebuster
      if (assetUrl.search) {
        assetUrl.search = assetUrl.search + '&v' + cachebuster;
      } else {
        assetUrl.search = '?v' + cachebuster;
      }

      // replace old value
      declaration.value = background[1]+"url('"+url.format(assetUrl)+"')"+background[5];

    })

  };
});
