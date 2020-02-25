# PostCSS Cachebuster [![Build Status](https://travis-ci.org/glebmachine/postcss-cachebuster.svg?branch=master)](https://travis-ci.org/glebmachine/postcss-cachebuster) [![npm version](https://badge.fury.io/js/postcss-cachebuster.svg)](http://badge.fury.io/js/postcss-cachebuster)

[PostCSS] plugin added cachebuster to local files based on their datechanged.


## Input css example
```css
@import url("/css/styles.css");
.foo {
  background-image : url('../images/index/logo.png');
  behavior : url('../behaviors/backgroundsize.min.htc');
}
@font-face {
  font-family: 'My font';
  src: url('fonts/myfont.ttf');
}
```

## Output css example
```css
@import url("/css/styles.css?v66f22a33fff");
.foo {
  background-image : url('../images/index/logo.png?v14f32a475b8')
  behavior : url('../behaviors/backgroundsize.min.htc?v15f55a666c2');
}
@font-face {
  font-family: 'My font';
  src: url('fonts/myfont.ttf?v32f14a88dcf');
}
```

## Configure
```js
postcss([ 
  require('postcss-cachebuster')({
    imagesPath : '/images', 
    cssPath : '/stylesheets'
  }) 
])
```
See [PostCSS] docs for examples for your environment.

## Options

- `cssPath` - option to redefine relative images resolving directory (by default the same as css file folder)
- `imagesPath` - variable to define absolute images base path
- `type` - define cachebuster type, `mtime` by default, allows: `mtime`, `checksum` (checksum based on a hash algorithm),
  or a function which receives the absolute path to the file as an argument and whose return value becomes
  the url pathname.
- `paramName` - prefix for the cachebuster value added to an asset's query
  string (defaults to `v`). The default of `v` produces URLs like
  `images/horse.jpg?v32f14a88dcf`. You can include an `=` to format it as a
  key/value parameter. For example, setting `paramName` to `v=` could produce
  URLs like `images/horse.jpg?v=32f14a88dcf`.
- `hashAlgorithm` - the hash algorithm to use when `type` is set to `checksum` (defaults to `md5`).
  See the [crypto.createHash()](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options)
  documentation for information about available hash algorithms.
- `additionalProps` - array of additional CSS properties to support
- `supportedProps` - replacement array of supported CSS properties (see below
  for the default list of supported properties).

Default supported properties:

- `background`
- `background-image`
- `border-image`
- `behavior`
- `src`

Add to this list by setting the `additionalProps` configuration option.
To add support for `mask-image` properties, for example:

```js
postcss([ 
  require('postcss-cachebuster')({
    additionalProps : [
      'mask-image',
      '-webkit-mask-image'
    ]
  })
])
```

Replace the default list by setting the `supportedProps` configuration option.
To limit the cachbusting to background images only, for example:

```js
postcss([ 
  require('postcss-cachebuster')({
    supportedProps : [
      'background',
      'background-image'
    ]
  })
])
```

## Contributors
- Gleb Mikheev (https://github.com/glebmachine)
- Graham Bates (https://github.com/grahambates)
- Yusuke Yagyu (https://github.com/gyugyu)
- Jackson Ray Hamilton (https://github.com/jacksonrayhamilton)
