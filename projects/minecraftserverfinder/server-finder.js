const servers = [
    { name: "Hypixel", ip: "hypixel.net", platform: "Java", description: "Mini-games like Bed Wars & SkyBlock." },
    { name: "The Hive", ip: "geo.hivebedrock.network", platform: "Bedrock", description: "Mini-games like DeathRun & Hide and Seek." },
    { name: "SUNDAY GAMES", ip: "173.240.154.7", platform: "Bedrock and Java", description: "Chill survival & creative." },
    { name: "Survival 6", ip: "server.dogcraft.net", platform: "Bedrock and Java", description: "Casual survival, friendly community." },
    { name: "MineSuperior", ip: "play.minesuperior.com", platform: "Bedrock and Java", description: "Survival, SkyBlock & more!" },
];

function findServer() {
    const loading = document.getElementById("loadingSpinner");
    const errorMsg = document.getElementById("errorMessage");
    const details = document.getElementById("serverDetails");

    loading.style.display = "block";

    // Randomly select a server
    let server = servers[Math.floor(Math.random() * servers.length)];

    details.innerHTML = `
        <center><strong>${server.name}</strong></center>
        <center><p>${server.description}</p></center>
        <p>IP: ${server.ip}</p>
        <p>Platform: ${server.platform}</p>
        <iframe style="width:728px;height:90px;max-width:100%;border:none;display:block;margin:auto" 
                src="https://namemc.com/server/${server.ip}/embed"></iframe>
    `;

    loading.style.display = "none";
}

findServer();
