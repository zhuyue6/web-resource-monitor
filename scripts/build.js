import { compile, selectPackage, filterPrivatePackages } from './common.js'
import { readdirSync } from 'node:fs'
import chalk from 'chalk'

async function main() {
  if (process.argv[2] !== 'all') {
    return compile(process.argv[2])
  }

  let selected = null
  let packageDirs = readdirSync('packages')
  packageDirs = filterPrivatePackages(packageDirs)

  if (process.argv[2] !== 'all') {
    selected = await selectPackage()
  } else {
    selected = 'all'
  }

  const beginTime = new Date()
  console.log(chalk.green('begin building'))

  if (selected === 'all') {
    for (let packageDir of packageDirs) {
      await compile(packageDir)
    }
  } else {
    await compile(selected)
  }

  const endTime = new Date()
  console.log(chalk.green(`build finish! ${endTime.getTime() - beginTime.getTime()} ms`))
}

main()
