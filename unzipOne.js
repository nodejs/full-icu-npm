const yauzl = require('yauzl')
const { basename, join } = require('path')
const fs = require('fs')

/**
 * unzip and write file 'fn'  to 'dstDir'
 * @param {String} srcZip source zipfile
 * @param {String} fn to unzip
 * @param {String} dstDir destination dir
 * @returns {Promise<String>} to output filename if successful, or falsy if the file was not found.
 */
function unzipOne (srcZip, fn, dstDir) {
  const outFile = join(dstDir, fn)
  return new Promise((resolve, reject) => {
    yauzl.open(srcZip, { lazyEntries: true },
      (err, zipfile) => {
        /* istanbul ignore next */
        if (err) return reject(err)
        zipfile.readEntry()
        zipfile.on('entry', entry => {
          if (basename(entry.fileName) === fn) {
            zipfile.openReadStream(entry, (err, readStream) => {
              /* istanbul ignore next */
              if (err) return reject(err)
              readStream.on('end', () => {
                zipfile.close()
                resolve(entry.fileName)
              })
              readStream.pipe(fs.createWriteStream(outFile))
            })
          } else {
            zipfile.readEntry()
          }
        })
        zipfile.on('end', () => {
          resolve() // not found
        })
      })
  })
}

module.exports = unzipOne
