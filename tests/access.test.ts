import {test} from 'node:test'
import assert from 'node:assert/strict'
import {isOwner,safeLink,publishGuard} from '../src/access/index'
test('only owner role can publish',()=>{assert.equal(isOwner({role:'owner'}),true);assert.equal(isOwner({role:'editor'}),false);assert.equal(isOwner(null),false);assert.throws(()=>publishGuard({data:{_status:'published'},req:{user:{role:'editor'}}} as never));assert.doesNotThrow(()=>publishGuard({data:{_status:'draft'},req:{user:{role:'editor'}}} as never))})
test('reject executable and protocol-relative links',()=>{for(const s of ['javascript:alert(1)','data:text/html,Hi','//evil.example','ftp://example.com'])assert.notEqual(safeLink(s),true);for(const s of ['/san-pham/a','https://zalo.me/84912067155','tel:+84912067155'])assert.equal(safeLink(s),true)})
