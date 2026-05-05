// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by fetching ICU source tarball
// This will only work for little endian systems, but will work for ancient ICU (back to v50)

const fs = require('fs')
const { URL } = require('url')
const process = require('process')
const myFetch = require('./myFetch')
const yauzl = require('yauzl')

module.exports = async function installFromGithub (fullIcu, advice) {
  const { icudat, icuend } = fullIcu
  if (fs.existsSync(icudat)) {
    console.log(` √ ${icudat} (exists)`)
    return
  }

  // Example URL:
  // https://github.com/unicode-org/icu/releases/download/release-51-3/icu4c-51_3-src.zip
  const _baseUrl = process.env.FULL_ICU_BASEURL || 'https://github.com/unicode-org/icu/releases/'
  const baseUrl = new URL(_baseUrl)
  const versionsAsHyphen = fullIcu.icuver.replace(/\./g, '-')
  // ICU v67/v68 use "68.1" and "67.1" in the filename instead of 68_1 and 67_1
  // ICU v69-v77 use underscores in the filename and hyphens in the tag
  // ICU >= v78 reverted to dots in both the release tag and filename
  // https://unicode-org.atlassian.net/browse/ICU-21764
  const versionInFilename = (fullIcu.icumaj >= 78) ? fullIcu.icuver : (fullIcu.icumaj >= 69) ? fullIcu.icuver.replace(/\./g, '_') : fullIcu.icuver
  const tag = (fullIcu.icumaj >= 78) ? `release-${fullIcu.icuver}` : `release-${versionsAsHyphen}`
  const file = `icu4c-${versionInFilename}-data-bin-${icuend}.zip`
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
            readStream.on('end', () => zipfile.readEntry())
            const pipeOut = fs.createWriteStream(icudat)
            readStream.pipe(pipeOut)
            console.log(` √ ${icudat} (from ICU binary data tarball)`)
            return resolve()
          })
        } else {
          zipfile.readEntry()
        }
      })
    }))
}
