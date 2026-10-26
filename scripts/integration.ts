export {}
import assert from 'node:assert/strict'
import {randomBytes} from 'node:crypto'
const {getPayload}=await import('payload')
const {default:config}=await import('../src/payload.config')
const p=await getPayload({config})
const ids:{collection:string,id:number}[]=[]
try{
 const suffix=randomBytes(6).toString('hex'),password=randomBytes(24).toString('base64url')
 const owner=await p.create({collection:'users',context:{internalUserBootstrap:true},data:{name:'Integration owner',email:`cms-owner-${suffix}@example.invalid`,password,role:'owner'}});ids.push({collection:'users',id:owner.id})
 console.log('Owner bootstrap passed');
 const editor=await p.create({collection:'users',user:owner,overrideAccess:false,data:{name:'Integration editor',email:`cms-editor-${suffix}@example.invalid`,password,role:'editor'}});ids.push({collection:'users',id:editor.id})
 console.log('Editor creation passed');
 assert.ok((await p.login({collection:'users',data:{email:owner.email,password}})).token)
 await assert.rejects(p.login({collection:'users',data:{email:owner.email,password:'not-the-password'}}))
 const category=(await p.find({collection:'categories',limit:1})).docs[0]
 const doc=await p.create({collection:'products',user:editor,overrideAccess:false,locale:'vi',data:{name:'Bản nháp kiểm thử',slug:'test-'+suffix,category:category.id,_status:'draft'}});ids.push({collection:'products',id:doc.id})
 assert.equal((await p.find({collection:'products',overrideAccess:false,where:{id:{equals:doc.id}}})).totalDocs,0)
 await assert.rejects(p.update({collection:'products',id:doc.id,user:editor,overrideAccess:false,data:{_status:'published'}}))
 await p.update({collection:'products',id:doc.id,user:owner,overrideAccess:false,locale:'en',data:{name:'Integration published',_status:'published'}})
 assert.equal((await p.find({collection:'products',overrideAccess:false,where:{id:{equals:doc.id}}})).totalDocs,1)
 await p.update({collection:'products',id:doc.id,user:editor,overrideAccess:false,locale:'vi',data:{name:'Bí mật trong bản nháp'}})
 const draftProbe=await p.find({collection:'products',overrideAccess:false,locale:'vi',draft:true,where:{id:{equals:doc.id}}});assert.ok(draftProbe.docs.every(d=>d.name!=='Bí mật trong bản nháp'))
 const anon=await p.findByID({collection:'products',id:doc.id,overrideAccess:false,locale:'vi'})
 assert.notEqual(anon.name,'Bí mật trong bản nháp')
 const priv=await p.findByID({collection:'products',id:doc.id,user:owner,overrideAccess:false,locale:'vi',draft:true})
 assert.equal(priv.name,'Bí mật trong bản nháp')
 const changed=await p.update({collection:'users',id:editor.id,user:editor,overrideAccess:false,data:{role:'owner'}})
 assert.equal(changed.role,'editor')
 await assert.rejects(p.create({collection:'users',overrideAccess:false,data:{email:`evil-${suffix}@example.invalid`,password,name:'Denied',role:'editor'}}))
 const versions=await p.findVersions({collection:'products',where:{parent:{equals:doc.id}}})
 assert.ok(versions.totalDocs>=2)
 const store=await p.findGlobal({slug:'store',overrideAccess:false})
 assert.equal(store.name,'Trung Béo Luxury')
 const sharp=(await import('sharp')).default
 const buffer=await sharp({create:{width:32,height:32,channels:3,background:'#314e3f'}}).png().toBuffer()
 const media=await p.create({collection:'media',user:owner,overrideAccess:false,data:{alt:'Ảnh kiểm thử CMS',public:false},file:{data:buffer,mimetype:'image/png',name:'integration-'+suffix+'.png',size:buffer.length}})
 ids.push({collection:'media',id:media.id})
 assert.equal((await p.find({collection:'media',overrideAccess:false,where:{id:{equals:media.id}}})).totalDocs,0)
 const privateFetch=await fetch('http://127.0.0.1:3000'+new URL(media.url!,'http://127.0.0.1:3000').pathname)
 assert.ok([401,403,404].includes(privateFetch.status))
 await p.update({collection:'media',id:media.id,user:owner,overrideAccess:false,data:{public:true}})
 const publicFetch=await fetch('http://127.0.0.1:3000'+new URL(media.url!,'http://127.0.0.1:3000').pathname)
 assert.equal(publicFetch.status,200)
 assert.match(publicFetch.headers.get('content-type')||'',/image\/png/)
 console.log('PASS: private Blob upload, private file denial, explicit public media delivery.')
 console.log('PASS: real database login, wrong password, anonymous write rejection, private drafts, editor publish rejection, role escalation rejection, published reads and version history.')
}catch(e){console.error('Integration test failed:',e instanceof Error?e.message:'unknown error');if(e&&typeof e==='object'&&'data' in e)console.error(JSON.stringify(e.data));process.exitCode=1}
finally{for(const x of ids.reverse()){try{await p.delete({collection:x.collection as 'users',id:x.id,overrideAccess:true,trash:true})}catch{console.error('Test cleanup needs review for',x.collection,x.id);process.exitCode=1}}await p.destroy()}
process.exit(process.exitCode||0)
