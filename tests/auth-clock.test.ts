import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { withAuthServerTime } from '../src/lib/authResponse'

const authPath = resolve('node_modules/@payloadcms/ui/dist/providers/Auth')
const { createAuthClock } = await import(pathToFileURL(`${authPath}/sessionClock.js`).href)
const { getAuthSessionTiming } = await import(pathToFileURL(`${authPath}/sessionTiming.js`).href)

test('the CMS browser bundle also uses the synchronized session clock', async () => {
  const bundle = await readFile(resolve(authPath, '../../exports/client/index.js'), 'utf8')
  assert.match(bundle, /authNow as cmsAuthNow/)
  assert.match(bundle, /cmsSyncAuthClock\(X.serverTime\)/)
  const auth = bundle.slice(bundle.indexOf('function MS('), bundle.indexOf('var Ie='))
  assert.ok(auth.includes('cmsAuthNow'))
  assert.ok(!auth.includes('Date.now'))
})

test('session lasts 24 hours with device clocks seven hours ahead or behind', () => {
  const serverTime = 1_800_000_000_000
  for (const skew of [-7, 0, 7]) {
    let elapsed = 0
    let deviceTime = serverTime + skew * 3_600_000
    const clock = createAuthClock({ wallNow: () => deviceTime, monotonicNow: () => elapsed })
    clock.synchronize(serverTime)
    const expirationMs = serverTime + 86_400_000
    const timing = getAuthSessionTiming({ expirationMs, nowMs: clock.now() })
    assert.equal(timing.expiresAt - clock.now(), 86_400_000)
    deviceTime += 86_400_000 // Changing the system clock must not expire a valid session.
    elapsed = 60_000
    assert.equal(timing.expiresAt - clock.now(), 86_340_000)
    elapsed = 86_400_001
    assert.ok(clock.now() > timing.expiresAt)
    clock.synchronize(serverTime) // A delayed response or another tab cannot rewind time.
    assert.ok(clock.now() > timing.expiresAt)
    clock.synchronize(Number.NaN)
    assert.ok(Number.isFinite(clock.now()))
  }
})

test('auth responses preserve cookie and JWT expiration while providing uncached server time', async () => {
  for (const action of ['login', 'me', 'refresh-token']) {
    const response = await withAuthServerTime(Response.json({ user: { id: 1 }, exp: 1234, token: 'test-only' }, { headers: { 'Set-Cookie': 'payload-token=test-only; HttpOnly; Secure; SameSite=Lax' } }), `/api/users/${action}`)
    const data = await response.json()
    assert.equal(data.exp, 1234)
    assert.equal(data.token, 'test-only')
    assert.ok(Math.abs(data.serverTime - Date.now()) < 1000)
    assert.match(response.headers.get('set-cookie')!, /HttpOnly; Secure; SameSite=Lax/)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
  }
})

test('unrelated and failed responses remain untouched', async () => {
  const product = Response.json({ docs: [] })
  assert.equal(await withAuthServerTime(product, '/api/products'), product)
  const failed = Response.json({ errors: [] }, { status: 401 })
  assert.equal(await withAuthServerTime(failed, '/api/users/login'), failed)
})
