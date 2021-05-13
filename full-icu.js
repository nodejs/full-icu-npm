// Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

// var process = require('process');
// console.dir(process.env);

const fs = require('fs')
const path = require('path')

if (!process || !process.versions || !process.versions.node) {
  throw Error('Sorry- don’t know what version of Node you are on.')
}

const nodever = module.exports.nodever = process.versions.node

const nodesplit = nodever.split('.')

const major = module.exports.node_maj = nodesplit[0]
const minor = module.exports.node_min = nodesplit[1]

if ((major === 0) && (minor < 12)) {
  module.exports.oldNode = true
} else if (process.config.variables.v8_enable_i18n_support === 0) {
  module.exports.noi18n = true
} else {
  /*
  Commented until https://github.com/nodejs/node/issues/3460 is fixed.

  if( major >= 7 ) {
    if( nodever === '7.0.0-pre' ) {
    module.exports.nodeDetectIcu = 'maybe';
    } else {
    module.exports.nodeDetectIcu = true;
    }
  }
  */

  if (!process.config.variables.icu_small) {
    module.exports.icu_small = false
    // not going to work..
    if (process.config.variables.icu_gyp_path === 'tools/icu/icu-system.gyp') {
      // this will be the case under homebrew, redhat/fedora, others..
      module.exports.icu_system = true
    }
  } else {
    module.exports.icu_small = true
  }

  let icuver
  let icuend = 'l'

  if (process.versions.icu) {
    icuver = process.versions.icu // Thanks https://github.com/nodejs/node/issues/3089
  } else {
    icuver = process.config.variables.icu_ver_major // only get the major
  }

  if (!icuver) {
    throw Error('Cannot determine Node’s ICU version!')
  } else {
    module.exports.icuver = icuver
  }

  // get 'major' number
  const icumaj = module.exports.icumaj = icuver.split('.')[0]

  if (process.config.variables.icu_endianness) {
    icuend = process.config.variables.icu_endianness.toLowerCase()
  }

  if ((icuend.length !== 1) || ('lbe'.indexOf(icuend) === -1)) {
    throw Error('Don’t know what to make of endianness “' + icuend + '” - expected l, b, or e')
  } else {
    module.exports.icuend = icuend
  }

  module.exports.icupkg = 'icu4c-data@' + icumaj + icuend

  const icudat = module.exports.icudat = 'icudt' + icumaj + icuend + '.dat'

  const haveDat = module.exports.haveDat = function haveDat (d) {
    if (!d) d = path.resolve(__dirname, icudat)
    return fs.existsSync(d)
  }

  module.exports.datPath = function datPath (d) {
    if (!d) d = path.resolve(__dirname, icudat)
    if (haveDat(d)) return fs.realpathSync(d)
    throw Error('Does not exist: ' + fs.realpathSync(d))
  }
}
