#!/usr/bin/env node
// Copyright (C) 2015 IBM Corporation and Others. All Rights Reserved.

const fullIcu = require('./full-icu')

if (!fullIcu.datPath) {
  throw Error('Full data path not available')
} else {
  console.log(fullIcu.datPath())
}
