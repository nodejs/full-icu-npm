// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by fetching ICU source tarball
// This will only work for little endian systems, but will work for ancient ICU (back to v50)

const fs = require('fs')
const { URL } = require('url')
const process = require('process')
const myFetch = require('./myFetch')
const yauzl = require('yauzl')

// var isglobal = process.env.npm_config_global === 'true';

module.exports = async function installFromGithub (fullIcu, advice) {
//   const icupkg = fullIcu.icupkg
  const { icudat, icuend } = fullIcu
  if (fs.existsSync(icudat)) {
    console.log(` √ ${icudat} (exists)`)
    return
  }

  // var cmdPath = nodePath = process.env.npm_node_execpath;

  // var npmPath = process.env.npm_execpath;

  // var args;
  // https://github.com/unicode-org/icu/releases/download/release-51-3/icu4c-51_3-src.zip
  const _baseUrl = process.env.FULL_ICU_BASEURL || 'https://github.com/unicode-org/icu/releases/'
  const baseUrl = new URL(_baseUrl)
  const versionsAsHyphen = fullIcu.icuver.replace(/\./g, '-')
  // ICU v67/v68 use "68.1" and "67.1" in the filename instead of 68_1 and 69_1
  // https://unicode-org.atlassian.net/browse/ICU-21764
  // Can remove this conditional if the files are updated later.
  const versionsAsUnderscore = (fullIcu.icumaj >= 69) ? fullIcu.icuver.replace(/\./g, '_') : fullIcu.icuver
  const tag = `release-${versionsAsHyphen}`
  const file = `icu4c-${versionsAsUnderscore}-data-bin-${icuend}.zip`
  const fullUrl = new URL(`./download/${tag}/${file}`, baseUrl)
  console.log(fullUrl.toString())
  const [srcZip, tmpd] = await myFetch(fullUrl)

  console.log(srcZip, tmpd)
  // now, unpack it

  console.log(`Looking for ${icudat}`)
  return new Promise((resolve, reject) =>
    yauzl.open(srcZip, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err)
      zipfile.readEntry()
      zipfile.on('end', () => reject(Error(`Not found in zipfile: ${icudat}`)))
      zipfile.on('entry', (entry) => {
        if (entry.fileName.endsWith('/')) {
          zipfile.readEntry()
        } else if (entry.fileName.endsWith(icudat) || entry.fileName.endsWith('/' + icudat)) {
          console.log('found ' + entry.fileName)
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) return reject(err)
            // if entry.file
            readStream.on('end', () => zipfile.readEntry())
            const pipeOut = fs.createWriteStream(icudat)
            readStream.pipe(pipeOut)
            console.log(` √ ${icudat} (from ICU binary data tarball)`)
            return resolve()
          })
        } else {
          zipfile.readEntry() // get next
        }
      })
    }))
}
