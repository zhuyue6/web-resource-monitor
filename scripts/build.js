import { compile, filterPrivatePackages } from './common.js'
import { readdirSync } from 'node:fs'
import chalk from 'chalk'

async function main() {

  let packageDirs = readdirSync('packages')
  packageDirs = filterPrivatePackages(packageDirs)

  const beginTime = new Date()
  console.log(chalk.green('begin building'))

  for (let packageDir of packageDirs) {
    await compile(packageDir)
  }

  const endTime = new Date()
  console.log(chalk.green(`build finish! ${endTime.getTime() - beginTime.getTime()} ms`))
}

main()