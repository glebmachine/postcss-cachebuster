var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var chalk = require('chalk');

var postcss = require('postcss');
var path = require('canonical-path');

var checksums = {};

function createCachebuster(assetPath, type) {

  var cachebuster;

  if (type === 'checksum') {
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

  return cachebuster;
}

function resolveUrl(assetUrl, file, imagesPath) {
  var assetPath = decodeURI(assetUrl.pathname);

  if (/^\//.test(assetUrl.pathname)) {
    // absolute
    assetPath = path.join(process.cwd(), imagesPath, assetPath);
  } else {
    // relative
    assetPath = path.join(path.dirname(file), assetPath);
  }

  return assetPath;
}

module.exports = postcss.plugin('postcss-cachebuster', function (opts) {
  opts = opts || {};
  opts.imagesPath = opts.imagesPath || '';
  opts.type = opts.type || 'mtime';

  return function (css) {

    var inputFile = css.source.input.file;

    css.walkDecls(function(declaration){

      var supportedProps = [
        'background',
        'background-image',
        'border-image',
        'src'
      ];

      // only image and font related declarations
      if (supportedProps.indexOf(declaration.prop)=== -1) {
        return;
      }

      var pattern = /url\(('|")?([^'"\)]+)('|")?\)/g;

      declaration.value = declaration.value.replace(pattern, function (match, quote, originalUrl) {
        var assetUrl = url.parse(originalUrl);
        var assetPath = resolveUrl(assetUrl, inputFile, opts.imagesPath);
        quote = quote || '"';

        // only locals
        if (assetUrl.host ||
            assetUrl.pathname.indexOf('//') === 0 ||
            assetUrl.pathname.indexOf(';base64') !== -1) {
          return match;
        }


        // file exists
        if (!fs.existsSync(assetPath)) {
          console.log(chalk.yellow('file unreachable or not exists', assetPath));
          return match;
        }

        var cachebuster = createCachebuster(assetPath, opts.type);

        // complete url with cachebuster
        if (assetUrl.search && assetUrl.search.length > 1) {
          assetUrl.search = assetUrl.search + '&v' + cachebuster;
        } else {
          assetUrl.search = '?v' + cachebuster;
        }

        return 'url(' + quote + url.format(assetUrl) + quote + ')';
      });
    });

  };
});
