import { readdirSync } from 'node:fs'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import process from 'node:process'
import { compile } from './common'
inquirer.registerPrompt('search-list', inquirerSearchList)


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
