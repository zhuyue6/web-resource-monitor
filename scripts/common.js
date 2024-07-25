import { spawn } from 'child_process'

export async function compile(name, cb) {
  return new Promise((resolve, reject)=>{
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    spawn(
      cmd,
      [
        'rollup',
        '-c',
        `./rollup.config.js`,
        '--environment',
        `PACKAGENAME:${name}`,
      ],
      {
        stdio: [0, 1, 2],
        shell: true,
      }
    ).on('exit', ()=>{
      cb?.()
      resolve()
    }).on('error', ()=>{
      reject()
    })
  })
}