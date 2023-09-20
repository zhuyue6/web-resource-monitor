import { spawn } from 'child_process'
import { readdirSync } from 'node:fs'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import process from 'node:process'
import fsExtra from 'fs-extra'

inquirer.registerPrompt('search-list', inquirerSearchList)

function run(name, isAll = false) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  if (isAll) {
    return spawn(cmd, ['turbo', 'dev'], {
      stdio: [0, 1, 2],
    })
  }
  const packageJson = fsExtra.readJSONSync(`packages/${name}/package.json`)
  spawn(cmd, ['turbo', 'dev', `--filter=${packageJson.name}`], {
    stdio: [0, 1, 2],
  })
}

async function main() {
  const packageDirs = readdirSync('packages')
  const apps = packageDirs.filter((packageDir) => hasScripts(packageDir))
  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select start package?',
      choices: ['all', ...apps],
    },
  ])
  if (packages.selected === 'all') {
    run(undefined, 'all')
  } else {
    run(packages.selected)
  }
}

main()
