import { spawn } from 'node:child_process'
import fsExtra from 'fs-extra'
import { readFileSync } from 'node:fs'
import { resolve } from 'path'
import { URL, fileURLToPath } from 'url'


const __dirname = fileURLToPath(new URL('.', import.meta.url))

function getDepPackages(name) {
  // 如果有子包依赖，获取进行剔除
  const pkgConfig = JSON.parse(readFileSync(resolve(__dirname, `../packages/${name}/package.json`), 'utf-8'))
  const pkgDep = Object.keys(pkgConfig.dependencies ?? {})
  const deps = pkgDep.filter((dep) => {
    return /@web-resource-monitor/.exec(dep)
  })
  return deps
}

export async function compile(name, cb) {
  return new Promise((resolve, reject)=>{
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    const external = getDepPackages(name).join()
    spawn(
      cmd,
      [
        'rollup',
        '-c',
        `./rollup.config.js`,
        '--environment',
        `PACKAGENAME:${name}`,
        '-e',
        external
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

export function filterPrivatePackages(packageDirs) {
  return packageDirs.filter((packageName) => {
    return fsExtra.readJSONSync(`packages/${packageName}/package.json`).private !== true
  })
}