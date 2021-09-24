// Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

const fs = require('fs')
const path = require('path')
const fullIcu = require('./full-icu')

const myname = process.env.npm_package_name || 'full-icu'

function exit (reason) {
  console.log(reason)
  process.exit(0)
}

if (fullIcu.oldNode) {
  exit('Not sure how to handle node < 0.12. Exitting.')
} else if (fullIcu.noi18n) {
  exit('Note: Your node was not compiled with i18n support. Nothing to do, Exitting.')
} else if (fullIcu.icu_system) {
  exit('Note: Your node was compiled to link against an ' +
    'externally-provided ICU, so the locale data is not customizable ' +
    'through this script. Exitting.')
} else if (!fullIcu.icu_small) {
  // maybe already full icu, or some as-yet-unforseen case.
  exit('Note: Your node was not compiled with the ‘small-icu’ case,' +
    ' so the ICU data is not customizable through this script. Exitting.')
} else if (fullIcu.icumaj < 54) {
  // This is kind of a sanity check that the ICU version is correct.
  // ICU 54 was what Node v0.12 started with.
  throw Error('Don’t know how to work with ICU version ' + fullIcu.icumaj + ', sorry.')
}

const cwd = fs.realpathSync('.')

const isglobal = process.env.npm_config_global === 'true'

const relpath = isglobal ? cwd : path.join('node_modules', myname)

function advice () {
  if (fullIcu.nodeDetectIcu) {
    console.log('Note: If you manually copy ' + path.join(relpath, fullIcu.icudat) + ' to the directory ' +
      path.normalize(path.join(relpath, '..', '.node-icu')) +
      ' node will automatically detect this data.')
    if (fullIcu.nodeDetectIcu === 'maybe') {
      console.log(' - at least when https://github.com/nodejs/node/issues/3460 lands')
    }
  }

  if (fullIcu.nodeDetectIcu !== true) {
    console.log('Node will use this ICU datafile if the environment variable NODE_ICU_DATA is set to “' + relpath + '”')
    console.log('or with node --icu-data-dir=' + relpath + ' YOURAPP.js')

    const asJson = { scripts: { start: 'node --icu-data-dir=' + relpath + ' YOURAPP.js' } }
    console.log(' For package.json:')
    console.log(JSON.stringify(asJson))
  }
  console.log('')
  console.log('By the way, if you have full data, running this in node:')
  // 9E8 is 10 days into January, so TimeZone independent
  console.log("> new Intl.DateTimeFormat('es',{month:'long'}).format(new Date(9E8));")
  console.log("... will show “enero”. If it shows “January” you don't have full data.")
}

// Choose install method
let npmInstall

// GitHub has v50+ as releases
// Experimentally, pull from GitHub for little endian
if (!process.env.FULL_ICU_PREFER_NPM) {
  if (fullIcu.icumaj >= 67) {
    // Pull from bin data zip, first arrived in ICU v67
    // https://unicode-org.atlassian.net/browse/ICU-20600
    npmInstall = require('./install-gh-data')
  } else {
    if (fullIcu.icuend === 'l') {
      // Little Endian can pull from icu4c-src.zip which contains a prebuilt data file
      npmInstall = require('./install-gh')
    } else {
      // Fall back to npm
      console.log(`ICU data bin zip not available until ICU v${fullIcu.icumaj} for endianness ${fullIcu.icuend}: Falling back to npm`)
      npmInstall = require('./install-spawn')
    }
  }
} else {
  npmInstall = require('./install-spawn')
}

if (fs.existsSync(fullIcu.icudat)) {
  console.log('√ ' + fullIcu.icudat + ' Already there (for Node ' + fullIcu.nodever + ' and small-icu ' + fullIcu.icuver + ')')
  advice()
} else {
  console.log('npm install ' + fullIcu.icupkg + ' (Node ' + fullIcu.nodever + ' and small-icu ' + fullIcu.icuver + ') -> ' + fullIcu.icudat)
  npmInstall(fullIcu, advice)
}
console.log('News: Please see https://github.com/icu-project/full-icu-npm/issues/6')
