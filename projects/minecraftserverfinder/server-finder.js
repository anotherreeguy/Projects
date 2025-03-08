const servers = [
    { name: "Hypixel", ip: "hypixel.net", platform: "Java", description: "Mini-games like Bed Wars & SkyBlock." },
    { name: "The Hive", ip: "geo.hivebedrock.network", platform: "Bedrock", description: "Mini-games like DeathRun & Hide and Seek." },
    { name: "SUNDAY GAMES", ip: "173.240.154.7", platform: "Bedrock and Java", description: "Chill survival & creative." },
    { name: "Survival 6", ip: "server.dogcraft.net", platform: "Bedrock and Java", description: "Casual survival, friendly community." },
    { name: "MineSuperior", ip: "play.minesuperior.com", platform: "Bedrock and Java", description: "Survival, SkyBlock & more!" },
];

let copiedServerIP = null; // Temporary storage for copied server IP

// Function to check if a user has copied a server IP
async function monitorClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const copiedServer = servers.find(server => server.ip === text.trim());
        if (copiedServer) copiedServerIP = copiedServer.ip; // Store the copied server IP
    } catch (err) {
        console.warn("Clipboard access denied or unavailable.");
    }
}

// Function to recommend a server
function findServer() {
    const loading = document.getElementById("loadingSpinner");
    const errorMsg = document.getElementById("errorMessage");
    const details = document.getElementById("serverDetails");

    loading.style.display = "block";

    let availableServers = servers;

    // If a server IP was copied, prioritize recommending servers with the same platform
    if (copiedServerIP) {
        const copiedServer = servers.find(server => server.ip === copiedServerIP);
        if (copiedServer) {
            availableServers = servers.filter(server => server.platform === copiedServer.platform);
        }
    }

    // Randomly select a server from the available list
    let server = availableServers[Math.floor(Math.random() * availableServers.length)];

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

// Start monitoring clipboard every 3 seconds (lightweight)
setInterval(monitorClipboard, 3000);

// Ensure the function runs when a button is clicked
document.getElementById("findServerButton").onclick = findServer;
