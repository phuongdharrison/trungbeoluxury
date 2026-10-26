import { withPayload } from '@payloadcms/next/withPayload'
export default withPayload({ poweredByHeader: false, reactStrictMode: true, serverExternalPackages: ['sharp'], async headers() { return [{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'private, no-store'}]}] } })
