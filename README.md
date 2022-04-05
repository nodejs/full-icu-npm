# full-icu

Install full ICU (Internationalization) data from GitHub or npm for Node.js.

### What is this and why would I use it?

Importing this package does not have any useful effect, see below.

Originally, Node.js did not come with information for all of the world’s languages.
The default build mode was “small-icu” which means English-only, saving about 50% of
the total Node.js download footprint.

Since Node.js 13, full ICU data has been the default for Node.js.
So this module is only helpful for older Node.js versions, or custom
builds which specify small-icu.

This module does not add any internationalization capabilities to Node.js,
but it can provide a convenient way of loading the data.

Please see [“providing ICU data at runtime”](https://nodejs.org/api/intl.html#providing-icu-data-at-runtime) in the Node.js docs for more information.

### Am I using `small-icu`?

Let's find out:

```shell
$ node -p 'process.config.variables.icu_small'
true
```

If you see `false` here, you aren't using small ICU and **this package won’t do
anything useful for you,** although it is harmless.

### To use

First, you must have a Node.js that is configured for `small-icu`.
See above.

`npm install full-icu`

Note: Set env var `FULL_ICU_PREFER_NPM=true` to prefer using the `icu4c-data` npm module,
otherwise the default is now to load from ICU4C’s GitHub release.

### To install globally

`npm install -g full-icu`

### After Installation

Instructions will be printed out on how to activate this data for your version of node.

This work gets done in a `postinstall` script which copies the `icudt*.dat` file up to this module's level.

## API

Note that this is only packaging and build metadata.
For Internationalization API, see [Intl](https://nodejs.org/api/intl.html).

`require('full-icu')` returns a few properties:

* `nodever` - the full Node version (ex: `14.2.0`)

* `node_maj` - the major part of the node version (ex: `14`)

* `node_min` - the minor part of the node version (ex `2`)

* `icu_small` - if truthy, means that node was built with
**small-icu** (English only). If falsy, means that the `full-icu`
package is not relevant.

* `icuver` - the full ICU version, if available, such as 55.1. Sometimes only the major version is available.

* `icumaj` - ICU major ver, such as `55`. May be === `icuver`.

* `icumin` - ICU minor version, such as `1` if available.

* `icuend` - ICU endianness - *l*ittle, *b*ig or *e*bcdic.

* `icupkg` - the `npm` package needed to get full ICU data, if any.

* `icudat` - the raw data file ICU expects to find for full data, if any.

* `noi18n` - if truthy, no ICU / Intl build was enabled for your node version. Sorry.

* `oldNode` - The node version is older than this package can really think about.

## BIN

`node-full-icu-path` will print the full `icudt*.dat` path, if available.

## CONTRIBUTING

Please see our [`CONTRIBUTING`](./CONTRIBUTING.md) guide if you'd like to help with this initiative!

## LICENSE

This repository is subject to the terms under the [Node.js license](https://github.com/nodejs/node/blob/HEAD/LICENSE). Some usage of this data is governed by the [Unicode Terms of Use](http://www.unicode.org/copyright.html), which is included in the [unicode-license.txt](./unicode-license.txt)

## COPYRIGHT

Copyright &copy; 1991-2021 Unicode, Inc. and Node.js contributors. All rights reserved.

[Unicode terms of use](http://www.unicode.org/copyright.html)
