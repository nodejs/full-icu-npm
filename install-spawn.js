// Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

// Install by using spawn
// Not recommended.  Requires a dependency on npm.

var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

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
		var datPath = path.join('node_modules','icu4c-data',icudat);
		if(fs.existsSync(icudat)) {
			console.log(' √ ' + icudat + " (existing symlink?)");
		} else if(!fs.existsSync(datPath)) {
			console.log(' • ' + ' (no ' + icudat + ')');
		} else {
			try {
				fs.symlinkSync(datPath, icudat);
				console.log(' √ ' + icudat + " (symlink)");
			} catch(e) {
				fs.linkSync(datPath, icudat);
				console.log(' √ ' + icudat + " (link)");
			}
		}
		if(!fullIcu.haveDat()) {
			throw Error('Somehow failed to install ' + icudat);
		} else {
			advice();
		}
	}
};
