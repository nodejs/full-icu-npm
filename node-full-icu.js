#!/usr/bin/env node
const { spawn } = require('child_process')
const data = require('./full-icu')
const env = data.icu_small
  ? {
      ...process.env,
      NODE_ICU_DATA: data.datPath()
    }
  : process.env

spawn('/usr/bin/env', ['node', ...process.argv.slice(2)], { env, stdio: 'inherit' })
