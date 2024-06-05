import type { ServiceContext } from '@vtex/api'
import { ForbiddenError, Service, method } from '@vtex/api'

export default new Service({
  routes: {
    settings: method({
      GET: async (context: ServiceContext) => {
        const {
          'user-agent': userAgent,
          'x-vtex-origin-account': originAccount,
        } = context.headers as Record<string, string | undefined>

        if (
          !userAgent?.includes('ssesandbox04.catalog-importer') ||
          !originAccount
        ) {
          throw new ForbiddenError('Unauthorized access')
        }

        const settings = await context.clients.apps.getAppSettings(
          process.env.VTEX_APP_ID as string
        )

        context.set('Access-Control-Allow-Origin', '*')
        context.set('Access-Control-Allow-Headers', '*')
        context.set('Access-Control-Allow-Credentials', 'true')
        context.set('Access-Control-Allow-Methods', '*')
        context.set('Content-Type', 'application/json')

        context.status = 200
        context.body = settings
      },
    }),
  },
})
