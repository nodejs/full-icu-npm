// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by using spawn

var path = require('path');
var fs = require('fs');
const os = require('os');
const {URL} = require('url');
const process = require('process');

var isglobal = process.env.npm_config_global === 'true';

function getFetcher(u) {
    if(u.protocol === 'https:') return require('https');
    if(u.protocol === 'http:') return require('http');
    return null;
}
function myFetch(fullUrl) {
    return new Promise((resolve, reject) => {
        const fetcher = getFetcher(fullUrl);
        console.log('Fetch:', fullUrl.toString());
        if(!fetcher) {
            return reject(Error(`Unknown URL protocol ${u.protocol} in ${u.toString()}`));
        }

        fetcher.get(fullUrl, res => {
            length = res.headers['content-length'];
            if(res.statusCode === 302 && res.headers.location) {
                return resolve(myFetch(new URL(res.headers.location)));
            } else if(res.statusCode !== 200) {
                return reject(Error(`Bad status code ${res.statusCode}`));
            }
            const tmpd = fs.mkdtempSync(os.tmpdir());
            const tmpf = path.join(tmpd, 'icu-download.zip');
            let gotSoFar = 0;
            console.dir(tmpd);

            res.on('data', data => {
                gotSoFar += data.length;
                fs.appendFileSync(tmpf, data);
                // console.dir(res.headers);
                console.log(`${gotSoFar}/${length}`);
                // console.log(`chunk: ${data.length}`);
            });
            res.on('end', () => resolve([tmpf, tmpd]));
            res.on('error', error => {
                fs.unlinkSync(tmpf);
                fs.rmdirSync(tmpd);
                console.error(error);
                return reject(error);
            });
        });
    });
}

module.exports = async function installFromGithub(fullIcu, advice) {
	var icupkg = fullIcu.icupkg;
	var icudat = fullIcu.icudat;

	var cmdPath = nodePath = process.env.npm_node_execpath;

	var npmPath = process.env.npm_execpath;

	var args;
    // https://github.com/unicode-org/icu/releases/download/release-51-3/icu4c-51_3-src.zip
    const _baseUrl = process.env.FULL_ICU_BASEURL || 'https://github.com/unicode-org/icu/releases/';
    const baseUrl = new URL(_baseUrl);
    const versionsAsHyphen = fullIcu.icuver.replace(/\./g, '-');
    const versionsAsUnderscore = fullIcu.icuver.replace(/\./g, '_');
    const tag = `release-${versionsAsHyphen}`;
    const file = `icu4c-${versionsAsUnderscore}-src.zip`;
    const fullUrl = new URL(`./download/${tag}/${file}`, baseUrl);
    console.log(fullUrl.toString());
    const data = await myFetch(fullUrl);



	if(spawned.error) {
		throw(spawned.error);
	} else if(spawned.status !== 0) {
		throw(Error(cmdPath + ' ' + args.join(' ') + ' --> status ' + spawned.status));
	} else {
		var datPath;
		if(fs.existsSync(icudat)) {
			console.log(' √ ' + icudat + " (existing link?)");
		} else if(!fs.existsSync(datPath)) {
			console.log(' • ' + ' (no ' + icudat + ' at ‘' + datPath+'’)');
		} else {
			try {
                fs.linkSync(datPath, icudat);
                console.log(' √ ' + icudat + " (link)");
			} catch(e) {
				fs.symlinkSync(datPath, icudat);
				console.log(' √ ' + icudat + " (symlink)");
			}
		}
		if(!fullIcu.haveDat()) {
			throw Error('Somehow failed to install ' + icudat);
		} else {
			advice();
		}
	}
};
