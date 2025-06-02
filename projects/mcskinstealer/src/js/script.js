
// Edition toggle button text update
function updateEditionButton() {
  const btn = document.getElementById('editionToggle');
  btn.textContent = `Current Edition: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
}
// Globals
let currentEdition = "java";
let previousSkins = [];
let modalOpen = false;

// Utility: average skin color & darken
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

function darkenColor({ r, g, b }, pct = 0.3) {
  return `rgb(${Math.floor(r * pct)}, ${Math.floor(g * pct)}, ${Math.floor(b * pct)})`;
}

function updateFavicon(skinUrl) {
  const faviconUrl = skinUrl.replace('/body/', '/avatar/');
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = faviconUrl;
}

function updateBackgroundToSkinColor(skinUrl) {
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

// Render previous skins with clickable heads
function renderPreviousSkins() {
  const container = document.getElementById("previousSkins");
  if (!container) return;

  container.innerHTML = "";
  previousSkins.forEach((skin, idx) => {
    const div = document.createElement("div");
    div.classList.add("previous-skin-item");
    const headUrl = skin.skinUrl.replace('/body/', '/avatar/') + '/50';
    div.innerHTML = `
      <img src="${headUrl}" alt="Head of ${skin.userId}" class="previous-skin-img cursor-pointer" data-index="${idx}" />
    `;
    container.appendChild(div);
  });

  // Add click event to heads
  container.querySelectorAll('.previous-skin-img').forEach(img => {
    img.addEventListener('click', e => {
      const index = e.target.dataset.index;
      openSkinUsersModal(previousSkins[index].textureId, previousSkins[index].username);
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
    const apiUrl = `http://147.185.221.29:2607/skin/${encodeURIComponent(textureId)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch users.');

    const data = await response.json();
    const users = currentEdition === "java" ? data.java_users : data.mcpe_users;

    if (!Array.isArray(users) || users.length === 0) {
      usersList.innerHTML = '<p>No users found for this skin.</p>';
      return;
    }

    usersList.innerHTML = '';
    users.forEach(userId => {
      const headUrl = `https://mc-heads.net/avatar/${userId}`;
      const userDiv = document.createElement('div');
      userDiv.style.width = '120px';
      userDiv.style.textAlign = 'center';
      userDiv.style.border = '1px solid #7c3aed';
      userDiv.style.padding = '0.5rem';
      userDiv.style.borderRadius = '0';
      userDiv.style.backgroundColor = '#2d026f';

      userDiv.innerHTML = `
        <img src="${headUrl}" alt="Head of ${userId}" style="width: 64px; height: 64px; margin-bottom: 0.25rem;" />
        <p style="font-weight: 600; margin: 0; word-break: break-word;">${userId}</p>
      `;

      usersList.appendChild(userDiv);
    });

  } catch (err) {
    usersList.innerHTML = `<p style="color: #ff5555;">Error loading users: ${err.message}</p>`;
  }
}



function toggleEdition() {
  currentEdition = currentEdition === "java" ? "mcpe" : "java";
  updateEditionButton();

  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");
  if (username) {
    fetchSkin(username);
  }
}


function handleKeyPress(e) {
  if (e.key === 'Enter') {
    fetchSkin();
  }
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

  const inputValue = usernameFromParam || usernameInput.value.trim();
  if (!inputValue) {
    errorMessage.textContent = "Please enter a valid username!";
    return;
  }

  // Update URL with username & edition
  const url = new URL(window.location);
  url.searchParams.set("username", inputValue);
  url.searchParams.set("edition", currentEdition);
  window.history.replaceState({}, '', url);

  // (rest of fetchSkin stays the same...)


  errorMessage.textContent = "";
  loadingSpinner.style.display = "block";

  try {
    const apiUrl = `http://147.185.221.29:2607/${encodeURIComponent(inputValue)}?edition=${currentEdition}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch skin data.");

    const data = await response.json();

    const textureId = data.texture_id;
    const userId = data.uuid || data.xuid;
    const username = data.username || inputValue;
    const description = data.description || "No bio given.";

    if (!textureId || !userId) throw new Error("Invalid or incomplete data received.");

    const skinUrl = `https://mc-heads.net/body/${textureId}`;

    updateFavicon(skinUrl);
    updateBackgroundToSkinColor(skinUrl);

    if (!previousSkins.length || previousSkins[previousSkins.length - 1].textureId !== textureId) {
      previousSkins.push({ textureId, skinUrl, username, description, userId });
      if (previousSkins.length > 5) previousSkins.shift();
      renderPreviousSkins();
    }

    skinPreview.src = skinUrl;
    skinPreview.style.display = "block";
    userDetails.innerHTML = `<h2>${username}</h2> <p>${description}</p> ${userId}`;
    downloadBtn.style.display = "inline-block";

    // Show main UI, hide initial search
    topbar.style.display = "flex";
    mainLayout.style.display = "flex";
    searchInitial.style.display = "none";

  } catch (err) {
    errorMessage.textContent = `Did you mean ${inputValue}?`;
  } finally {
    loadingSpinner.style.display = "none";
  }
}


// Init edition button on load
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
function downloadSkin() {
  const skinPreview = document.getElementById('skinPreview');
  if (!skinPreview || !skinPreview.src) return;

  const downloadUrl = skinPreview.src.replace('/body/', '/download/');
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'minecraft_skin.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
