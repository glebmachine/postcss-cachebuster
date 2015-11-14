# PostCSS Cachebuster [![Build Status][ci-img]][ci]

[PostCSS] plugin added cachebuster to local files based on their datechanged.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/glebmachine/postcss-cachebuster.svg
[ci]:      https://travis-ci.org/glebmachine/postcss-cachebuster

```css
.foo {
  /* Input example */
  background-image : url('../images/index/logo.png')
}
```

```css
.foo {
  /* Output example */
    background-image : url('../images/index/logo.png?v14f32a475b8')
}
```

## Usage

```js
postcss([ require('postcss-cachebuster') ])
```
See [PostCSS] docs for examples for your environment.

## Options

- `cssPath` - option to redefine relative images resolving directory (by default the same as css file folder)
- `imagesPath` - variable to define absolute images base path
- `type` - define cachebuster type, `mtime` my default, allows: 'mtime, checksum' (checksum based on md5)
