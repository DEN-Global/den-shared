import {test} from 'node:test';
import assert from 'node:assert/strict';
import contract from '../contracts/v1.json' with {type:'json'};
test('shared API sends cookies and server-issued CSRF only in header',async()=>{
 const original=globalThis.fetch,calls=[];
 try{globalThis.fetch=async(url,options)=>{calls.push({url,options});return Response.json(calls.length===1?{csrfToken:'test-server-csrf',user:{id:'u'}}:{ok:true});};
 const {api}=await import('../src/api.js?csrf');await api('/auth/me');await api('/platform/cart','POST',{productId:'p',quantity:1});
 assert.equal(calls[1].url,'/api/platform/cart');assert.equal(calls[1].options.credentials,'same-origin');assert.equal(calls[1].options.headers['x-csrf-token'],'test-server-csrf');assert.deepEqual(JSON.parse(calls[1].options.body),{productId:'p',quantity:1});assert.equal(calls[0].options.headers['x-csrf-token'],undefined);
 }finally{globalThis.fetch=original;}
});
test('shared API preserves HTTP status and machine error for sign-in handling',async()=>{
 const original=globalThis.fetch;try{globalThis.fetch=async()=>Response.json({error:'SIGN_IN_REQUIRED'},{status:401});const {api}=await import('../src/api.js?errors');await assert.rejects(api('/auth/me'),e=>e.status===401&&e.code==='SIGN_IN_REQUIRED'&&e.message==='sign in required');}finally{globalThis.fetch=original;}
});
test('contract distinguishes cash confirmation, delivery code and final QR',()=>{
 const actions=contract.platform.routes.find(r=>r.path==='/orders/:id/:action').actions;
 assert.deepEqual(actions['cash-confirm'],['code']);assert.deepEqual(actions['delivery-code'],['code']);assert.deepEqual(actions.complete,['token']);assert.ok(contract.securityInvariants.includes('consumer final order-specific short-lived QR confirmation'));assert.deepEqual(contract.platform.orderStates,['placed','reserved','picked_up','delivered']);
});
