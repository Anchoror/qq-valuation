import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const prod = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/

const baseURL = '/qq-valuation/'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    base: prod ? baseURL : '/',
    esbuild: {
      pure: ['console.log'], // 删除 console.log
      drop: ['debugger'] // 删除 debugger
    },
    plugins: [
      vue(),
      AutoImport({
        // 自动导入vue相关的Api
        imports: ['vue', 'pinia', 'vue-router'] // 也支持vue-router、axios等
      }),
      Components({
        resolvers: [VantResolver()]
      })
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve(
              'src/common/less.less'
            )}";`
          },
          javascriptEnabled: true
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@c': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@u': fileURLToPath(new URL('./src/utils/index.js', import.meta.url)),
        '@a': fileURLToPath(new URL('./src/services/api.js', import.meta.url))
      }
    },
    // 跨域配置
    server: {
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })
}
