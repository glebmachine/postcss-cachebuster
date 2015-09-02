var url = require('url');
var fs = require('fs');

var postcss = require('postcss');
var path = require('canonical-path');

module.exports = postcss.plugin('postcss-cachebuster', function (opts) {
  opts = opts || {};

  return function (css) {

    var inputFile = css.source.input.file

    css.eachDecl(function(declaration){

      // only background-image declarations
      if (declaration.prop !== 'background-image') return;

      // only url
      if (!/url\(('|")[^'"]+('|")/.test(declaration.value)) return;

      var parsedUrl = /url\(('|")([^'"]+)('|")/.exec(declaration.value);
      var assetUrl = url.parse(parsedUrl[2]);
      var inputPath = url.parse(inputFile);

      // only locals
      if (inputPath.host) return;
      if (assetUrl.pathname.indexOf('//') == 0) return;
        
      // resolve path
      var assetPath = path.dirname(inputPath.pathname)
      assetPath = assetPath+'/'+assetUrl.pathname;
      assetPath = path.normalize(assetPath);

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
      declaration.value = "url('"+url.format(assetUrl)+"')";      
    
    })

  };
});
