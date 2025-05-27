chrome.runtime.onInstalled.addListener(() => {
  const bookmarksToAdd = [
    
    { title: "💡 HEWP", url: "https://works.haryana.gov.in/HEWP_Login/login.aspx" },
    { title: "👤 Login", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.getElementById('alogin')?.click();await wait(500);document.getElementById('contractorbtn')?.click();await wait(300);const captcha=document.getElementById('txtCaptcha');if(captcha){captcha.scrollIntoView({behavior:'smooth',block:'center'});captcha.focus();captcha.style.border='2px solid red';setTimeout(()=>captcha.style.border='',1500);}})();})();" },
    
    { title: "➕ Add Bill", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.getElementById('sidebarCollapse')?.click();await wait(300);document.querySelector('a.nav-link[href=\"#actmenucon\"]')?.click();await wait(300);const navLink=Array.from(document.querySelectorAll('a.nav-link')).find(a=>a.getAttribute('href')?.includes('Est_Add_Items_emb.aspx')&&a.textContent.trim().includes('Submit Bill to JE'));navLink?.click();})();})();" },
    { title: "🔍 Search Tender", url: "javascript:(function(){const existingInput=document.querySelector('#independentTenderSearch input');if(existingInput){existingInput.scrollIntoView({behavior:'smooth',block:'center'});existingInput.focus();return;}const select=document.getElementById('ddltender');if(!select)return;select.scrollIntoView({behavior:'smooth',block:'center'});select.style.border='3px solid red';setTimeout(()=>select.style.border='',2000);const wrapper=document.createElement('div');wrapper.id='independentTenderSearch';wrapper.style.position='relative';wrapper.style.marginBottom='10px';const input=document.createElement('input');input.type='text';input.placeholder='🔍 Search tenders...';input.style.width='100%';input.style.padding='6px';input.style.boxSizing='border-box';const list=document.createElement('div');list.style.border='1px solid #ccc';list.style.maxHeight='200px';list.style.overflowY='auto';list.style.marginTop='2px';list.style.background='#fff';list.style.position='absolute';list.style.width='100%';list.style.zIndex='9999';wrapper.appendChild(input);wrapper.appendChild(list);select.parentNode.insertBefore(wrapper,select);const allOptions=[...select.options].filter(opt=>opt.value!=='Select One');function render(matches){list.innerHTML='';matches.forEach(opt=>{const item=document.createElement('div');item.textContent=opt.text;item.style.padding='5px 8px';item.style.cursor='pointer';item.onmouseover=()=>item.style.background='#eee';item.onmouseout=()=>item.style.background='';item.onmousedown=function(){select.value=opt.value;select.dispatchEvent(new Event('change'));list.innerHTML='';input.value='';};list.appendChild(item);});}input.addEventListener('input',function(){const search=this.value.toLowerCase();const matches=allOptions.filter(opt=>opt.text.toLowerCase().includes(search));render(matches);});input.addEventListener('focus',()=>render(allOptions));input.addEventListener('blur',()=>setTimeout(()=>list.innerHTML='',200));setTimeout(()=>{input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});},500);})();" },
    { title: "🎯 Select Item", url: "javascript:(function(){const existingInput=document.querySelector('#independentItemSearch input');if(existingInput){existingInput.focus();existingInput.scrollIntoView({behavior:'smooth',block:'center'});return;}const select=document.querySelector('#ddlitemnumber');if(!select)return;select.scrollIntoView({behavior:'smooth',block:'center'});select.style.border='3px solid red';setTimeout(()=>select.style.border='',2000);const wrapper=document.createElement('div');wrapper.id='independentItemSearch';wrapper.style.position='relative';wrapper.style.marginBottom='10px';const input=document.createElement('input');input.type='text';input.placeholder='🔍 Search items...';input.style.width='100%';input.style.padding='6px';input.style.boxSizing='border-box';const list=document.createElement('div');list.style.border='1px solid #ccc';list.style.maxHeight='200px';list.style.overflowY='auto';list.style.marginTop='2px';list.style.background='#fff';list.style.position='absolute';list.style.width='100%';list.style.zIndex='9999';wrapper.appendChild(input);wrapper.appendChild(list);select.parentNode.insertBefore(wrapper,select);const allOptions=[...select.options].filter(opt=>opt.value!=='Select One');function render(matches){list.innerHTML='';matches.forEach(opt=>{const item=document.createElement('div');item.textContent=opt.text;item.style.padding='5px 8px';item.style.cursor='pointer';item.onmouseover=()=>item.style.background='#eee';item.onmouseout=()=>item.style.background='';item.onmousedown=function(){select.value=opt.value;select.dispatchEvent(new Event('change'));list.innerHTML='';input.value='';};list.appendChild(item);});}input.addEventListener('input',function(){const search=this.value.toLowerCase();const matches=allOptions.filter(opt=>opt.text.toLowerCase().includes(search));render(matches);});input.addEventListener('focus',()=>render(allOptions));input.addEventListener('blur',()=>setTimeout(()=>list.innerHTML='',200));setTimeout(()=>{input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});},500);})();" }, 

    { title: "🆕 View Entries", url: "javascript:(function(){ const r = document.getElementById('rblitemshsr_1'); if (r) { r.click(); r.scrollIntoView({behavior: 'smooth', block: 'start'}); }})();" },

    { title: "📁 Choose Excel", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.querySelector('button[data-bs-target=\"#MyPopup\"]')?.click();await wait(200);document.getElementById('FileUploadexcel')?.click();})();})();" },
    { title: "🔼 Upload", url: "javascript:(function(){document.getElementById(\"btn_excel\")?.click();})();" },
    { title: "✅ Copy Excel Data", url: "javascript:(function(){ document.getElementById('btncopyexcel')?.click();})();" },
    { title: "✅ DONE", url: "javascript:(function(){ const wait = ms => new Promise(r => setTimeout(r, ms)); (async function(){ const okBtn = document.querySelector('button.confirm'); if (okBtn && okBtn.textContent.trim().toLowerCase() === 'ok') okBtn.click(); await wait(500); document.querySelector('button[data-bs-dismiss=\"modal\"]')?.click(); await wait(500); const r = document.getElementById('rblitemshsr_1'); if (r) { r.click(); r.scrollIntoView({behavior: 'smooth', block: 'start'}); } })();})();" },
    { title: "📤Anex", url: "javascript:(function(){var fileInput=document.getElementById('FileUpload3');if(fileInput){fileInput.click();}else{alert('File input not found.');}})();" },
    { title: "🚀Manual add", url: "javascript:(function(){var btn=document.getElementById('btn_add_Description');if(btn){btn.click();}else{alert('Button not found.');}})();" },
    { title: "⚖️MaxQTY", url: "javascript:(()=>{const v=document.getElementById('lbltobeexecuted'),u=document.getElementById('lbltobeexecutedunit');if(!v||!u)return alert('Contact @mrgargsir.');const dn=parseFloat(v.textContent);if(isNaN(dn))return alert('Value is not a number.');const unit=u.textContent.trim(),al=(dn*0.25).toFixed(2),total=(dn*1.25).toFixed(2),msg=`⚖️ DNIT QTY       = ${dn} ${unit}\n➕ ALLOWANCE 25%  = ${al} ${unit}\n✅ TOTAL          = ${total} ${unit}`;try{alert(msg)}catch{if(Notification.permission==='granted')new Notification(msg);else if(Notification.permission!=='denied')Notification.requestPermission().then(p=>p==='granted'?new Notification(msg):alert(msg));else alert(msg)}})();" },
    { title: "MRGARGSIR", url: "https://github.com/mrgargsir" },
    
  ];

  
 
 chrome.bookmarks.getChildren("1", (existingBookmarks) => {
    const titlesToRemove = bookmarksToAdd.map(b => b.title);

    // Remove existing bookmarks with same titles
    existingBookmarks.forEach(b => {
      if (titlesToRemove.includes(b.title)) {
        chrome.bookmarks.remove(b.id);
      }
    });

    // Add new bookmarks
    bookmarksToAdd.forEach(bookmark => {
      chrome.bookmarks.create({
        parentId: "1",
        title: bookmark.title,
        url: bookmark.url
      });
    });
  });
});
