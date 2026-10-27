// Uses a disposable schema; never modifies store records or uploads Blob files.
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import config from '../src/payload.config'
const require = createRequire(import.meta.resolve('@payloadcms/db-postgres'))
const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const schema = 'qa_albums_' + randomBytes(6).toString('hex')
let payload: Awaited<ReturnType<typeof getPayload>> | undefined
try {
 for (const file of ['20261026_185949_initial_cms', '20261027_000734_category_albums']) {
  const source = readFileSync(new URL('../src/migrations/' + file + '.ts', import.meta.url), 'utf8')
  const sql = source.split('sql`')[1].split('`)')[0].replaceAll('"cms"', '"' + schema + '"')
  await pool.query(sql)
 }
 const isolatedConfig = await config
 const adapter = postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL, max: 6 }, schemaName: schema, push: false })
 isolatedConfig.db = { ...adapter, allowIDOnCreate: adapter.allowIDOnCreate ?? false, name: adapter.name ?? 'postgres' }
 payload = await getPayload({ config: isolatedConfig })
 const user = await payload.create({ collection: 'users', context: { internalUserBootstrap: true }, data: {
  name: 'Album QA', email: 'album-qa@example.invalid', password: randomBytes(32).toString('hex'), role: 'owner',
 } })
 // Synthetic media metadata only. No Blob files are created or changed.
 const media = await pool.query(`INSERT INTO "${schema}".media (alt, public, filename, mime_type, url) VALUES ('Album QA image', true, 'album-qa.jpg', 'image/jpeg', '/api/media/file/album-qa.jpg') RETURNING id`)
 assert.ok(media.rows.length, 'A public media fixture is required')
 const image = media.rows[0].id
 const category = await payload.create({ collection: 'categories', user, overrideAccess: false, locale: 'vi', data: {
  name: 'Album thử nghiệm', slug: 'album-qa', description: 'Giới thiệu thử nghiệm', _status: 'draft',
  gallery: [{ image, caption: 'Ảnh đầu' }, { image, caption: 'Ảnh thứ hai' }],
 } })
 console.log('Created isolated category with two images')
 assert.equal(category.gallery?.length, 2)
 assert.equal((await payload.find({ collection: 'categories', overrideAccess: false })).totalDocs, 0)
 await payload.update({ collection: 'categories', id: category.id, user, overrideAccess: false, locale: 'en', data: { name: 'Album QA', _status: 'published' } })
 console.log('Published isolated category')
 const published = await payload.findByID({ collection: 'categories', id: category.id, overrideAccess: false, locale: 'vi', depth: 1 })
 assert.equal(published.description, 'Giới thiệu thử nghiệm')
 assert.equal(published.gallery?.length, 2)
 assert.equal(typeof published.gallery?.[0].image, 'object')
 const rows = published.gallery!
 await payload.update({ collection: 'categories', id: category.id, user, overrideAccess: false, locale: 'vi', draft: true, data: {
  description: 'Giới thiệu đã sửa', gallery: [rows[1], { ...rows[0], caption: 'Chú thích đã sửa' }],
 } })
 assert.equal((await payload.findByID({ collection: 'categories', id: category.id, overrideAccess: false, locale: 'vi' })).description, 'Giới thiệu thử nghiệm')
 const draft = await payload.findByID({ collection: 'categories', id: category.id, user, overrideAccess: false, draft: true, locale: 'vi' })
 assert.equal(draft.gallery?.[0].id, rows[1].id)
 assert.equal(draft.gallery?.[1].caption, 'Chú thích đã sửa')
 await payload.update({ collection: 'categories', id: category.id, user, overrideAccess: false, locale: 'vi', data: { gallery: [draft.gallery![1]], description: draft.description, _status: 'published' } })
 const final = await payload.findByID({ collection: 'categories', id: category.id, overrideAccess: false, locale: 'vi' })
 assert.equal(final.gallery?.length, 1)
 assert.equal(final.description, 'Giới thiệu đã sửa')
 console.log('PASS: isolated CMS album add, caption edit, reorder, remove, introduction, draft isolation and publish.')
} finally {
 await payload?.destroy()
 await pool.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
 await pool.end()
 console.log('Disposable QA schema removed; store content and files unchanged.')
}
process.exit(0)
