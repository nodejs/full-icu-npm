// Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

// Install by calling NPM directly
// Not recommended.  Requires a dependency on npm.

var path = require('path');
var fs = require('fs');

module.exports = function npmInstallNpm(fullIcu, advice) {
	var icupkg = fullIcu.icupkg;
	var icudat = fullIcu.icudat;
	// var nodever = fullIcu.nodever;
	// var icuver = fullIcu.icuver;
	
	var npm = require('npm');


	
	
	npm.load({}, function(err) {
		if(err) throw err;
		npm.commands.install([ icupkg ], function(err, data) {
			if(err) {
				console.log('Your ICU version may not be available in NPM yet..');
				throw err;
			}
			
	//		console.log("Installed " + data.length + " thing(s).");
			data.forEach(function(i) {
				var datPath = path.join(i[1],icudat);
				if(fs.existsSync(icudat)) {
					console.log(' √ ' + i[0] + ' : ' + icudat + " (existing symlink?)");
				} else if(!fs.existsSync(datPath)) {
					console.log(' • ' + i[0] + ' (no ' + icudat + ')');
				} else {
					try {
						fs.symlinkSync(datPath, icudat);
						console.log(' √ ' + i[0] + ' : ' + icudat + " (symlink)");
					} catch(e) {
						fs.linkSync(datPath, icudat);
						console.log(' √ ' + i[0] + ' : ' + icudat + " (link)");
					}
				}
			});
			if(!fullIcu.haveDat()) {
				throw Error('Somehow failed to install ' + icudat);
			} else {
				advice();
			}
		});
		//npm.registry.log.on("log", console.log);
	});
};
