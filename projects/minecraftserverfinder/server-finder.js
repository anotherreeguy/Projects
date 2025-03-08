const servers = [
    { name: "Hypixel", platform: "Java", ip: "hypixel.net", description: "The Hypixel Network offers a ton of fun mini-games like Bed Wars, SkyBlock, and more! (Java only)" },
    { name: "The Hive", platform: "Bedrock", ip: "geo.hivebedrock.network", description: "The Hive server is great for mini-games like DeathRun, Hide and Seek, and more! (Bedrock only)" },
    { name: "SUNDAY GAMES", platform: "Bedrock and Java", ip: "173.240.154.7", description: "Chill survival and creative world. Fun for relaxed gaming." },
    { name: "Survival 6", platform: "Bedrock and Java", ip: "server.dogcraft.net", description: "Casual survival with a friendly community." },
    { name: "Play.MineHeroes", platform: "Bedrock and Java", ip: "play.mineheroes.org", description: "A well-rounded server with SkyBlock, Prison, and more!" },
    { name: "MineSuperior", platform: "Bedrock and Java", ip: "play.minesuperior.com", description: "Survival, SkyBlock, and more! Great for any playstyle." },
    { name: "Skyblock.net", platform: "Java", ip: "skyblock.net", description: "Famous SkyBlock server. Build your floating island and survive!" },
    { name: "Lifeboat", platform: "Bedrock", ip: "play.lbsg.net", description: "Survival, mini-games, and more. A solid community-based server." },
    { name: "PvPWars", platform: "Bedrock and Java", ip: "pvpwars.net", description: "A fun PvP-focused server with plenty of challenges." },
    { name: "PixelmonCraft", platform: "Java", ip: "play.pixelmoncraft.com", description: "Pokémon-themed Minecraft server. Train and battle Pokémon in a Minecraft world!" },
    { name: "Desteria", platform: "Java", ip: "play.desteria.com", description: "PvP, factions, and tons of combat-based fun!" },
    { name: "Factions Universe", platform: "Bedrock and Java", ip: "factionsuniverse.com", description: "Factions-based gameplay with custom plugins." },
    { name: "GamerValley", platform: "Bedrock and Java", ip: "gamervalley.net", description: "Survival with custom features and a great community." },
    { name: "CraftYourTown", platform: "Bedrock and Java", ip: "play.craftyourtown.com", description: "Survival with town-building and PvP." },
    { name: "TheArchon", platform: "Bedrock and Java", ip: "pvp.thearchon.net", description: "Factions and SkyBlock with intense PvP." },
    { name: "TitanMC", platform: "Bedrock and Java", ip: "play.titanmc.net", description: "Survival, factions, and RPG mechanics." },
    { name: "StratosCraft", platform: "Bedrock and Java", ip: "play.stratoscraft.com", description: "A community-driven survival world with many fun activities." },
    { name: "ZombieCraft", platform: "Bedrock and Java", ip: "zombiecraft.net", description: "Survive waves of zombies and upgrade your gear." },
    { name: "EpicPVP", platform: "Bedrock and Java", ip: "play.epicpvp.net", description: "Epic PvP battles with unique mechanics and power-ups." },
    { name: "SkyHighCraft", platform: "Bedrock and Java", ip: "skyhighcraft.com", description: "Survival and SkyBlock with a ton of customization options." },
    { name: "DragonMC", platform: "Bedrock and Java", ip: "play.dragonmc.net", description: "PvP, survival, and a dragon-themed world to explore." },
    { name: "FrostedMC", platform: "Bedrock and Java", ip: "play.frostedmc.net", description: "A creative and survival server combo. Build and survive!" },
    { name: "StratosCraft", platform: "Bedrock and Java", ip: "play.stratoscraft.net", description: "A community-driven survival world with plenty of features." }
];

// Track how long the user stays on the server page
let timeSpentOnPage = 0;
let interval;

// Function to track time spent on the server page
function startTrackingTime() {
    interval = setInterval(() => {
        timeSpentOnPage++;
    }, 1000); // Increment every second
}

// Stop tracking when the page is closed or user navigates away
window.onbeforeunload = function() {
    clearInterval(interval);  // Stop the tracking when the user leaves
};

// Function to track server interactions (using localStorage)
function trackServerInteraction(serverName) {
    // Retrieve interactions from localStorage (ensure parsing correctly)
    let interactions = JSON.parse(localStorage.getItem("serverInteractions") || "{}");
    interactions[serverName] = (interactions[serverName] || 0) + 1;
    localStorage.setItem("serverInteractions", JSON.stringify(interactions));  // Ensure it's stringified
}

// Function to find and display a random server based on user preference and past interactions
function findServer() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "block";  // Show loading spinner
    const errorMessage = document.getElementById("errorMessage");
    const serverDetails = document.getElementById("serverDetails");

    // Step 1: Get all servers matching user platform (including "Both" servers)
    let availableServers = servers.filter(server => {
        return server.platform === userPreference || server.platform === "Bedrock and Java";
    });

    // Step 2: If no matching server, display an error
    if (availableServers.length === 0) {
        errorMessage.textContent = "No servers available for your selected platform!";
        loadingSpinner.style.display = "none";
        return;
    }

    // Step 3: Consider past interactions (track more interacted servers)
    let interactions = JSON.parse(localStorage.getItem("serverInteractions") || "{}");
    
    // Add interaction scores to servers
    availableServers.forEach(server => {
        server.interactionScore = interactions[server.name] || 0;
    });

    // Step 4: Sort the servers based on interaction score (descending)
    availableServers.sort((a, b) => b.interactionScore - a.interactionScore);

    // Step 5: Pick a random server from the weighted list (prefer more interacted servers)
    let randomIndex = Math.floor(Math.random() * availableServers.length);
    let selectedServer = availableServers[randomIndex];

    // Track the interaction with this server
    trackServerInteraction(selectedServer.name);

    // Step 6: Fetch NameMC stats (simulated here)
    const serverStats = fetchServerStats(selectedServer.ip);  // Simulated fetch for NameMC stats

    // Step 7: Display the selected server's details
    serverDetails.innerHTML = `
        <center><strong>${selectedServer.name}</strong></center>
        <center><p>${selectedServer.description}</p></center>
        <p>IP Address: ${selectedServer.ip}</p>
        <p>Platform/s: ${selectedServer.platform}</p>
        <iframe style="width:728px;height:90px;max-width:100%;border:none;display:block;margin:auto" src="https://namemc.com/server/${selectedServer.ip}/embed" width="728" height="90"></iframe>
    `;

    errorMessage.textContent = "";
    loadingSpinner.style.display = "none";

    // Log time spent on the server page
    console.log(`You have been on the page for ${timeSpentOnPage} seconds while viewing ${selectedServer.name}.`);
}

// Function to simulate fetching server stats (this can be replaced with a real fetch call)
function fetchServerStats(ip) {
    // Simulating server stats fetch (you can replace this with real API calls)
    return {
        playersOnline: Math.floor(Math.random() * 1000),
        uptime: Math.floor(Math.random() * 100) + "%",
    };
}

// Call the tracking function when the page loads
startTrackingTime();
