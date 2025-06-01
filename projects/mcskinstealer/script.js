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

    const textureId = currentEdition === "java"
      ? data.texture_url.split("/").pop()
      : data.skinTextureId;

    const skinUrl = `https://textures.minecraft.net/texture/${textureId}`;
    preview.src = skinUrl;
    preview.style.display = "block";
    downloadBtn.style.display = "inline-block";

    info.innerHTML = `
      ID: ${data.id || data.xuid}<br>
      Texture ID: ${textureId}<br>
      Current user: ${username}
    `;

    const others = (data.users_with_this_skin || []).filter(name => name !== username);
    if (others.length > 0) {
      historyEl.innerHTML = "<p>Also used by:</p>";
      for (const other of others) {
        const thumb = document.createElement("img");
        thumb.src = `https://minotar.net/armor/body/${other}/64`;
        thumb.alt = other;
        thumb.className = "skin-thumb";
        thumb.title = other;
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
