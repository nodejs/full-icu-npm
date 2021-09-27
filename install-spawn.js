// Copyright (C) 2015-2016 IBM Corporation and Others. All Rights Reserved.

// Install by using spawn

const path = require('path')
const fs = require('fs')
const spawnSync = require('child_process').spawnSync

const isglobal = process.env.npm_config_global === 'true'
const npmrc = '.npmrc'
if (!process.env.INIT_CWD) {
  throw Error('INIT_CWD was not set- does not seem like we were launched from npm')
}
const npmrcPath = path.resolve(process.env.INIT_CWD, npmrc)

// uses semver regex from https://semver.org/
const YARN_REGEX = /yarn(-(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)?((.*cli)?\.c?js)?$/

module.exports = function npmInstallNpm (fullIcu, advice) {
  const icupkg = fullIcu.icupkg
  const icudat = fullIcu.icudat

  let cmdPath = process.env.npm_node_execpath

  const npmPath = process.env.npm_execpath

  let args

  if (YARN_REGEX.test(npmPath)) {
    console.log('Looks like you are using yarn…')
    args = [npmPath, 'add', icupkg, '--no-lockfile', '--ignore-scripts']
  } else if (npmPath) {
    args = [npmPath, 'install', icupkg]
  } else {
    // attempt to launch npm.
    // do not try yarn here
    console.log('(Hmm… doesn’t look like NPM called us. Let’s try calling NPM.)')
    cmdPath = 'npm'
    args = ['install', icupkg]
  }

  if (fs.existsSync(npmrcPath)) {
    try {
      fs.linkSync(npmrcPath, npmrc)
    } catch (e) {
      fs.symlinkSync(npmrcPath, npmrc)
    }
  }

  console.log('full-icu$', cmdPath, args.join(' '))
  const spawned = spawnSync(cmdPath, args, { stdio: 'inherit' })

  if (fs.existsSync(npmrc)) {
    try {
      fs.unlinkSync(npmrc)
    } catch (e) {
    }
  }

  if (spawned.error) {
    throw (spawned.error)
  } else if (spawned.status !== 0) {
    throw (Error(cmdPath + ' ' + args.join(' ') + ' --> status ' + spawned.status))
  } else {
    let datPath
    if (isglobal) {
      datPath = path.join('..', 'icu4c-data', icudat)
    } else {
      datPath = path.join('node_modules', 'icu4c-data', icudat)
    }
    if (fs.existsSync(icudat)) {
      console.log(' √ ' + icudat + ' (existing link?)')
    } else if (!fs.existsSync(datPath)) {
      console.log(' • ' + ' (no ' + icudat + ' at ‘' + datPath + '’)')
    } else {
      try {
        fs.linkSync(datPath, icudat)
        console.log(' √ ' + icudat + ' (link)')
      } catch (e) {
        fs.symlinkSync(datPath, icudat)
        console.log(' √ ' + icudat + ' (symlink)')
      }
    }
    if (!fullIcu.haveDat()) {
      throw Error('Somehow failed to install ' + icudat)
    } else {
      advice()
    }
  }
}
