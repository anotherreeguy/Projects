// List of random Minecraft servers (can be expanded)
const servers = [
        name: "Hypixel",
        ip: "mc.hypixel.net",
        description: "The Hypixel Network is a Minecraft server containing a variety of mini-games, including Bed Wars, SkyBlock, SMP, SkyWars, Murder Mystery, and more! We support versions 1.8 through the latest versions!",
        version: "1.18.2",
    },
    {
        name: "Loverfella",
        ip: "play.loverfella.com",
        description: "The server made by Zach Spangler",
        version: "Java",
    }
];

// Function to pick a random server and display its details
function findRandomServer() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    const serverDetails = document.getElementById("serverDetails");
    
    loadingSpinner.style.display = "block";  // Show loading spinner
    serverDetails.innerHTML = "";  // Clear previous server details
    
    // Simulate a loading delay (remove this when using a real API)
    setTimeout(() => {
        const randomServer = servers[Math.floor(Math.random() * servers.length)];
        
        serverDetails.innerHTML = `
            <h3>${randomServer.name}</h3>
            <p><strong>IP:</strong> ${randomServer.ip}</p>
            <p><strong>Description:</strong> ${randomServer.description}</p>
            <p><strong>Players:</strong> ${randomServer.players}</p>
            <p><strong>Version:</strong> ${randomServer.version}</p>
            <button onclick="window.location.href='${randomServer.ip}'">Join Server</button>
        `;
        loadingSpinner.style.display = "none";  // Hide loading spinner
    }, 1500);  // Simulate a 1.5 second delay for loading
}
