// Only the UI clock changes. JWT validation and token lifetime stay on the server.
export async function withAuthServerTime(response: Response, pathname: string): Promise<Response> {
  if (!/^\/api\/users\/(login|me|refresh-token)\/?$/.test(pathname) || !response.ok || !response.headers.get('content-type')?.includes('application/json')) return response
  const data = await response.json()
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'private, no-store')
  headers.delete('content-length')
  return Response.json({ ...data, serverTime: Date.now() }, { status: response.status, headers })
}
