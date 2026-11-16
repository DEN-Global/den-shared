import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/den-background.js',import.meta.url),'utf8').replace('export function mountBackground','function mountBackground').replaceAll('import.meta.url',"'https://den.example/consumer/den-background.js'");
function browser({staticSheet=true,reduced=false,seen=false}={}){
 const nodes=[],timers=[],store=new Map(seen?[['den.opening.blue-glass.v1','seen']]:[]),media={matches:reduced,addEventListener(){}};
 const element=()=>({dataset:{},listeners:{},setAttribute(){},addEventListener(name,fn){this.listeners[name]=fn;},querySelector(){return {addEventListener(){}};},remove(){nodes.splice(nodes.indexOf(this),1);}});
 const link=element();link.sheet=staticSheet?{}:null;
 const document={querySelector:s=>s==='[data-den-design]'?link:nodes.find(n=>n.className==='den-page-background'),createElement:element,head:{append:n=>nodes.push(n)},body:{append:n=>nodes.push(n),prepend:n=>nodes.unshift(n)}};
 const context=vm.createContext({window:{},document,URL,matchMedia:()=>media,sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},setTimeout:fn=>{timers.push(fn);return 1;},clearTimeout(){}});vm.runInContext(source,context);
 return {mount:()=>vm.runInContext('mountBackground()',context),nodes,timers,link};
}
test('blocking shared stylesheet still mounts background and one session intro',()=>{const b=browser();b.mount();b.mount();assert.equal(b.nodes.filter(n=>n.className==='den-page-background').length,1);assert.equal(b.nodes.filter(n=>n.className==='den-opening').length,1);assert.equal(b.timers.length,1);b.timers[0]();assert.equal(b.nodes.some(n=>n.className==='den-opening'),false);});
test('intro waits for a stylesheet still loading',()=>{const b=browser({staticSheet:false});b.mount();assert.equal(b.nodes.some(n=>n.className==='den-opening'),false);b.link.listeners.load();assert.equal(b.nodes.some(n=>n.className==='den-opening'),true);});
test('reduced motion and a previously seen session omit the intro',()=>{for(const options of [{reduced:true},{seen:true}]){const b=browser(options);b.mount();assert.equal(b.nodes.some(n=>n.className==='den-opening'),false);assert.equal(b.nodes.some(n=>n.className==='den-page-background'),true);}});
