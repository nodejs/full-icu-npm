// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by using spawn

var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

var isglobal = process.env.npm_config_global === 'true';

module.exports = function npmInstallNpm(fullIcu, advice) {
	var icupkg = fullIcu.icupkg;
	var icudat = fullIcu.icudat;
	
	var cmdPath = nodePath = process.env.npm_node_execpath;

	var npmPath = process.env.npm_execpath;
	
	var args;
	
	if(npmPath) {
		args = [ npmPath, 'install', icupkg ];
	} else {
		// attempt to launch npm.
		console.log('(Hmm… doesn’t look like NPM called us. Let’s try calling NPM.)');
		cmdPath = 'npm';
		args = [ 'install', icupkg ];
	}
	
	//console.log('#', cmdPath, args.join(' '));
	var spawned = child_process.spawnSync(cmdPath, args, { stdio: 'inherit' });
	if(spawned.error) {
		throw(spawned.error);
	} else if(spawned.status !== 0) {
		throw(Error(cmdPath + ' ' + args.join(' ') + ' --> status ' + spawned.status));
	} else {
		var dirPath;  // path to dir containing icu4c-data
		var datPath;  // path to icu4c-data/icudt*.dat
		if(isglobal) {
			dirPath = path.join('..','icu4c-data');
		} else {
			dirPath = path.join('node_modules','icu4c-data');
		}
		if(!fs.existsSync(fullIcu.datDir())) {
			console.log(' mkdir ' + fullIcu.datDir());
			fs.mkdirSync(fullIcu.datDir());
		}
		datPath = path.join(dirPath, icudat);
		var datShortPath = fullIcu.datShortPath();
		if(fs.existsSync()) {
			console.log(' √ ' + fullIcu.datShortPath() + " (existing link?)");
		} else if(!fs.existsSync(datPath)) { // source location
			console.log(' • ' + ' (no ' + icudat + ' at ‘' + datPath+'’)');
		} else {
			try {
                fs.linkSync(datPath, datShortPath);
                console.log(' √ ' + datShortPath + " (link)");
			} catch(e) {
				fs.symlinkSync(datPath, datShortPath);
				console.log(' √ ' + datShortPath + " (symlink)");
			}
		}
		if(!fullIcu.haveDat()) {
			throw Error('Somehow failed to install ' + datShortPath);
		} else {
			advice();
		}
	}
};
