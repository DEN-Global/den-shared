import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/theme-init.js',import.meta.url),'utf8');
function browser({stored=null,systemDark=false,blocked=false}={}){
 const window=new EventTarget(),document=new EventTarget(),media=new EventTarget(),store=new Map(stored===null?[]:[['den.theme',stored]]);
 media.matches=systemDark;window.matchMedia=()=>media;document.documentElement={dataset:{},style:{}};document.querySelectorAll=()=>[];
 const localStorage={getItem:key=>{if(blocked)throw Error('Storage blocked');return store.get(key)??null;},setItem:(key,value)=>{if(blocked)throw Error('Storage blocked');store.set(key,value);}};
 const context=vm.createContext({window,document,localStorage,CustomEvent});vm.runInContext(source,context);
 return {window,document,media,store,context,theme:window.DENTheme};
}
test('new visitor follows system theme before UI mounts',()=>{const b=browser({systemDark:true});assert.equal(b.theme.get(),'dark');assert.equal(b.document.documentElement.dataset.theme,'dark');assert.equal(b.document.documentElement.style.colorScheme,'dark');assert.equal(b.store.size,0);});
test('explicit preference survives system changes and updates subscribers',()=>{const b=browser({stored:'light',systemDark:true});let changes=0;b.window.addEventListener('den:theme',()=>changes++);b.theme.toggle();assert.equal(b.store.get('den.theme'),'dark');b.media.dispatchEvent(new Event('change'));assert.equal(b.theme.get(),'dark');assert.equal(changes,1);});
test('another tab updates the same theme store without rewriting storage',()=>{const b=browser({stored:'light'});const event=new Event('storage');Object.assign(event,{key:'den.theme',newValue:'dark'});b.window.dispatchEvent(event);assert.equal(b.theme.get(),'dark');assert.equal(b.store.get('den.theme'),'light');});
test('blocked storage still permits theme switching and repeat bootstrap is harmless',()=>{const b=browser({blocked:true});b.theme.toggle();assert.equal(b.theme.get(),'dark');vm.runInContext(source,b.context);assert.equal(b.window.DENTheme,b.theme);assert.equal(b.theme.get(),'dark');});
test('invalid preferences are ignored and system changes apply while unset',()=>{const b=browser({stored:'unknown'});const event=new Event('change');Object.assign(event,{matches:true});b.media.dispatchEvent(event);assert.equal(b.theme.get(),'dark');b.theme.set('invalid');assert.equal(b.theme.get(),'dark');});
