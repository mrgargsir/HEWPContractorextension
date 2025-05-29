chrome.runtime.onInstalled.addListener(() => {
  const bookmarksToAdd = [
    
    { title: "💡HEWP", url: "https://works.haryana.gov.in/HEWP_Login/login.aspx" },
    { title: "👤Login", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.getElementById('alogin')?.click();await wait(500);document.getElementById('contractorbtn')?.click();await wait(300);const captcha=document.getElementById('txtCaptcha');if(captcha){captcha.scrollIntoView({behavior:'smooth',block:'center'});captcha.focus();captcha.style.border='2px solid red';setTimeout(()=>captcha.style.border='',1500);}})();})();" },
    
    { title: "➕AddBill", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.getElementById('sidebarCollapse')?.click();await wait(300);document.querySelector('a.nav-link[href=\"#actmenucon\"]')?.click();await wait(300);const navLink=Array.from(document.querySelectorAll('a.nav-link')).find(a=>a.getAttribute('href')?.includes('Est_Add_Items_emb.aspx')&&a.textContent.trim().includes('Submit Bill to JE'));navLink?.click();})();})();" },
    { title: "🔍Tender", url: "javascript:(function(){const existingInput=document.querySelector('#independentTenderSearch input');if(existingInput){existingInput.scrollIntoView({behavior:'smooth',block:'center'});existingInput.focus();return;}const select=document.getElementById('ddltender');if(!select)return;select.scrollIntoView({behavior:'smooth',block:'center'});select.style.border='3px solid red';setTimeout(()=>select.style.border='',2000);const wrapper=document.createElement('div');wrapper.id='independentTenderSearch';Object.assign(wrapper.style,{position:'relative',marginBottom:'10px'});const input=document.createElement('input');input.type='text';input.placeholder='🔍 Search tenders...';Object.assign(input.style,{width:'100%',padding:'6px',boxSizing:'border-box'});const list=document.createElement('div');Object.assign(list.style,{border:'1px solid #ccc',maxHeight:'200px',overflowY:'auto',marginTop:'2px',background:'#fff',position:'absolute',width:'100%',zIndex:'9999'});wrapper.appendChild(input);wrapper.appendChild(list);select.parentNode.insertBefore(wrapper,select);const allOptions=[...select.options].filter(opt=>opt.value!=='Select One');function escapeRegex(text){return text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}function render(matches){list.innerHTML='';const searchText=input.value.trim().toLowerCase();matches.forEach(opt=>{const item=document.createElement('div');Object.assign(item.style,{padding:'5px 8px',cursor:'pointer',backgroundColor:'#fff9c4',color:'#000'});if(searchText.length>0){const regex=new RegExp(%60(${escapeRegex(searchText)})%60,'gi');item.innerHTML=opt.text.replace(regex,'<span style="color: red; font-weight: bold;">$1</span>');}else{item.textContent=opt.text;}item.addEventListener('mouseover',()=>{item.style.backgroundColor='#1565c0';item.style.color='#fff';});item.addEventListener('mouseout',()=>{item.style.backgroundColor='#fff9c4';item.style.color='#000';});item.addEventListener('mousedown',()=>{select.value=opt.value;const event=new Event('change',{bubbles:true,cancelable:true});select.dispatchEvent(event);if(typeof select.onchange==='function') select.onchange();else if(typeof __doPostBack==='function') __doPostBack('_ctl0$maincontentcm$ddltender','');list.innerHTML='';input.value='';});list.appendChild(item);});}input.addEventListener('input',()=>{const val=input.value.toLowerCase();const matches=allOptions.filter(opt=>opt.text.toLowerCase().includes(val));render(matches);});input.addEventListener('focus',()=>render(allOptions));input.addEventListener('blur',()=>setTimeout(()=>{list.innerHTML='';},200));setTimeout(()=>{input.focus();input.scrollIntoView({behavior:'smooth',block:'center'});},500);})();" },
    { title: "🎯Item", url: "javascript:(function(){const e=document.querySelector("#independentItemSearch input");if(e)return e.focus(),void e.scrollIntoView({behavior:"smooth",block:"center"});const t=document.querySelector("#ddlitemnumber");if(!t)return;t.scrollIntoView({behavior:"smooth",block:"center"}),t.style.border="3px solid red",setTimeout(()=>t.style.border="",2e3);const n=document.createElement("div");n.id="independentItemSearch",n.style.position="relative",n.style.marginBottom="10px";const o=document.createElement("input");o.type="text",o.placeholder="🔍 Search items...",o.style.width="100%",o.style.padding="6px",o.style.boxSizing="border-box";const l=document.createElement("div");l.style.border="1px solid #ccc",l.style.maxHeight="200px",l.style.overflowY="auto",l.style.marginTop="2px",l.style.background="#fff",l.style.position="absolute",l.style.width="100%",l.style.zIndex="9999",n.appendChild(o),n.appendChild(l),t.parentNode.insertBefore(n,t);const i=[...t.options].filter(e=>"Select One"!==e.value);function r(e){l.innerHTML="",e.forEach(e=>{const t=document.createElement("div");t.style.padding="5px 8px",t.style.cursor="pointer",t.style.background="#fff9c4",t.style.color="#000";const n=o.value.trim().toLowerCase();if(n.length>0){const r=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),c=new RegExp(%60(${r})%60,"gi");t.innerHTML=e.text.replace(c,'<span style="color: red; font-weight: bold;">$1</span>')}else t.textContent=e.text;t.onmouseover=()=>{t.style.background="#1565c0",t.style.color="#fff"},t.onmouseout=()=>{t.style.background="#fff9c4",t.style.color="#000"},t.onmousedown=function(){select.value=e.value,select.dispatchEvent(new Event("change")),l.innerHTML="",o.value=""},l.appendChild(t)})}o.addEventListener("input",function(){const e=this.value.toLowerCase(),t=i.filter(t=>t.text.toLowerCase().includes(e));r(t)}),o.addEventListener("focus",()=>r(i)),o.addEventListener("blur",()=>setTimeout(()=>l.innerHTML="",200)),setTimeout(()=>{o.focus(),o.scrollIntoView({behavior:"smooth",block:"center"})},500);})();" }, 

    { title: "🆕Entries", url: "javascript:(function(){ const r = document.getElementById('rblitemshsr_1'); if (r) { r.click(); r.scrollIntoView({behavior: 'smooth', block: 'start'}); }})();" },

    { title: "📁ChooseExcel", url: "javascript:(function(){const wait=ms=>new Promise(r=>setTimeout(r,ms));(async function(){document.querySelector('button[data-bs-target=\"#MyPopup\"]')?.click();await wait(200);document.getElementById('FileUploadexcel')?.click();})();})();" },
    { title: "🔼Upload", url: "javascript:(function(){document.getElementById(\"btn_excel\")?.click();})();" },
    { title: "✅CopyExcel Data", url: "javascript:(function(){ document.getElementById('btncopyexcel')?.click();})();" },
    { title: "✅DONE", url: "javascript:(function(){ const wait = ms => new Promise(r => setTimeout(r, ms)); (async function(){ const okBtn = document.querySelector('button.confirm'); if (okBtn && okBtn.textContent.trim().toLowerCase() === 'ok') okBtn.click(); await wait(500); document.querySelector('button[data-bs-dismiss=\"modal\"]')?.click(); await wait(500); const r = document.getElementById('rblitemshsr_1'); if (r) { r.click(); r.scrollIntoView({behavior: 'smooth', block: 'start'}); } })();})();" },
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
