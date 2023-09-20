import rollupTypescript from '@rollup/plugin-typescript'
import rollupJson from '@rollup/plugin-json'
import rollupCommonjs from '@rollup/plugin-commonjs'
import rollupNodeResolve from '@rollup/plugin-node-resolve'
import rollupTerser from '@rollup/plugin-terser'
import rollupDts from 'rollup-plugin-dts'
import fs from 'fs-extra'
import process from 'node:process'

function getPlugins(dts = false, terser = false) {
  const tsconfig = fs.readJSONSync('../../tsconfig.json')
  let plugins = [
    rollupCommonjs(),
    rollupJson(),
    rollupTypescript(tsconfig.compilerOptions),
  ]
  if (terser) {
    plugins.push(rollupTerser())
    plugins.push(rollupNodeResolve())
  }
  if (dts) {
    plugins = [
      rollupDts({
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
      rollupNodeResolve(),
    ]
  }

  return plugins
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/index.esm.js`,
        format: 'es',
      },
      {
        file: `dist/index.js`,
        format: 'cjs',
      },
    ],
    plugins: getPlugins(),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/index.d.ts`,
        format: 'es',
      },
    ],
    plugins: getPlugins(true),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/index.min.js`,
        format: 'umd',
        name: 'PACKAGE' + process.env.PACKAGENAME,
      },
    ],
    plugins: getPlugins(false, true),
  },
]
