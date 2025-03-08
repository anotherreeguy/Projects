// Predefined server data (including support for both Java and Bedrock)
const servers = [
    { name: "Hypixel", platform: "Java", ip: "hypixel.net", description: "The Hypixel Network is a Minecraft server containing a variety of mini-games, including Bed Wars, SkyBlock, SMP, SkyWars, Murder Mystery, and more!" },
    { name: "The Hive", platform: "Bedrock", ip: "geo.hivebedrock.network", description: "The Hive Minecraft server" },
    { name: "SUNDAY GAMES", platform: "Java", ip: "173.240.154.7", description: "asdfkasndf" },
    { name: "Survival 6", platform: "Bedrock and Java", ip: "server.dogcraft.net", description: "asdfkasndf" }
];


function toggleEdition() {
    currentEdition = (currentEdition === "java") ? "bedrock" : "java";
    document.getElementById('editionToggle').textContent = `Currently: ${currentEdition === 'java' ? 'Java' : 'Bedrock'} Edition`;
}


// Function to get user preference for platform
function getUserPreference() {
    return document.getElementById("platformSelector").value;
}

// Function to track server interactions (using localStorage)
function trackServerInteraction(serverName) {
    let interactions = JSON.parse(localStorage.getItem("serverInteractions")) || {};
    interactions[serverName] = (interactions[serverName] || 0) + 1;
    localStorage.setItem("serverInteractions", JSON.stringify(interactions));
}

// Function to find and display a random server based on user preference and past interactions
function findServer() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "block";  // Show loading spinner
    const errorMessage = document.getElementById("errorMessage");
    const serverDetails = document.getElementById("serverDetails");

    // Get selected platform
    const userPreference = getUserPreference();

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
    let interactions = JSON.parse(localStorage.getItem("serverInteractions")) || {};
    
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
}

// Simulate fetching NameMC stats based on the server IP (In reality, you would fetch actual data)
function fetchServerStats(ip) {
    // This is just a mock function. Replace with an actual API call to NameMC for real data.
    return {
        uuid: "1234-5678-91011",
        description: "Player stats for the Minecraft server. More details can be fetched from NameMC."
    };
}
