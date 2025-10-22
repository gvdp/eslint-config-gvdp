#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { init } from './src/init.js';
console.log('process.argv', process.argv);


yargs(hideBin(process.argv))
  .command('init', 'initialize the linting options',   function (yargs) {
    return yargs
    .option('typescript', {
      // todo: dont have this be default, always ask
      describe: 'add linting for typescript',
      type: 'boolean',
      default: false,
    })
    .option('prettier', { 
      describe: 'add prettier commands',
      type: 'boolean',
      default: true,
    })
  }, async (argv) => {
    console.info(argv)
     await init(argv)
  })
  .demandCommand(1)
  .help()
  .strict()
  .parse()