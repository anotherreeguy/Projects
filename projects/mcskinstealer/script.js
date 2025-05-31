let currentEdition = "java";

function toggleEdition() {
    currentEdition = (currentEdition === "java") ? "bedrock" : "java";
    document.getElementById('editionToggle').textContent = `Currently: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        fetchSkin();
    }
}

async function fetchSkin() {
    const inputValue = document.getElementById("minecraftUsername").value.trim();
    if (!inputValue) {
        document.getElementById("errorMessage").textContent = "Please enter a valid username!";
        return;
    }

    document.getElementById("loadingSpinner").style.display = "block";

    try {
        let skinUrl = '';
        let userId = '';
        let description = '';

        if (currentEdition === "java") {
            const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${inputValue}`);
            const data = await response.json();

            if (data.error) {
                throw new Error("Java Edition user not found.");
            }

            userId = data.uuid;
            skinUrl = `https://mc-heads.net/body/${userId}`;
            description = descriptions?.[userId] || "No description available.";

        } else {
            const xuidResponse = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${inputValue}`);
            const xuidData = await xuidResponse.json();

            if (xuidData.error) {
                throw new Error("Bedrock Edition user not found.");
            }

            const skinResponse = await fetch(`https://api.geysermc.org/v2/skin/${xuidData.xuid}`);
            const skinData = await skinResponse.json();

            if (!skinData.texture_id) {
                throw new Error("No skin texture found for Bedrock user.");
            }

            skinUrl = `https://mc-heads.net/body/${skinData.texture_id}`;
            userId = xuidData.xuid;
            description = descriptions?.[userId] || "No description available.";
        }

        document.getElementById("skinPreview").src = skinUrl;
        document.getElementById("skinPreview").style.display = "block";
        document.getElementById("downloadBtn").style.display = "inline-block";
        document.getElementById("userDetails").innerHTML = `XUID/UUID: ${userId}<br>About Me: ${description}`;
        document.getElementById("errorMessage").textContent = "";

    } catch (error) {
        document.getElementById("errorMessage").textContent = "Could not find the skin.";
    } finally {
        document.getElementById("loadingSpinner").style.display = "none";
    }
}

function downloadSkin() {
    const skinUrl = document.getElementById("skinPreview").src;
    if (skinUrl && skinUrl.includes("/body/")) {
        const downloadUrl = skinUrl.replace("/body/", "/skin/");
        window.open(downloadUrl, "_blank");
    }
}
