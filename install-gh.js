// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by using spawn

// var fs = require('fs');
const {URL} = require('url');
const process = require('process');
const myFetch = require('./myFetch');
// const yauzl = require('yauzl');

// var isglobal = process.env.npm_config_global === 'true';

module.exports = async function installFromGithub(fullIcu, advice) {
	var icupkg = fullIcu.icupkg;
	var icudat = fullIcu.icudat;

	// var cmdPath = nodePath = process.env.npm_node_execpath;

	// var npmPath = process.env.npm_execpath;

	// var args;
    // https://github.com/unicode-org/icu/releases/download/release-51-3/icu4c-51_3-src.zip
    const _baseUrl = process.env.FULL_ICU_BASEURL || 'https://github.com/unicode-org/icu/releases/';
    const baseUrl = new URL(_baseUrl);
    const versionsAsHyphen = fullIcu.icuver.replace(/\./g, '-');
    const versionsAsUnderscore = fullIcu.icuver.replace(/\./g, '_');
    const tag = `release-${versionsAsHyphen}`;
    const file = `icu4c-${versionsAsUnderscore}-src.zip`;
    const fullUrl = new URL(`./download/${tag}/${file}`, baseUrl);
    console.log(fullUrl.toString());
    const [srcZip, tmpd] = await myFetch(fullUrl);

    console.log(srcZip, tmpd);
    // now, unpack it
    
/*
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
	}*/
};
