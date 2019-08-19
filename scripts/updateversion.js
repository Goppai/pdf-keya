#! /usr/bin/env node

'use strict'

const commander = require('commander')
const fs = require('fs')

const program = new commander.Command('updatev ersion')
  .option('--version <string>', 'specify version to be updated')
  .option('--editor <string>', 'specify editor to seal')
  .option('--manifest <string>', 'specify manifest path')
  .parse(process.argv)

if (program.version == null) {
  console.error('version parameter must be provided')
  process.exit(1)
}
if (program.manifest == null) {
  console.erro('manifest parameter must be provided')
  program.exit(1)
}

const version = program.version
const editor = program.editor || 'seal'
const manifest = program.manifest

const json = JSON.parse(fs.readFileSync(manifest))

json.version = version
json.editor = editor

fs.writeFileSync(manifest, JSON.stringify(json, null, 2))
