Install full ICU data
###

to use:

	npm install full-icu

or for global install:

	npm install -g full-icu

Instructions will be printed out on how to activate this data for your version of node.

The work gets done in a `postinstall` script which copies the `icudt*.dat` file
up to this module's level.


API
===

`require('full-icu')` returns a few properties:

* `nodever` - the full Node version (ex: `4.2.0`)

* `node_maj` - the major part of the node version (ex: `4`)

* `node_min` - the minor part of the node version (ex `2`)

* `icu_small` - if truthy, means that node was built with
small-icu (English only). If falsy, means that the `full-icu`
package is not relevant.

* `icuver` - full ICU version, if available, such as 55.1. Sometimes only the major
version is available.

* `icumaj` - ICU major ver, such as `55`. May be === `icuver`.

* `icumin` - ICU minor version, such as `1` if available.

* `icuend` - ICU endianness - *l*ittle, *b*ig or *e*bcdic.

* `icupkg` - the `npm` package needed to get full ICU data, if any.

* `icudat` - the raw data file ICU expects to find for full data, if any.

* `noi18n` - if truthy, no ICU / Intl build was enabled for your node version. Sorry.

* `oldNode` - Node is older (`<0.12`) than this package can really think about.

BIN
===

`node-full-icu-path` will print the full `icudt*.dat` path, if available.

MIRROR
===
This is a mirror of source  currently  in
http://source.icu-project.org/repos/icu/tools/branches/srl/npm11617/release/c/icu4c-data-npm/full-icu

COPYRIGHT
===

This software is part of ICU, and as such is:

Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

A copy of the ICU license is in [LICENSE](LICENSE)
or is available at http://bugs.icu-project.org/trac/browser/icu/tags/latest/LICENSE
