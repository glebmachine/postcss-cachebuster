var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var chalk = require('chalk');

var postcss = require('postcss');
var path = require('canonical-path');

var checksums = {};

module.exports = postcss.plugin('postcss-cachebuster', function (opts) {
  var pattern = /url\(('|")?([^'"\)]+)('|")?\)/g;
  var supportedProps = [
    'background',
    'background-image',
    'border-image',
    'behavior',
    'src'
  ];

  opts = opts || {};
  opts.imagesPath = opts.imagesPath ? process.cwd() + opts.imagesPath : process.cwd();
  opts.cssPath = opts.cssPath ? process.cwd()+opts.cssPath : false;
  opts.type = opts.type || 'mtime';

  function createCachebuster(assetPath, type) {
    var cachebuster;

    if (typeof type === 'function') {
      cachebuster = type(assetPath);
    } else if (!fs.existsSync(assetPath)) {
      console.log('Cachebuster:', chalk.yellow('file unreachable or not exists', assetPath));
    } else if (type === 'checksum') {
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
      assetPath = path.join(imagesPath, assetPath);
    } else {
      assetPath = path.join(opts.cssPath || path.dirname(file), assetPath);
    }
    return assetPath;
  }

  return function (css) {
    var inputFile = opts.cssPath || css.source.input.file;

    function updateAssetUrl(assetUrl) {
      var assetPath = resolveUrl(assetUrl, inputFile, opts.imagesPath);

      // complete url with cachebuster
      var cachebuster = createCachebuster(assetPath, opts.type);
      if (!cachebuster) {
        return;
      } else if (typeof opts.type === 'function') {
        assetUrl.pathname = cachebuster;
      } else if (assetUrl.search && assetUrl.search.length > 1) {
        assetUrl.search = assetUrl.search + '&v' + cachebuster;
      } else {
        assetUrl.search = '?v' + cachebuster;
      }
    }

    css.walkAtRules('import', function walkThroughtImports(atrule) {
      var results = pattern.exec(atrule.params);
      var quote = results[1] || '"';
      var originalUrl = results[2];

      var assetUrl = url.parse(originalUrl);

      updateAssetUrl(assetUrl);

      atrule.params = 'url(' + quote + url.format(assetUrl) + quote + ')';
    });

    css.walkDecls(function walkThroughtDeclarations(declaration){
      // only image and font related declarations
      if (supportedProps.indexOf(declaration.prop)=== -1) {
        return;
      }

      declaration.value = declaration.value.replace(pattern, function (match, quote, originalUrl) {
        quote = quote || '"';

        var assetUrl = url.parse(originalUrl);

        // only locals
        if (assetUrl.host ||
            assetUrl.pathname.indexOf('//') === 0 ||
            assetUrl.pathname.indexOf(';base64') !== -1) {
          return match;
        }

        updateAssetUrl(assetUrl);

        return 'url(' + quote + url.format(assetUrl) + quote + ')';
      });
    });
  };
});
