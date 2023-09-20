import { spawn } from 'child_process'
import { readdirSync } from 'node:fs'
import inquirer from 'inquirer'
import inquirerSearchList from 'inquirer-search-list'
import { compile } from './common.js'

inquirer.registerPrompt('search-list', inquirerSearchList)

async function main() {
  const packageDirs = readdirSync('packages')
  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select publish package?',
      choices: [...packageDirs],
    },
  ])
  compile(packages.selected, ()=>{
    const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
    spawn(
      cmd,
      [
       'publish',
       '--no-git-checks'
      ],
      {
        cwd: `packages/${packages.selected}`,
        stdio: [0, 1, 2],
      }
    )
  })
}

main()
