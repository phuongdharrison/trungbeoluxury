import type { Access, CollectionBeforeChangeHook, GlobalBeforeChangeHook } from 'payload'
export const isOwner = (user: unknown): boolean => !!user && (user as { role?: string }).role === 'owner'
export const staff: Access = ({ req }) => Boolean(req.user)
export const owner: Access = ({ req }) => isOwner(req.user)
export const published: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } }
export const publishGuard: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user && !isOwner(req.user)) {
    if (data._status === 'published') throw new Error('Chỉ chủ cửa hàng có quyền đăng nội dung.')
    data._status = 'draft'
  }
  return data
}
export const globalPublishGuard: GlobalBeforeChangeHook = ({ data, req }) => {
  if (req.user && !isOwner(req.user)) {
    if (data._status === 'published') throw new Error('Chỉ chủ cửa hàng có quyền đăng nội dung.')
    data._status = 'draft'
  }
  return data
}
export function safeLink(value: unknown): true | string {
  if (!value) return true
  if (typeof value !== 'string') return 'Đường dẫn không hợp lệ.'
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { return ['https:', 'tel:'].includes(new URL(value).protocol) ? true : 'Chỉ dùng https://, tel: hoặc đường dẫn trong website.' } catch { return 'Hãy nhập một đường dẫn hợp lệ.' }
}

// Draft mode must be applied before Payload decides whether to update the live document.
export const forceEditorDraft: import('payload').CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (req.user && !isOwner(req.user) && (operation === 'create' || operation === 'update' || operation === 'updateByID')) {
    (args as unknown as {draft:boolean}).draft = true
  }
  return args
}
