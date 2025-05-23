import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from '@tanstack/start/config'
import contentCollections from '@content-collections/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    preset: 'node-server',
  },
  vite: {
    plugins: [
      tsConfigPaths(),
      (() => {
        const replacements = [
          // replace `throw Error(p(418))` with `console.error(p(418))`
          ['throw Error(p(418))', 'console.error(p(418))'],
          ['Error(p(418))', 'console.error(p(418))'],
          ['throw Error(n(418))', 'console.error(n(418))'],
          ['Error(n(418))', 'console.error(n(418))'],
          ['throw Error(p(423))', 'console.error(p(423))'],
          ['throw Error(n(423))', 'console.error(n(423))'],
          ['Error(n(423))', 'console.error(n(423))'],
          // replace `throw new Error('Hydration failed` with `console.error('Hydration failed')`
          [
            `throw new Error('Hydration failed`,
            `console.error('Hydration failed`,
          ],
        ] as const

        return {
          name: 'tanner-test',
          enforce: 'post',
          transform(code, id) {
            replacements.forEach(([search, replacement]) => {
              if (code.includes(search)) {
                code = code.replaceAll(search, replacement)
              }
            })

            return code
          },
        }
      })(),
    ],
  },
  routers: {
    client: {
      vite: {
        plugins: [
          sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'tanstack',
            project: 'tanstack-com',
          }),
          contentCollections(),
        ],
      },
    },
  },
})
