// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

const os = require('os')
const path = require('path')
const fs = require('fs')
const { sep } = require('path')

function getFetcher (u) {
  if (u.protocol === 'https:') return require('https')
  if (u.protocol === 'http:') return require('http')
  return null
}

/**
 * @param {URL} fullUrl url to fetch
 * @returns {Promse<String[]>} filename, tmpdir
 */
function myFetch (fullUrl) {
  return new Promise((resolve, reject) => {
    const fetcher = getFetcher(fullUrl)
    console.log('Fetch:', fullUrl.toString())
    if (!fetcher) {
      return reject(Error(`Unknown URL protocol ${fullUrl.protocol} in ${fullUrl.toString()}`))
    }

    fetcher.get(fullUrl, res => {
      const length = res.headers['content-length']
      if (res.statusCode === 302 && res.headers.location) {
        return resolve(myFetch(new URL(res.headers.location)))
      } else if (res.statusCode !== 200) {
        return reject(Error(`Bad status code ${res.statusCode}`))
      }
      const tmpd = fs.mkdtempSync(`${os.tmpdir()}${sep}`)
      const tmpf = path.join(tmpd, 'icu-download.zip')
      let gotSoFar = 0
      console.dir(tmpd)

      res.on('data', data => {
        gotSoFar += data.length
        fs.appendFileSync(tmpf, data)
        // console.dir(res.headers);
        process.stdout.write(`${gotSoFar}/${length}\r`)
        // console.log(`chunk: ${data.length}`);
      })
      res.on('end', () => {
        resolve([tmpf, tmpd])
        console.log(`${gotSoFar}/${length}\n`)
      })
      res.on('error', error => {
        fs.unlinkSync(tmpf)
        fs.rmdirSync(tmpd)
        console.error(error)
        return reject(error)
      })
    })
  })
}

module.exports = myFetch
