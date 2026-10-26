import type { CollectionConfig } from 'payload'
import { isOwner, owner } from '../access/index'
export const Users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Tài khoản', plural: 'Tài khoản quản trị' },
  admin: { useAsTitle: 'name', group: 'Cài đặt', defaultColumns: ['name', 'email', 'role'] },
  auth: { maxLoginAttempts: 5, lockTime: 900000, tokenExpiration: 7200, cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' } },
  access: {
    admin: async ({ req }) => Boolean(req.user) || (process.env.NODE_ENV === 'development' && (await req.payload.count({collection:'users',overrideAccess:true})).totalDocs === 0),
    create: owner,
    read: ({ req }) => isOwner(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => isOwner(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false,
    delete: owner,
  },
  hooks: { beforeChange: [async ({ data, req, operation, originalDoc }) => {
    if (operation === 'create' && !req.user) {
      const localHost = (()=>{try{return ['localhost','127.0.0.1'].includes(new URL(req.url||'').hostname)}catch{return false}})()
      const bootstrap = process.env.NODE_ENV === 'development' && localHost && data.email === process.env.CMS_BOOTSTRAP_EMAIL
      if (!bootstrap && !req.context.internalUserBootstrap) throw new Error('Tài khoản chỉ được tạo bởi chủ cửa hàng. Khởi tạo lần đầu phải thực hiện riêng tư trên localhost.')
      const count = await req.payload.count({collection:'users',req,overrideAccess:true})
      if (count.totalDocs && !req.context.internalUserBootstrap) throw new Error('Tài khoản đầu tiên đã được tạo.')
      data.role = req.context.internalUserBootstrap ? (data.role || 'editor') : 'owner'
    } else if (req.user && !isOwner(req.user)) data.role = originalDoc?.role || 'editor'
    return data
  }] },
  fields: [
    { name: 'name', label: 'Tên hiển thị', type: 'text', required: true },
    { name: 'role', label: 'Quyền quản trị', type: 'select', required: true, defaultValue: 'editor', admin:{condition:(_data,_sibling,{user})=>Boolean(user)}, options: [{label:'Chủ cửa hàng',value:'owner'},{label:'Biên tập viên — chỉ soạn nháp',value:'editor'}], access: { create: ({ req }) => isOwner(req.user), update: ({ req }) => isOwner(req.user) } },
  ],
}
