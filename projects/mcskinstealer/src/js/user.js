let currentEdition = "mcpe";
let previousSkins = [];
let makethiswebsitebetter = false;

const soundsPath = '../mcskinstealer/src/sound/';
const sounds = {
  click: new Audio(`${soundsPath}se_ui_common_scroll_click.wav`),
  hover: new Audio(`${soundsPath}se_ui_common_select_showdetail.wav`),
  error: new Audio(`${soundsPath}se_ui_common_select_pagemove.wav`),
  success: new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
};

function playSound(sound) {
  if (!makethiswebsitebetter) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

const playSuccessSound = () => playSound(sounds.success);
const playClickSound = () => playSound(sounds.click);
const playHoverSound = () => playSound(sounds.hover);
const playErrorSound = () => playSound(sounds.error);


function getAverageColor(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  if (count === 0) return { r: 17, g: 17, b: 17 };
  return { r: Math.floor(r / count), g: Math.floor(g / count), b: Math.floor(b / count) };
}

function darkenColor({ r, g, b }, pct = 0.3) {
  return `rgb(${Math.floor(r * pct)}, ${Math.floor(g * pct)}, ${Math.floor(b * pct)})`;
}

function updateFavicon(textureId) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = `https://mc-heads.net/avatar/${textureId}`;
}

function applyBackgroundFromSkin(skinUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = skinUrl;
  img.onload = () => {
    const avgColor = getAverageColor(img);
    document.body.style.backgroundColor = darkenColor(avgColor, 0.3);
  };
  img.onerror = () => {
    document.body.style.backgroundColor = "#111";
  };
}

function renderPreviousSkins() {
  const container = document.getElementById("previousSkins");
  if (!container) return;
  container.innerHTML = "";
  previousSkins.forEach((skin, idx) => {
    const div = document.createElement("div");
    div.classList.add("previous-skin-item");
    const headUrl = `https://mc-heads.net/avatar/${skin.textureId}/35`;
    div.innerHTML = `<img src="${headUrl}" alt="Head of ${skin.mcid}" class="previous-skin-img cursor-pointer" data-index="${idx}" title="View ${skin.username} skin preview" />`;
    container.appendChild(div);
  });

  container.querySelectorAll('.previous-skin-img').forEach(img => {
    img.addEventListener('click', e => {
      const index = +e.target.dataset.index;
      if (!previousSkins[index]) return;
      const selectedSkin = previousSkins[index];
      const skinPreview = document.getElementById("skinPreview");
      const downloadBtn = document.getElementById("downloadBtn");
      skinPreview.src = selectedSkin.skinUrl;
      downloadBtn.dataset.textureId = selectedSkin.textureId;
      playClickSound();
    });
  });
}

async function fetchAndRenderUser() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  const edition = params.get("edition");
  if (edition && (edition === "java" || edition === "mcpe")) {
    currentEdition = edition;
  }
  if (!username) return;
  const skinPreview = document.getElementById('skinPreview');
  const userDetails = document.getElementById('userDetails');
  const downloadBtn = document.getElementById('downloadBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  loadingSpinner.style.display = "block";
  try {
    const apiUrl = `https://tolerant-destined-mosquito.ngrok-free.app///${encodeURIComponent(username)}?edition=${currentEdition}`;
    const response = await fetch(apiUrl, { headers: { 'ngrok-skip-browser-warning': 'true' } });
    if (!response.ok) throw new Error("Network response not OK");
    const data = await response.json();
    const { texture_id: textureId, uuid, xuid, username: uname, uid, description = "No bio given.", previous_skins = [], isSlim } = data;
    const mcid = uuid || xuid;
    if (!textureId || !mcid) throw new Error("Invalid or incomplete data received.");
    const skinUrl = `https://vzge.me/full/310/${textureId}.png?no=shadow${isSlim ? "&slim=true" : ""}`;
    updateFavicon(textureId);
    applyBackgroundFromSkin(skinUrl);
    const knownTextureIds = new Set(previousSkins.map(s => s.textureId));
    [textureId, ...previous_skins].forEach(id => {
      if (!knownTextureIds.has(id)) {
        previousSkins.push({
          textureId: id,
          skinUrl: `https://vzge.me/full/310/${id}.png?no=shadow`,
          username: uname,
          description,
          mcid
        });
        knownTextureIds.add(id);
      }
    });
    if (previousSkins.length > 20) previousSkins.splice(0, previousSkins.length - 20);
    renderPreviousSkins();

    skinPreview.style.opacity = 0;
    skinPreview.src = skinUrl;
    skinPreview.style.display = "block";
    skinPreview.onload = () => {
      skinPreview.style.transition = "opacity 0.5s ease";
      skinPreview.style.opacity = 1;
    };

    userDetails.innerHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
        <h2 style="margin: 0 0 0.4rem; font-size: 1.8rem; font-weight: 700; color:rgb(255, 255, 255);">${uname}</h2>
        <p style="margin: 0 0 0.5rem; font-size: 1rem; line-height: 0.5; color: #ccc;">${description}</p>
        <div style="font-size: 0.9rem">
          <strong style="color:rgb(214, 214, 214);">${currentEdition === 'java' ? 'UUID' : 'XUID'}:</strong> ${mcid}
          <strong style="color:rgb(214, 214, 214);">User ID:</strong> ${uid}
        </div>
      </div>
    `;

    downloadBtn.style.display = "inline-block";
    downloadBtn.dataset.textureId = textureId;

    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${uname}'s User on Minecraft Skin Finder\n${description}`;
    document.title = `${uname} | ReeGuy's Projects`;

    playSuccessSound();
    playSearchCompleteSound();
  } catch {
    userDetails.textContent = `User might not exist, or failed to load.`;
    playErrorSound();
  } finally {
    loadingSpinner.style.display = "none";
  }
}

function downloadSkin(textureId) {
  const downloadUrl = `https://mc-heads.net/download/${textureId}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${textureId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  playClickSound();
  const textureId = document.getElementById("downloadBtn").dataset.textureId;
  if (textureId) downloadSkin(textureId);
});

window.onload = fetchAndRenderUser;
