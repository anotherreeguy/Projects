let currentEdition = "mcpe";
let modalOpen = false;
let makethiswebsitebetter = false;

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

function toggleSound(enable) {
  makethiswebsitebetter = enable;
  if (enable) {
    document.body.addEventListener('click', () => {
      Object.values(sounds).forEach(sound => {
        if (Array.isArray(sound)) sound.forEach(s => s.play().catch(() => {}));
        else sound.play().catch(() => {});
      });
    }, { once: true });
  }
}

function playSound(sound) {
  if (!makethiswebsitebetter) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

const playSuccessSound = () => playSound(sounds.success);
const playClickSound = () => playSound(sounds.click);
const playHoverSound = () => playSound(sounds.hover);
const playErrorSound = () => playSound(sounds.error);
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

async function fetchSkin(usernameFromParam = null) {
  const usernameInput = document.getElementById('usernameInput');
  const errorMessage = document.getElementById('errorMessage');
  const inputValue = usernameFromParam || usernameInput.value.trim();
  if (!inputValue) {
    errorMessage.textContent = "Please enter a valid username!";
    playErrorSound();
    return;
  }
  usernameInput.disabled = true;
  errorMessage.textContent = "";
  try {
    const url = new URL(window.location);
    url.searchParams.set("username", inputValue);
    url.searchParams.set("edition", currentEdition);
    window.history.replaceState({}, '', url);
    window.location.href = `/User/?username=${encodeURIComponent(inputValue)}&edition=${currentEdition}`;
  } catch {
    errorMessage.textContent = `User might not exist, or failed to load.`;
    playErrorSound();
  } finally {
    usernameInput.disabled = false;
  }
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  playClickSound();
  const textureId = document.getElementById("downloadBtn").dataset.textureId;
  if (textureId) downloadSkin(textureId);
});

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
  if (e.key === 'Enter') fetchSkin();
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage.textContent) errorMessage.textContent = "";
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
