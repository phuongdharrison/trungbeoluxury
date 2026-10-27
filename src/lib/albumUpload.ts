export async function uploadAlbumPhoto(file: File, makePublic: boolean, request: typeof fetch = fetch): Promise<number> {
 if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chỉ hỗ trợ JPG, PNG hoặc WebP.')
 if (file.size > 4 * 1024 * 1024) throw new Error('Ảnh vượt quá 4 MB. Hãy nén ảnh trước khi tải.')
 const form = new FormData()
 form.append('file', file)
 form.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, ''), public: makePublic }))
 const response = await request('/api/media', { method: 'POST', credentials: 'same-origin', body: form })
 if (response.status === 401 || response.status === 403) throw new Error('Phiên đăng nhập hết hạn hoặc bạn chưa có quyền tải ảnh. Hãy đăng nhập lại.')
 let result
 try { result = await response.json() } catch { throw new Error('Máy chủ không trả về kết quả tải ảnh hợp lệ. Hãy thử lại.') }
 if (!response.ok || !Number.isInteger(result.doc?.id)) throw new Error(result.errors?.[0]?.message || 'Không tải được ảnh. Kiểm tra kết nối hoặc đăng nhập lại.')
 return result.doc.id
}
