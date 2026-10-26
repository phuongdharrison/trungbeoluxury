import { put, get, del } from '@vercel/blob'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
export const privateBlobAdapter: Adapter = () => ({
  name: 'trungbeo-private-blob',
  handleUpload: async ({ file, storageFilePath }) => {
    await put(storageFilePath, file.buffer, { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: file.mimeType, token: process.env.BLOB_READ_WRITE_TOKEN })
  },
  handleDelete: async ({ storageFilePath }) => { await del(storageFilePath, { token: process.env.BLOB_READ_WRITE_TOKEN }) },
  staticHandler: async (_req, { params, headers, doc }) => {
    const filename = params.filename
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) return new Response(null, { status: 404 })
    const parts = ['media', String((doc as Record<string, unknown>)?.prefix || ''), String((doc as Record<string, unknown>)?._objectKey || ''), filename].filter(Boolean)
    if(parts.some(p=>p.includes('..')||p.startsWith('/')||p.includes('\\')))return new Response(null,{status:404})
    const result = await get(parts.join('/'), { access: 'private', token: process.env.BLOB_READ_WRITE_TOKEN })
    if (!result || result.statusCode !== 200) return new Response(null, { status: 404 })
    const responseHeaders = new Headers(headers)
    responseHeaders.set('Content-Type', result.blob.contentType || 'application/octet-stream')
    responseHeaders.set('Cache-Control', 'private, no-store')
    responseHeaders.set('X-Content-Type-Options', 'nosniff')
    return new Response(result.stream, { headers: responseHeaders })
  },
})
