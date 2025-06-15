let currentEdition="mcpe",previousSkins=[],modalOpen=false,makethiswebsitebetter=false;
import{handleeggs}from'./eggs.js';
handleeggs();
const soundsPath='../mcskinstealer/src/sound/',
sounds={
click:new Audio(`${soundsPath}se_ui_common_scroll_click.wav`),
hover:new Audio(`${soundsPath}se_ui_common_select_showdetail.wav`),
error:new Audio(`${soundsPath}se_ui_common_select_pagemove.wav`),
success:new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
completeSearchOptions:[
new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
new Audio(`${soundsPath}se_ui_common_decide07.wav`)
]};
const playSound=s=>{if(!makethiswebsitebetter)return;s.currentTime=0;s.play().catch(()=>{});};
const playSuccessSound=()=>playSound(sounds.success),
playClickSound=()=>playSound(sounds.click),
playHoverSound=()=>playSound(sounds.hover),
playErrorSound=()=>playSound(sounds.error),
playSearchCompleteSound=()=>playSound(sounds.completeSearchOptions[Math.floor(Math.random()*sounds.completeSearchOptions.length)]);

function toggleSound(enable){
makethiswebsitebetter=enable;
if(enable)document.body.addEventListener('click',()=>{Object.values(sounds).forEach(s=>Array.isArray(s)?s.forEach(a=>a.play().catch(()=>{})):s.play().catch(()=>{}));},{once:true});
}

const updateEditionButton=()=>{
const btn=document.getElementById('editionToggle');
btn.textContent=`Edition: ${currentEdition==='java'?'Java':'Bedrock'}`;
btn.title=`Click to switch edition (current: ${currentEdition==='java'?'Java':'Bedrock'})`;
};
const getAverageColor=img=>{
const c=document.createElement('canvas'),ctx=c.getContext('2d');
c.width=img.naturalWidth;c.height=img.naturalHeight;
ctx.drawImage(img,0,0);
const d=ctx.getImageData(0,0,c.width,c.height).data;
let r=0,g=0,b=0,cnt=0;
for(let i=0;i<d.length;i+=4)if(d[i+3]>128)(r+=d[i],g+=d[i+1],b+=d[i+2],cnt++);
return cnt?{r:r/cnt|0,g:g/cnt|0,b:b/cnt|0}:{r:17,g:17,b:17};
};
const darkenColor=({r,g,b},p=0.3)=>`rgb(${(r*p)|0}, ${(g*p)|0}, ${(b*p)|0})`;
const updateFavicon=id=>{
let l=document.querySelector("link[rel~='icon']")||document.createElement('link');
l.rel='icon';l.href=`https://mc-heads.net/avatar/${id}`;
document.head.appendChild(l);
};
const updateBackground=url=>{
let img=new Image();
img.crossOrigin="anonymous";img.src=url;
img.onload=()=>document.body.style.backgroundColor=darkenColor(getAverageColor(img),0.3);
img.onerror=()=>document.body.style.backgroundColor="#111";
};
const renderPreviousSkins=()=>{
const c=document.getElementById("previousSkins");
if(!c)return;
c.innerHTML=previousSkins.map((s,i)=>
`<div class="previous-skin-item"><img src="https://mc-heads.net/avatar/${s.textureId}/40" alt="Head of ${s.userId}" class="previous-skin-img cursor-pointer" data-index="${i}" title="View ${s.username} skin preview"/></div>`
).join('');
c.querySelectorAll('.previous-skin-img').forEach(img=>{
img.onclick=e=>{
const s=previousSkins[e.target.dataset.index];
if(!s)return;
const skinPreview=document.getElementById("skinPreview");
skinPreview.src=s.skinUrl;
document.getElementById("downloadBtn").dataset.textureId=s.textureId;
playClickSound();
};
});
};
async function fetchSkin(inputParam=null){
const usernameInput=document.getElementById('usernameInput'),
errorMessage=document.getElementById('errorMessage'),
skinPreview=document.getElementById('skinPreview'),
userDetails=document.getElementById('userDetails'),
downloadBtn=document.getElementById('downloadBtn'),
loadingSpinner=document.getElementById('loadingSpinner'),
topbar=document.getElementById('topbar'),
mainLayout=document.getElementById('mainLayout'),
searchInitial=document.getElementById('searchInitial'),
editionToggle=document.getElementById('editionToggle'),
inputValue=(inputParam||usernameInput.value).trim();
if(!inputValue){
errorMessage.textContent="Please enter a valid username, UUID, XUID, or texture ID!";
playErrorSound();
return;
}
const uuidRegex=/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i,
xuidRegex=/^\d{16,20}$/,
isTextureId=/^[a-f0-9]{32}$/i.test(inputValue),
isUuid=uuidRegex.test(inputValue),
isXuid=xuidRegex.test(inputValue);
let fetchUrl;
if(isTextureId)fetchUrl=`https://tolerant-destined-mosquito.ngrok-free.app/texture/${inputValue}?edition=${currentEdition}`;
else if(isUuid)fetchUrl=`https://tolerant-destined-mosquito.ngrok-free.app/uuid/${inputValue}?edition=${currentEdition}`;
else if(isXuid)fetchUrl=`https://tolerant-destined-mosquito.ngrok-free.app/xuid/${inputValue}?edition=${currentEdition}`;
else fetchUrl=`https://tolerant-destined-mosquito.ngrok-free.app/${encodeURIComponent(inputValue)}?edition=${currentEdition}`;
[usernameInput,editionToggle,downloadBtn].forEach(el=>el.disabled=true);
if(document.getElementById('soundToggle'))document.getElementById('soundToggle').disabled=true;
errorMessage.textContent="";
loadingSpinner.style.display="block";
try{
const url=new URL(window.location);
url.searchParams.set("username",inputValue);
url.searchParams.set("edition",currentEdition);
window.history.replaceState({},'',url);
const res=await fetch(fetchUrl,{headers:{'ngrok-skip-browser-warning':'true'}});
if(!res.ok)throw new Error();
const data=await res.json();
const{texture_id:textureId,uuid,xuid,username,description="No bio given.",previous_skins=[],isSlim}=data;
const userId=uuid||xuid;
if(!textureId||!userId)throw new Error();
const skinUrl=`https://vzge.me/full/310/${textureId}.png?no=shadow${isSlim?'&slim=true':''}`;
updateFavicon(textureId);
updateBackground(skinUrl);
[...new Set([textureId,...previous_skins])].forEach(id=>{
if(!previousSkins.some(s=>s.textureId===id))previousSkins.push({textureId:id,skinUrl:`https://vzge.me/full/310/${id}.png?no=shadow`,username,description,userId});
});
if(previousSkins.length>20)previousSkins.splice(0,previousSkins.length-20);
renderPreviousSkins();
skinPreview.style.opacity=0;
skinPreview.src=skinUrl;
skinPreview.style.display="block";
skinPreview.onload=()=>skinPreview.style.opacity=1;
userDetails.innerHTML=`<h2>${username}</h2><p>${description}</p>${userId}`;
downloadBtn.style.display="inline-block";
downloadBtn.dataset.textureId=textureId;
topbar.style.display=mainLayout.style.display="flex";
searchInitial.style.display="none";
let metaDesc=document.querySelector("meta[name='description']")||document.createElement("meta");
metaDesc.name="description";
metaDesc.content=`${username}'s profile on Minecraft Skin Finder\n${description}`;
document.head.appendChild(metaDesc);
document.title=`${username} | ReeGuy's Projects`;
localStorage.setItem('lastUsername',username);
playSuccessSound();
playSearchCompleteSound();
}catch{
errorMessage.textContent=`User or texture ID might not exist, or failed to load.`;
playErrorSound();
}finally{
loadingSpinner.style.display="none";
[usernameInput,editionToggle,downloadBtn].forEach(el=>el.disabled=false);
if(document.getElementById('soundToggle'))document.getElementById('soundToggle').disabled=false;
}
}
document.getElementById("downloadBtn").onclick=()=>{
playClickSound();
const id=document.getElementById("downloadBtn").dataset.textureId;
if(!id)return;
const a=document.createElement('a');
a.href=`https://mc-heads.net/download/${id}`;
a.download=`${id}.png`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
};
const editionToggleBtn=document.getElementById('editionToggle');
editionToggleBtn.onclick=()=>{
playClickSound();
currentEdition=currentEdition==='mcpe'?'java':'mcpe';
updateEditionButton();
const u=document.getElementById('usernameInput').value.trim();
if(u)fetchSkin(u);
};
editionToggleBtn.onmouseenter=playHoverSound;
editionToggleBtn.onfocus=playClickSound;
editionToggleBtn.onkeydown=e=>{
if(e.key==='Enter'||e.key===' '){e.preventDefault();editionToggleBtn.click();}
};

const usernameInput=document.getElementById('usernameInput');
const errorMessage=document.getElementById('errorMessage');
usernameInput.onkeydown=e=>{if(e.key==='Enter')fetchSkin();if(errorMessage.textContent)errorMessage.textContent="";};
usernameInput.onfocus=playClickSound;
usernameInput.onmouseenter=playHoverSound;

const soundToggle=document.getElementById('soundToggle');
if(soundToggle){
soundToggle.title="Toggle sounds on/off";
soundToggle.onclick=()=>{
toggleSound(!makethiswebsitebetter);
playClickSound();
};
soundToggle.onmouseenter=playHoverSound;
}

window.onload=()=>{
const params=new URLSearchParams(window.location.search),
ed=params.get("edition"),
un=params.get("username");
if(ed==="java"||ed==="mcpe")currentEdition=ed;
updateEditionButton();
if(un){usernameInput.value=un;fetchSkin(un);}
else{const last=localStorage.getItem('lastUsername');if(last)usernameInput.value=last;}
};
