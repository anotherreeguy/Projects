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
  sound.play().catch(err => {
    console.warn('Sound playback failed:', err);
  });
}

function playSuccessSound() {
  playSound(sounds.success);
}

function playClickSound() {
  playSound(sounds.click);
}

function playHoverSound() {
  playSound(sounds.hover);
}

function playErrorSound() {
  playSound(sounds.error);
}

function playSearchCompleteSound() {
  const sound = sounds.completeSearchOptions[Math.floor(Math.random() * sounds.completeSearchOptions.length)];
  playSound(sound);
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const editionParam = params.get("edition");
  const usernameParam = params.get("username");

  if (editionParam && (editionParam === "java" || editionParam === "mcpe")) {
    currentEdition = editionParam;
  }

  updateEditionButton();

  if (usernameParam) {
    document.getElementById("usernameInput").value = usernameParam;
    fetchSkin(usernameParam);
  }
};

function updateEditionButton() {
  const btn = document.getElementById('editionToggle');
  btn.textContent = `Edition: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
}

function isDevMode() {
  return document.cookie.split('; ').some(cookie => cookie.startsWith('dev='));
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
    if (data[i+3] > 128) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
      count++;
    }
  }
  if (count === 0) return { r: 17, g: 17, b: 17 };
  return { r: Math.floor(r/count), g: Math.floor(g/count), b: Math.floor(b/count) };
}

function updateBackgroundFromImage(img) {
  const avgColor = getAverageColor(img);
  document.body.style.background = `linear-gradient(to top, rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0.2), rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, 0)), rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`;
}

document.body.addEventListener('click', () => {
  makethiswebsitebetter = false;
}, { once: true });

const hoverSound = new Audio('src/sound/se_ui_common_select_showdetail.wav');

document.querySelectorAll('button, .hover-sound').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (!makethiswebsitebetter) return;
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {});
  });
});

function darkenColor({ r, g, b }, pct = 0.3) {
  return `rgb(${Math.floor(r * pct)}, ${Math.floor(g * pct)}, ${Math.floor(b * pct)})`;
}

function updateFavicon(skinUrl) {
  const faviconUrl = `https://mc-haeds.net/download/${textureId}`;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
}

function thisvariablenamecouldbebetter(skinUrl) {
  const img = new Image();
  img.crossOrigin = "weeguy";
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
    const headUrl = `https://mc-heads.net/${textureId}` + '/50';
    div.innerHTML = `
      <img src="${headUrl}" alt="Head of ${skin.userId}" class="previous-skin-img cursor-pointer" data-index="${idx}" />
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.previous-skin-img').forEach(img => {
    img.addEventListener('click', e => {
      const index = e.target.dataset.index;
      openSkinUsersModal(previousSkins[index].textureId, previousSkins[index].username);
      playClickSound();
    });
  });
}

async function openSkinUsersModal(textureId, skinName) {
  if (modalOpen) return;
  modalOpen = true;

  let modal = document.getElementById('skinUsersModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'skinUsersModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    modal.style.color = 'white';
    modal.style.padding = '2rem';
    modal.style.overflowY = 'auto';

    modal.innerHTML = `
      <button id="closeSkinUsersModal" style="
        position: absolute; top: 1rem; right: 1rem; background: #7c3aed; border: none; color: white; padding: 0.5rem 1rem; cursor: pointer;
        font-weight: 600; border-radius: 0;
      ">Close</button>
      <h2 style="margin-bottom: 1rem;">People that have used this skin: <span id="modalSkinName"></span></h2>
      <div id="skinUsersList" style="display: flex; flex-wrap: wrap; gap: 1rem; max-width: 800px; justify-content: center;"></div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeSkinUsersModal').addEventListener('click', () => {
      modal.style.display = 'none';
      modalOpen = false;
    });
  }

  modal.style.display = 'flex';
  document.getElementById('modalSkinName').textContent = skinName;
  const usersList = document.getElementById('skinUsersList');
  usersList.innerHTML = '<p>Loading users...</p>';

  try {
    const apiUrl = `https://tolerant-destined-mosquito.ngrok-free.app/skin/${encodeURIComponent(textureId)}`;
    const response = await fetch(apiUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    const data = await response.json();
    const users = currentEdition === "java" ? data.java_users : data.mcpe_users;

    if (!Array.isArray(users) || users.length === 0) {
      usersList.innerHTML = '<h4>No one else has used this skin, or used a similar skin.</h4>';
      return;
    }

    usersList.innerHTML = '';
    users.forEach(userId => {
      const headUrl = `https://mc-heads.net/avatar/${userId}/50`;
      const userDiv = document.createElement('div');
      userDiv.classList.add("user-item");
      userDiv.innerHTML = `<img src="${headUrl}" class="user-head" alt="${userId}" />`;
      usersList.appendChild(userDiv);
    });
  } catch (error) {
    console.error('Failed to fetch skin users:', error);
    usersList.innerHTML = '<h4>Error occurred while fetching skin users. Please try again later.</h4>';
  }
}

function fetchSkin(username) {
  // Fetch skin data logic goes here
  console.log('Fetching skin for:', username);
}
