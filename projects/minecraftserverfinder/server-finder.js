// List of Minecraft servers
const servers = [
    { name: "Hypixel", ip: "hypixel.net", platform: "Java", description: "Mini-games like Bed Wars & SkyBlock." },
    { name: "The Hive", ip: "geo.hivebedrock.network", platform: "Bedrock", description: "Mini-games like DeathRun & Hide and Seek." },
    { name: "SUNDAY GAMES", ip: "173.240.154.7", platform: "Bedrock and Java", description: "Chill survival & creative." },
    { name: "Survival 6", ip: "server.dogcraft.net", platform: "Bedrock and Java", description: "Casual survival, friendly community." },
    { name: "MineSuperior", ip: "play.minesuperior.com", platform: "Bedrock and Java", description: "Survival, SkyBlock & more!" },
];

// Function to find and display a random server
function findServer() {
    document.getElementById("loadingSpinner").style.display = "block";  // Show loading spinner
    document.getElementById("errorMessage").textContent = ""; // Clear error message

    // Randomly select a server
    const selectedServer = servers[Math.floor(Math.random() * servers.length)];

    // Display the selected server details
    document.getElementById("serverDetails").innerHTML = `
        <center><strong>${selectedServer.name}</strong></center>
        <center><p>${selectedServer.description}</p></center>
        <p>IP Address: ${selectedServer.ip}</p>
        <p>Platform: ${selectedServer.platform}</p>
        <iframe style="width:728px;height:90px;max-width:100%;border:none;display:block;margin:auto" 
                src="https://namemc.com/server/${selectedServer.ip}/embed"></iframe>
    `;

    document.getElementById("loadingSpinner").style.display = "none"; // Hide loading spinner
}

// Ensure the function runs when a button is clicked
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("findServerButton").onclick = findServer;
});
