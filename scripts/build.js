import {cp,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist',root),{recursive:true});
await cp(new URL('app/',root),new URL('dist/',root),{recursive:true});
console.log('Static app copied to dist. No user answers or research source files are packaged.');
