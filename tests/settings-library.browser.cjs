const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const {mkdtemp,rm}=require('node:fs/promises');
const os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');

(async()=>{
 const runtime=await mkdtemp(path.join(os.tmpdir(),'mooz-settings-library-'));
 const port=17549,origin='http://127.0.0.1:'+port;
 const server=spawn(process.execPath,['server.mjs'],{
   cwd:path.resolve(__dirname,'..'),
   env:{...process.env,PORT:String(port),MOOZ_RUNTIME_DIR:runtime,MOOZ_RELAY_URL:'',MOOZ_RELAY_KEY:''},
   stdio:'ignore'
 });
 let browser;
 try{
  let ready=false;
  for(let i=0;i<80;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert.ok(ready,'server started');
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
  const context=await browser.newContext({viewport:{width:1440,height:980},acceptDownloads:true});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept('Ảnh đã đổi tên.png'));
  await page.goto(origin+'/#settings');
  const nav=page.getByRole('tablist',{name:'Danh mục kết nối và cài đặt'});
  await nav.waitFor();
  assert.equal(await nav.getByRole('tab').count(),7);
  const chrome=nav.getByRole('tab',{name:'Chrome & tab AI',exact:true});
  const api=nav.getByRole('tab',{name:'API AI',exact:true});
  const relay=nav.getByRole('tab',{name:'Máy ảo / Relay',exact:true});
  await api.click();
  const key=page.getByLabel('Khóa API openai',{exact:true});
  await key.waitFor();
  await key.fill('sk-local-unsaved-ui-only');
  await chrome.click();
  assert.equal(await key.isVisible(),false);
  await api.click();
  assert.equal(await key.inputValue(),'sk-local-unsaved-ui-only','switching settings categories must preserve unsaved inputs');
  await relay.click();
  assert.equal(await page.getByRole('region',{name:'Kết nối Chrome máy ảo'}).isVisible(),true);
  await chrome.click();
  await page.getByRole('button',{name:'Tạo mã ghép Chrome',exact:true}).click();
  const code=page.getByLabel('Mã ghép Chrome',{exact:true});
  await code.waitFor({state:'visible'});
  const uri=await code.inputValue();assert.match(uri,/^workflow-connect:/);
  await page.getByRole('button',{name:'Sao chép mã',exact:true}).click();
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),uri,'copy action must copy real pairing code');
  const control=await page.evaluate(async()=>{
   const {button}=await import('./client-api.js');
   let clicks=0,asyncClicks=0;
   const b=button('Synchronous',()=>{clicks++;});
   const changes=[];
   const observer=new MutationObserver(()=>changes.push(b.disabled));
   document.body.append(b);
   observer.observe(b,{attributes:true,attributeFilter:['disabled']});
   b.click();b.click();b.click();
   await new Promise(resolve=>setTimeout(resolve,0));observer.disconnect();b.remove();
   const other=button('Asynchronous',()=>{asyncClicks++;return new Promise(resolve=>setTimeout(resolve,40));});
   document.body.append(other);other.click();other.click();
   await new Promise(resolve=>setTimeout(resolve,60));other.click();
   await new Promise(resolve=>setTimeout(resolve,60));other.remove();
   return{clicks,changes,asyncClicks};
  });
  assert.deepEqual(control,{clicks:3,changes:[],asyncClicks:2},'buttons must not blink disabled and async repeat is guarded');

  await page.evaluate(async()=>{
   const {addAsset,write}=await import('./core/storage.js');
   const canvas=document.createElement('canvas');
   canvas.width=160;canvas.height=90;canvas.getContext('2d').fillStyle='#52787d';
   canvas.getContext('2d').fillRect(0,0,160,90);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
   await addAsset(new File([blob],'my-image.png',{type:'image/png'}));
   await write('inputs',{id:'audio-fixture',kind:'audio',name:'music.mp3',type:'audio/mpeg',
     blob:new Blob([new Uint8Array([73,68,51,4,0,0,0,0,0,0])],{type:'audio/mpeg'}),createdAt:new Date().toISOString()});
  });
  await page.goto(origin+'/#library');
  const cards=page.locator('.library-card');await cards.first().waitFor();
  assert.equal(await cards.count(),2);
  assert.equal(await page.locator('.library-audio-cover > svg').count(),1,'MP3 tile must show musical note');
  const dimensions=await cards.evaluateAll(elements=>elements.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})));
  assert.ok(dimensions.every(e=>e.height>=290),'consistent tile height');
  assert.ok(Math.max(...dimensions.map(e=>e.height))-Math.min(...dimensions.map(e=>e.height))<2,'image and MP3 tile share same height');
  await page.getByRole('button',{name:'Thích my-image.png',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Bỏ thích my-image.png',exact:true}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Yêu thích',exact:true}).click();
  assert.equal(await cards.count(),1);
  await page.reload();
  await page.getByRole('button',{name:'Bỏ thích my-image.png',exact:true}).waitFor();
  await page.getByRole('button',{name:'Bỏ thích my-image.png',exact:true}).click();
  await page.getByText('Chưa có mục nào trong Yêu thích.').waitFor();
  await page.getByRole('button',{name:'Đầu vào',exact:true}).click();
  await page.locator('.library-card').filter({hasText:'my-image.png'}).getByRole('button',{name:'Đổi tên'}).click();
  await page.getByText('Ảnh đã đổi tên.png').waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS Settings tabs, copy action, no button blink, media tile dimensions, MP3 icon, persistent favorites and rename');
 } finally {
  await browser?.close();
  server.kill();await new Promise(resolve=>server.once('exit',resolve));
  await rm(runtime,{recursive:true,force:true});
 }
})().catch(error=>{console.error(error);process.exitCode=1});
