# PostCSS Cachebuster [![Build Status][ci-img]][ci][![dependencies][dm-img]][dm]

[PostCSS] plugin added cachebuster to local files based on their datechanged.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/glebmachine/postcss-cachebuster.svg
[ci]:      https://travis-ci.org/glebmachine/postcss-cachebuster
[dm-img]:  https://david-dm.org/glebmachine/postcss-cachebuster.svg
[dm]:      https://david-dm.org/glebmachine/postcss-cachebuster


## Input css example
```css
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
- `type` - define cachebuster type, `mtime` my default, allows: 'mtime, checksum' (checksum based on md5)


## Contributors
- Gleb Mikheev (https://github.com/glebmachine)
- Graham Bates (https://github.com/grahambates)
- Yusuke Yagyu (https://github.com/gyugyu)

