import rollupTypescript from '@rollup/plugin-typescript'
import rollupJson from '@rollup/plugin-json'
import rollupCommonjs from '@rollup/plugin-commonjs'
import rollupTerser from '@rollup/plugin-terser'
import rollupAlias from '@rollup/plugin-alias'
import rollupDts from 'rollup-plugin-dts'
import fs from 'fs-extra'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function getPlugins(dts = false, terser = false) {
  const tsconfig = fs.readJSONSync('./tsconfig.json')
  const aliasKey = `@web-resource-monitor/${process.env.PACKAGENAME}`
  let plugins = [
    rollupCommonjs(),
    rollupJson(),
    rollupAlias({
      [aliasKey]: path.resolve(
        __dirname,
        `./packages/${process.env.PACKAGENAME}/src/index.ts`)
    }),
    rollupTypescript(tsconfig.compilerOptions),
  ]
  if (terser) {
    plugins.push(rollupTerser())
  }
  if (dts) {
    plugins = [
      rollupDts({
        preserveSymlinks: false
      }),
    ]
  }

  return plugins
}

const input = `./packages/${process.env.PACKAGENAME}/src/index.ts`
export default [
  {
    input,
    output: [
      {
        file: `./packages/${process.env.PACKAGENAME}/dist/index.esm.js`,
        format: 'es',
      },
      {
        file: `./packages/${process.env.PACKAGENAME}/dist/index.js`,
        format: 'cjs',
      },
    ],
    plugins: getPlugins(),
  },
  {
    input,
    output: [
      {
        file: `./packages/${process.env.PACKAGENAME}/dist/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: getPlugins(true),
  },
  {
    input,
    output: [
      {
        file: `./packages/${process.env.PACKAGENAME}/dist/index.min.js`,
        format: 'umd',
        name: 'webResourceMonitor',
      },
    ],
    plugins: getPlugins(false, true),
  },
]
