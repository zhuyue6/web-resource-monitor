import { spawn } from 'child_process'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import { readdirSync } from 'node:fs'
import fsExtra from 'fs-extra'


export async function compile(name, cb) {
  return new Promise((resolve, reject)=>{
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    spawn(
      cmd,
      [
        'rollup',
        '-c',
        `./rollup.config.js`,
        '--environment',
        `PACKAGENAME:${name}`,
      ],
      {
        stdio: [0, 1, 2],
        shell: true,
      }
    ).on('exit', ()=>{
      cb?.()
      resolve()
    }).on('error', ()=>{
      reject()
    })
  })
}

inquirer.registerPrompt('search-list', inquirerSearchList)

export function filterPrivatePackages(packageDirs) {
  return packageDirs.filter((packageName) => {
    return fsExtra.readJSONSync(`packages/${packageName}/package.json`).private !== true
  })
}

export async function selectPackage() {
  const packageDirs = readdirSync('packages')
  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select publish package?',
      choices: [...packageDirs],
    },
  ])
  return packages.selected
}