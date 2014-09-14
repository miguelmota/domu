# Domu.js - DOM Utilities

A collection of DOM utilities.

# Documentation

**[http://domu.moogs.io](http://domu.moogs.io)**

# Install

Available via [bower](http://bower.io/):

```bash
bower install domu
```

Available via [npm](https://www.npmjs.org/package/domujs):

```bash
npm install domujs
```

# Extend _

To extend the `_` when using libraries such as [underscore](http://underscorejs.org/) or [lodash](http://lodash.com/), pass in `domu._()` to the underscore mixin function. Domu functions will not override underscore functions if they already exist, unless you pass `domu._(true)`

# Development

Documentation

```bash
grunt jsdoc
```

# Test

```bash
grunt test
```

[http://domu.moogs.io/test/SpecRunner.html](http://domu.moogs.io/test/SpecRunner.html)

# Source

[https://github.com/miguelmota/domu](https://github.com/miguelmota/domu)

# License

Released under the MIT License.
