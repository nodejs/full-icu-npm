# full-icu-npm

Install full ICU data from GitHub or npm

### To use

`npm install full-icu`

Note: Set env var `FULL_ICU_PREFER_NPM=true` to prefer using the `icu4c-data` npm module,
otherwise the default is now to load from ICU4C’s GitHub release.

### To install globally

`npm install -g full-icu`

### After Installation

Instructions will be printed out on how to activate this data for your version of node.

This work gets done in a `postinstall` script which copies the `icudt*.dat` file up to this module's level.

## API

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

This repository is subject to the terms under the [Node.js license](https://github.com/nodejs/node/blob/master/LICENSE). Some usage of this data is governed by the [Unicode Terms of Use](http://www.unicode.org/copyright.html), which is included in the [unicode-license.txt](./unicode-license.txt)

## COPYRIGHT

Copyright &copy; 1991-2021 Unicode, Inc. and Node.js contributors. All rights reserved.

[Unicode terms of use](http://www.unicode.org/copyright.html)
