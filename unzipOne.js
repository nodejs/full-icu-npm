const yauzl = require('yauzl');
const {basename} = require('path');

/**
 * unzip and write file 'fn'  to 'dstDir'
 * @param {String} srcZip source zipfile
 * @param {String} fn to unzip
 * @param {String} dstDir destination dir
 * @returns {Promise<String>} to output filename if successful, or falsy if the file was not found.
 */
function unzipOne(srcZip, fn /*, dstDir*/) {
    return new Promise((resolve, reject) => {
            yauzl.open(srcZip, {lazyEntries: true},
            (err, zipfile) => {
               if(err) return reject(err);
               zipfile.readEntry();
               zipfile.on("entry", entry => {
                   if(basename(entry.fileName) === fn) {

                        zipfile.close();
                        resolve(entry.fileName);
                   } else {
                       zipfile.readEntry();
                   }
               });
               zipfile.on("end", () => {
                resolve(); // not found
               });
            });
    });
}

module.exports = unzipOne;