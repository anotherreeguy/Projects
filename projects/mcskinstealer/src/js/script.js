let currentEdition = "mcpe";
let previousSkins = [];
let modalOpen = false;
let makethiswebsitebetter = false;
function toggleSound(enable) {
  makethiswebsitebetter = enable;
  if (enable) {
    document.body.addEventListener('click', () => {
      Object.values(sounds).forEach(sound => {
        if (Array.isArray(sound)) {
          sound.forEach(s => s.play().catch(() => {}));
        } else {
          sound.play().catch(() => {});
        }
      });
    }, { once: true });
  }
}
const soundsPath = '../mcskinstealer/src/sound/';
const sounds = {
  click: new Audio(`${soundsPath}se_ui_common_scroll_click.wav`),
  hover: new Audio(`${soundsPath}se_ui_common_select_showdetail.wav`),
  error: new Audio(`${soundsPath}se_ui_common_select_pagemove.wav`),
  success: new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
  completeSearchOptions: [
    new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
    new Audio(`${soundsPath}se_ui_common_decide07.wav`)
  ]
};

function playSound(sound) {
  if (!makethiswebsitebetter) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function playSuccessSound() { playSound(sounds.success); }
function playClickSound() { playSound(sounds.click); }
function playHoverSound() { playSound(sounds.hover); }
function playErrorSound() { playSound(sounds.error); }
function playSearchCompleteSound() {
  const sound = sounds.completeSearchOptions[Math.floor(Math.random() * sounds.completeSearchOptions.length)];
  playSound(sound);
}

function updateEditionButton() {
  const btn = document.getElementById('editionToggle');
  btn.textContent = `Edition: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
  btn.title = `Click to switch edition (current: ${currentEdition === 'java' ? 'Java' : 'Bedrock'})`;
}

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
  let link = document.querySelector("link[rel~='icon']") || document.createElement('link');
  link.rel = 'icon';
  link.href = `https://mc-heads.net/avatar/${textureId}`;
  document.head.appendChild(link);
}

function thisvariablenamecouldbebetter(skinUrl) {
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
    const headUrl = `https://mc-heads.net/avatar/${skin.textureId}/40`;
    div.innerHTML = `<img src="${headUrl}" alt="Head of ${skin.userId}" class="previous-skin-img cursor-pointer" data-index="${idx}" title="View ${skin.username} skin preview" />`;
    container.appendChild(div);
  });

  const skinPreview = document.getElementById("skinPreview");
  let originalSrc = skinPreview.src;
  container.querySelectorAll('.previous-skin-img').forEach(img => {
    img.addEventListener('click', e => {
      const index = e.target.dataset.index;
      if (!previousSkins[index]) return;
      const selectedSkin = previousSkins[index];
      skinPreview.src = selectedSkin.skinUrl;
      originalSrc = selectedSkin.skinUrl;
      playClickSound();
    });
  });
}

async function fetchSkin(usernameFromParam = null) {
  const usernameInput = document.getElementById('usernameInput');
  const errorMessage = document.getElementById('errorMessage');
  const skinPreview = document.getElementById('skinPreview');
  const userDetails = document.getElementById('userDetails');
  const downloadBtn = document.getElementById('downloadBtn');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const topbar = document.getElementById('topbar');
  const mainLayout = document.getElementById('mainLayout');
  const searchInitial = document.getElementById('searchInitial');
  const editionToggle = document.getElementById('editionToggle');
  const soundToggle = document.getElementById('soundToggle');
  const technoAudio = new Audio('/projects/mcskinstealer/src/sound/techno.mp3');
  const envixityAudio = new Audio('/projects/mcskinstealer/src/sound/creditstonintendo.mp3');
  technoAudio.volume = 0.8;
  envixityAudio.volume = 1;

  const inputValue = usernameFromParam || usernameInput.value.trim();

if (inputValue.toLowerCase() === "envixitybo2") {
  if (envixityAudio.paused) {
    envixityAudio.currentTime = 0;
    envixityAudio.play().catch(err => {
      console.warn("Autoplay blocked or failed:", err);
    });
  }
} else {
  if (!envixityAudio.paused) {
    envixityAudio.pause();
    envixityAudio.currentTime = 0;
  }

  if (inputValue.toLowerCase() === "technoblade") {
    if (technoAudio.paused) {
      technoAudio.currentTime = 0;
      technoAudio.play().catch(err => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
  } else {
    if (!technoAudio.paused) {
      technoAudio.pause();
      technoAudio.currentTime = 0;
    }
  }
}

  if (!inputValue) {
    errorMessage.textContent = "Please enter a valid username!";
    playErrorSound();
    return;
  }

  usernameInput.disabled = true;
  editionToggle.disabled = true;
  downloadBtn.disabled = true;
  if (soundToggle) soundToggle.disabled = true;
  errorMessage.textContent = "";
  loadingSpinner.style.display = "block";

  try {
    const url = new URL(window.location);
    url.searchParams.set("username", inputValue);
    url.searchParams.set("edition", currentEdition);
    window.history.replaceState({}, '', url);

    const aUrl = `https://tolerant-destined-mosquito.ngrok-free.app/${encodeURIComponent(inputValue)}?edition=${currentEdition}`;
    const response = await fetch(aUrl, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });

    if (!response.ok) throw new Error("Network response not OK");

    const data = await response.json();
    const { texture_id: textureId, uuid, xuid, username, description = "No bio given.", previous_skins = [] } = data;
    const userId = uuid || xuid;
    const skinUrl = `https://vzge.me/full/310/${textureId}.png?no=shadow`;

    if (!textureId || !userId) throw new Error("Invalid or incomplete data received.");

    updateFavicon(textureId);
    thisvariablenamecouldbebetter(skinUrl);

    const allSkins = Array.from(new Set([textureId, ...previous_skins]));
    allSkins.forEach(id => {
      if (!previousSkins.some(s => s.textureId === id)) {
        previousSkins.push({
          textureId: id,
          skinUrl: `https://vzge.me/full/310/${id}.png?no=shadow`,
          username,
          description,
          userId
        });
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
    userDetails.innerHTML = `<h2>${username}</h2><p>${description}</p>${userId}`;
    downloadBtn.style.display = "inline-block";
    downloadBtn.dataset.textureId = textureId;
    topbar.style.display = "flex";
    mainLayout.style.display = "flex";
    searchInitial.style.display = "none";

    let metaDesc = document.querySelector("meta[name='description']") || document.createElement("meta");
    metaDesc.name = "description";
    metaDesc.content = `${username}'s profile on Minecraft Skin Finder\n${description}`;
    document.head.appendChild(metaDesc);
    document.title = `${username} | ReeGuy's Projects`;
    localStorage.setItem('lastUsername', username);
    playSuccessSound();
    playSearchCompleteSound();
  } catch (err) {
    errorMessage.textContent = `User might not exist, or failed to load.`;
    playErrorSound();
  } finally {
    loadingSpinner.style.display = "none";
    usernameInput.disabled = false;
    editionToggle.disabled = false;
    downloadBtn.disabled = false;
    if (soundToggle) soundToggle.disabled = false;
  }
}
document.getElementById("downloadBtn").addEventListener("click", () => {
  playClickSound();
  const textureId = document.getElementById("downloadBtn").dataset.textureId;
  if (textureId) downloadSkin(textureId);
});

function downloadSkin(textureId) {
  const downloadUrl = `https://mc-heads.net/download/${textureId}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${textureId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const editionToggleBtn = document.getElementById('editionToggle');
editionToggleBtn.addEventListener('click', () => {
  playClickSound();
  currentEdition = currentEdition === 'mcpe' ? 'java' : 'mcpe';
  updateEditionButton();
  const username = document.getElementById('usernameInput').value.trim();
  if (username) fetchSkin(username);
});
editionToggleBtn.addEventListener('mouseenter', () => playHoverSound());
editionToggleBtn.addEventListener('focus', () => playClickSound());
editionToggleBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    editionToggleBtn.click();
  }
});
const usernameInput = document.getElementById('usernameInput');
usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    fetchSkin();
  }
  if (errorMessage.textContent) {
    errorMessage.textContent = "";
  }
});
usernameInput.addEventListener('focus', () => playClickSound());
usernameInput.addEventListener('mouseenter', () => playHoverSound());
const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
  soundToggle.title = "Toggle sounds on/off";
  soundToggle.addEventListener('click', () => {
    toggleSound(!makethiswebsitebetter);
    playClickSound();
    soundToggle.textContent = makethiswebsitebetter ? "🔊 Sound ON" : "🔇 Sound OFF";
  });
  soundToggle.addEventListener('mouseenter', () => playHoverSound());
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const editionParam = params.get("edition");
  const usernameParam = params.get("username");
  if (editionParam && (editionParam === "java" || editionParam === "mcpe")) {
    currentEdition = editionParam;
  }
  updateEditionButton();
  const lastUsername = localStorage.getItem('lastUsername');
  if (usernameParam) {
    usernameInput.value = usernameParam;
    fetchSkin(usernameParam);
  } else if (lastUsername) {
    usernameInput.value = lastUsername;
  }
};
