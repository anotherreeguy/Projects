let currentEdition = "java";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("editionToggle").addEventListener("click", toggleEdition);
  document.getElementById("searchBtn").addEventListener("click", fetchSkin);
  document.getElementById("minecraftUsername").addEventListener("keypress", event => {
    if (event.key === "Enter") fetchSkin();
  });
  document.getElementById("downloadBtn").addEventListener("click", downloadSkin);
});

function toggleEdition() {
  currentEdition = currentEdition === "java" ? "bedrock" : "java";
  document.getElementById('editionToggle').textContent = `Currently: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
}

async function fetchSkin() {
  const username = document.getElementById("minecraftUsername").value.trim();
  const errorEl = document.getElementById("errorMessage");
  const preview = document.getElementById("skinPreview");
  const spinner = document.getElementById("loadingSpinner");
  const info = document.getElementById("userDetails");
  const historyEl = document.getElementById("skinHistory");
  const downloadBtn = document.getElementById("downloadBtn");

  errorEl.textContent = "";
  preview.style.display = "none";
  downloadBtn.style.display = "none";
  historyEl.innerHTML = "";
  spinner.style.display = "block";
  info.innerHTML = "";

  if (!username) {
    errorEl.textContent = "Please enter a valid username.";
    spinner.style.display = "none";
    return;
  }

  try {
    const editionParam = currentEdition === "java" ? "java" : "mcpe";
    const res = await fetch(`https://divine-mudfish-radically.ngrok-free.app/${username}?edition=${editionParam}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    const textureId = data.texture_id;
    const skinUrl = `https://textures.minecraft.net/texture/${textureId}`;

    preview.src = skinUrl;
    preview.style.display = "block";
    downloadBtn.style.display = "inline-block";

    info.innerHTML = `
      ID: ${data.id || data.xuid}<br>
      Texture ID: ${textureId}<br>
      Current user: ${username}
    `;

    const allUsers = data.users_with_this_skin || [];
    const previousUsers = allUsers.filter(name => name !== username);

    if (previousUsers.length > 0) {
      historyEl.innerHTML = "<p>Previously used by:</p>";
      for (const name of previousUsers) {
        const thumb = document.createElement("img");
        thumb.src = `https://minotar.net/armor/body/${name}/64`;
        thumb.alt = name;
        thumb.className = "skin-thumb";
        thumb.title = name;
        historyEl.appendChild(thumb);
      }
    }

  } catch (err) {
    errorEl.textContent = err.message || "Could not find the skin.";
  } finally {
    spinner.style.display = "none";
  }
}

function downloadSkin() {
  const skinUrl = document.getElementById("skinPreview").src;
  if (skinUrl.includes("textures.minecraft.net/texture/")) {
    const link = document.createElement('a');
    link.href = skinUrl;
    link.download = 'minecraft_skin.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
