import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import { compile } from './common.js'

inquirer.registerPrompt('search-list', inquirerSearchList)

async function main() {
  const packageDirs = readdirSync(resolve('packages'))
  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select build package?',
      choices: ['all', ...packageDirs],
    },
  ])

  if (packages.selected === 'all') {
    for await (let packageDir of packageDirs) {
      compile(packageDir)
    }
  } else {
    compile(packages.selected)
  }
}

main()
