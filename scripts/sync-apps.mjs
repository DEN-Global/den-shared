import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const role of ['consumer','manager','rider','dispatch','admin','warehouse','pets']){
 const app=path.resolve(root,'../den-'+role),vendor=path.join(app,'vendor/den-shared');await mkdir(vendor,{recursive:true});await cp(path.join(root,'src'),path.join(vendor,'src'),{recursive:true});await cp(path.join(root,'contracts'),path.join(vendor,'contracts'),{recursive:true});
 const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));delete pkg.devDependencies;delete pkg.scripts;await writeFile(path.join(vendor,'package.json'),JSON.stringify(pkg,null,2)+'\n');
 const {readdir}=await import('node:fs/promises');const files=await readdir(path.join(root,'src'));const hashes={};for(const file of files.sort())hashes['src/'+file]=createHash('sha256').update(await readFile(path.join(root,'src',file))).digest('hex');hashes['contracts/v1.json']=createHash('sha256').update(await readFile(path.join(root,'contracts/v1.json'))).digest('hex');await writeFile(path.join(vendor,'PROVENANCE.json'),JSON.stringify({source:'DEN-Global/den-shared',version:pkg.version,algorithm:'sha256',files:hashes},null,2)+'\n');
 await mkdir(path.join(app,'public'),{recursive:true});await cp(path.join(root,'src/theme-init.js'),path.join(app,'public/den-theme.js'));
 for(const file of ['den-background.js','den-background.css','accessories-pattern.jpg','glass-art-background.jpg','green-community.mp4','green-community-poster.jpg','inter-latin-400-normal.woff2','inter-latin-600-normal.woff2','space-grotesk-latin-700-normal.woff2','syne-latin-700-normal.woff2','plus-jakarta-sans-latin-400-normal.woff2','plus-jakarta-sans-latin-600-normal.woff2'])await cp(path.join(root,'src',file),path.join(app,'public',file));
 const appPkg=JSON.parse(await readFile(path.join(app,'package.json'),'utf8'));appPkg.dependencies['@den/shared']='file:vendor/den-shared';await writeFile(path.join(app,'package.json'),JSON.stringify(appPkg,null,2)+'\n');
}
