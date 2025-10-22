import fs from 'node:fs'
import {execa} from 'execa';
import { getEslintConfig } from './eslint-config.js';

// todo: add .eslintcache into .gitignore if not present
// todo: prettierrc default file
// todo: github action for creating todo issues
// todo: add conventinoal commitlints

export const init = async (args) => {
  const packageFile = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  console.log('packageFile', packageFile.scripts);

 const scripts = {
  "prepare": "husky install",
   lint: 'concurrently -n lint "pnpm:lint:*(!fix)"',
   'lint:fix': 'concurrently -n lint-fix "pnpm:lint:*:fix"',
   "lint:js": "eslint . --cache",
   ...args.typescript && {
     "lint:tsc": "tsc",
    },
    ...args.prettier && {
      'lint:format': 'prettier --check .',
      'lint:format:fix': 'prettier --write .',
    },
    ...packageFile.scripts,
  }

 const devDependencies = {
   "concurrently": "^9.2.1",
   "@eslint/js": "9.38.0",
   "eslint": "^9.17.0",
   "eslint-import-resolver-typescript": "^3.6.3",
   "eslint-plugin-import": "^2.31.0",
   "husky": "^9.1.7",
   "lint-staged": "^15.2.10",  
    ...args.prettier && {
      "prettier": "^3.4.2",
     },
      ...args.typescript && {
    "typescript-eslint": "8.19.0",
      },
   ...packageFile.devDependencies,
  }

  const lintStaged = {
    ...args.prettier && {

    "*": [
      "prettier --write"
    ]   }
    , ...packageFile['lint-staged'],
  }
  
  packageFile.scripts = sortObjectByKey(scripts),
  packageFile.devDependencies = sortObjectByKey(devDependencies),
  packageFile['lint-staged'] = sortObjectByKey(lintStaged),
  

  fs.writeFileSync('package.json', JSON.stringify(packageFile, null, 2))

  // todo: compare with the existing file if there is one
  fs.writeFileSync('eslint.config.mjs', getEslintConfig(args))

  const {stdout} = await execa`pnpm install`;
// Print command's output
console.log(stdout);
  const {stdout: lintOutput} = await execa`pnpm lint`;
// Print command's output
console.log(lintOutput);

}


function sortObjectByKey(obj) {
  return Object.keys(obj).sort().reduce((sortedObj, key) => {
      sortedObj[key] = obj[key];
      return sortedObj;
  }, {});
}