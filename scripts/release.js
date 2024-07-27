import { spawn } from 'child_process'
import { compile, selectPackage } from './common.js'

async function main() {
  const selected = await selectPackage()
  compile(selected, ()=>{
    const cmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
    spawn(
      cmd,
      [
       'publish',
       '--no-git-checks'
      ],
      {
        cwd: `packages/${selected}`,
        stdio: [0, 1, 2],
      }
    )
  })
}

main()
