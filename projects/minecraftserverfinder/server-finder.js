const servers = [
    { name: "Hypixel", ip: "hypixel.net", platform: "Java", description: "Mini-games like Bed Wars & SkyBlock." },
    { name: "The Hive", ip: "geo.hivebedrock.network", platform: "Bedrock", description: "Mini-games like DeathRun & Hide and Seek." },
    { name: "SUNDAY GAMES", ip: "173.240.154.7", platform: "Bedrock and Java", description: "Chill survival & creative." },
    { name: "Survival 6", ip: "server.dogcraft.net", platform: "Bedrock and Java", description: "Casual survival, friendly community." },
    { name: "MineSuperior", ip: "play.minesuperior.com", platform: "Bedrock and Java", description: "Survival, SkyBlock & more!" },
];

let timeSpent = 0, interval;

function trackTime() {
    interval = setInterval(() => timeSpent++, 1000);
}

window.onbeforeunload = () => clearInterval(interval);

function trackInteraction(serverName) {
    let interactions = JSON.parse(localStorage.getItem("serverInteractions") || "{}");
    interactions[serverName] = (interactions[serverName] || 0) + 1;
    localStorage.setItem("serverInteractions", JSON.stringify(interactions));
}

function findServer() {
    const loading = document.getElementById("loadingSpinner");
    const errorMsg = document.getElementById("errorMessage");
    const details = document.getElementById("serverDetails");

    loading.style.display = "block";

    let available = servers.filter(s => s.platform.includes(userPreference) || s.platform === "Bedrock and Java");

    if (!available.length) {
        errorMsg.textContent = "No servers available!";
        loading.style.display = "none";
        return;
    }

    let interactions = JSON.parse(localStorage.getItem("serverInteractions") || "{}");
    available.forEach(s => s.interactionScore = interactions[s.name] || 0);
    available.sort((a, b) => b.interactionScore - a.interactionScore);

    let server = available[Math.floor(Math.random() * available.length)];
    trackInteraction(server.name);

    details.innerHTML = `
        <center><strong>${server.name}</strong></center>
        <center><p>${server.description}</p></center>
        <p>IP: ${server.ip}</p>
        <p>Platform: ${server.platform}</p>
        <iframe style="width:728px;height:90px;max-width:100%;border:none;display:block;margin:auto" 
                src="https://namemc.com/server/${server.ip}/embed"></iframe>
    `;

    loading.style.display = "none";
    console.log(`Time spent: ${timeSpent} sec on ${server.name}.`);
}

trackTime();
