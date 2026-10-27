import test from 'node:test'
import assert from 'node:assert/strict'
import { uploadAlbumPhoto } from '../src/lib/albumUpload'
import { Categories } from '../src/collections/Catalog'
test('upload sends a real file with metadata and uses the signed-in session', async () => {
 const image = new File(['photo'], 'lua.jpg', {type:'image/jpeg'})
 const request: typeof fetch = async (url, init) => {
  assert.equal(url, '/api/media'); assert.equal(init?.credentials, 'same-origin')
  const form = init?.body as FormData
  assert.equal((form.get('file') as File).name, 'lua.jpg')
  assert.deepEqual(JSON.parse(String(form.get('_payload'))), {alt:'lua', public:true})
  return Response.json({doc:{id:42}})
 }
 assert.equal(await uploadAlbumPhoto(image,true,request),42)
})
test('invalid types and oversized files are rejected before upload', async () => {
 const request: typeof fetch = async () => { throw Error('must not upload') }
 await assert.rejects(uploadAlbumPhoto(new File(['x'],'test.pdf',{type:'application/pdf'}),false,request),/JPG/)
 await assert.rejects(uploadAlbumPhoto(new File([new Uint8Array(4*1024*1024+1)],'big.jpg',{type:'image/jpeg'}),false,request),/4 MB/)
})
test('failed upload cannot append a missing media id and later files can still succeed', async () => {
 const image=new File(['x'],'test.png',{type:'image/png'})
 await assert.rejects(uploadAlbumPhoto(image,false,async()=>Response.json({errors:[{message:'Tải thất bại'}]},{status:500})),/Tải thất bại/)
 assert.equal(await uploadAlbumPhoto(image,false,async()=>Response.json({doc:{id:43}})),43)
 await assert.rejects(uploadAlbumPhoto(image,false,async()=>new Response('Unauthorized',{status:401})),/đăng nhập/)
})
test('album exposes bulk upload control and removes caption input without destroying saved captions', () => {
 assert.ok(Categories.fields.some(field=>'name' in field&&field.name==='albumBulkUpload'&&field.type==='ui'))
 const gallery=Categories.fields.find(field=>'name' in field&&field.name==='gallery')
 assert.ok(gallery?.type==='array')
 const caption=gallery.fields.find(field=>'name' in field&&field.name==='caption')
 assert.ok(caption?.admin && 'hidden' in caption.admin && caption.admin.hidden === true)
})
