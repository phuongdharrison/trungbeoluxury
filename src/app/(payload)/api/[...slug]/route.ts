import config from '@payload-config'
import { withAuthServerTime } from '../../../../lib/authResponse'
import { REST_GET, REST_POST, REST_DELETE, REST_PATCH, REST_PUT, REST_OPTIONS } from '@payloadcms/next/routes'
const get = REST_GET(config)
const post = REST_POST(config)
export const GET: typeof get = async (request, context) => withAuthServerTime(await get(request, context), new URL(request.url).pathname)
export const POST: typeof post = async (request, context) => withAuthServerTime(await post(request, context), new URL(request.url).pathname)
export const DELETE=REST_DELETE(config)
export const PATCH=REST_PATCH(config)
export const PUT=REST_PUT(config)
export const OPTIONS=REST_OPTIONS(config)
