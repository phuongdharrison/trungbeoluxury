'use client'
import React, { useRef, useState } from 'react'
import { useAuth, useForm, useFormProcessing } from '@payloadcms/ui'
import { uploadAlbumPhoto } from '../lib/albumUpload'

export default function AlbumBulkUpload() {
 const { user } = useAuth()
 const { dispatchFields, setModified, setProcessing, disabled } = useForm()
 const processing = useFormProcessing()
 const input = useRef<HTMLInputElement>(null)
 const [busy, setBusy] = useState(false)
 const [makePublic, setMakePublic] = useState(false)
 const [status, setStatus] = useState('')
 const [errors, setErrors] = useState<string[]>([])
 const locked = busy || processing || disabled
 async function upload(files: File[]) {
  if (!files.length || locked) return
  setBusy(true); setProcessing(true); setErrors([])
  const failed: string[] = []
  let added = 0
  try {
   for (let index = 0; index < files.length; index++) {
    const file = files[index]
    setStatus(`Đang tải ${index + 1}/${files.length}: ${file.name}`)
    try {
     const id = await uploadAlbumPhoto(file, user?.role === 'owner' && makePublic)
     // Append against the reducer's latest state so fast uploads cannot overwrite earlier rows.
     dispatchFields({ type: 'ADD_ROW', path: 'gallery', subFieldState: { image: { value: id, initialValue: id, valid: true } } })
     setModified(true)
     added++
    } catch (error) {
     failed.push(`${file.name}: ${error instanceof Error ? error.message : 'Không tải được ảnh.'}`)
    }
   }
  } finally {
   setStatus(`Đã thêm ${added}/${files.length} ảnh vào album. ${added ? 'Chọn Lưu nháp hoặc Đăng thay đổi để lưu album.' : ''}`)
   setErrors(failed); setBusy(false); setProcessing(false)
   if (input.current) input.current.value = ''
  }
 }
 return <section className="album-bulk-upload" aria-busy={busy}>
  <h3>Thêm nhiều ảnh vào album</h3>
  <p>Chọn nhiều ảnh trong một lần. Hỗ trợ JPG, PNG, WebP; tối đa 4 MB mỗi ảnh.</p>
  {user?.role === 'owner' && <label><input type="checkbox" checked={makePublic} disabled={locked} onChange={event => setMakePublic(event.target.checked)} /> Cho phép các ảnh mới hiển thị công khai trên website</label>}
  <div><input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={locked} aria-label="Chọn nhiều ảnh cho album" onChange={event => void upload(Array.from(event.target.files || []))} /></div>
  <p role="status" aria-live="polite">{status}</p>
  {errors.length > 0 && <div role="alert"><p>Các ảnh sau chưa được thêm; bạn có thể chọn lại riêng những ảnh này:</p><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
 </section>
}
