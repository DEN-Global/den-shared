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
test('dark-only theme overrides saved light and light system settings',()=>{for(const stored of [null,'light','dark','unknown']){const b=browser({stored,systemDark:false});assert.equal(b.theme.get(),'dark');assert.equal(b.document.documentElement.dataset.theme,'dark');assert.equal(b.document.documentElement.style.colorScheme,'dark');assert.equal(b.store.get('den.theme'),'dark');}});
test('legacy setters and cross-tab light preferences cannot enable light mode',()=>{const b=browser();b.theme.set('light');b.theme.toggle();const event=new Event('storage');Object.assign(event,{key:'den.theme',newValue:'light'});b.window.dispatchEvent(event);assert.equal(b.theme.get(),'dark');assert.equal(b.document.documentElement.dataset.theme,'dark');});
test('blocked storage and repeat bootstrap retain dark mode',()=>{const b=browser({blocked:true});vm.runInContext(source,b.context);assert.equal(b.window.DENTheme,b.theme);assert.equal(b.theme.get(),'dark');});
