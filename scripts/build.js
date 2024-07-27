import { compile, selectPackage, filterPrivatePackages } from './common.js'
import { readdirSync } from 'node:fs'

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

  if (selected === 'all') {
    for await (let packageDir of packageDirs) {
      compile(packageDir)
    }
  } else {
    compile(selected)
  }
}

main()
