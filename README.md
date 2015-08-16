# PostCSS Cachebuster [![Build Status][ci-img]][ci]

[PostCSS] plugin added cachebuster to local files based on their datechanged.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/glebmachine/postcss-cachebuster.svg
[ci]:      https://travis-ci.org/glebmachine/postcss-cachebuster

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-cachebuster') ])
```

See [PostCSS] docs for examples for your environment.
