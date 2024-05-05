// rollup.config.js
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json' with {type: "json"}

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    terser(),
  ],
}