import { spawn } from 'child_process'

export function compile(name, cb) {
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
  ).on('exit', ()=>{
    cb?.()
  })
}