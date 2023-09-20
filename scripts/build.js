import { spawn } from 'child_process'
import { readdirSync } from 'node:fs'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import process from 'node:process'

inquirer.registerPrompt('search-list', inquirerSearchList)

function compile(name) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  spawn(
    cmd,
    [
      'rollup',
      '-c',
      `../../rollup.config.js`,
      '--environment',
      `PACKAGENAME:${name}`,
    ],
    {
      cwd: `packages/${name}`,
      stdio: [0, 1, 2],
    }
  )
}

function buildPlugins() {
  const packages = readdirSync('packages')
  for (const buildPackage of packages) {
    compile(buildPackage)
  }
}

async function main() {
  if (process.argv.length >= 4) {
    return compileApp(process.argv[2], process.argv[3])
  }
  if (process.argv[2] === 'plugins') {
    return buildPlugins()
  }

  const packageDirs = readdirSync('packages')
  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select build package?',
      choices: ['all', ...packageDirs],
    },
  ])
  const buildPackage = packages.selected

  if (buildPackage === 'all') {
    buildPlugins()
  } else {
    compile(packages.selected)
  }
}

main()
