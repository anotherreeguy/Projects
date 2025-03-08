const servers = [
    { name: "Hypixel", platform: "Java", ip: "hypixel.net", description: "The Hypixel Network offers a ton of fun mini-games like Bed Wars, SkyBlock, and more! Bedrock and Java" },
    { name: "The Hive", platform: "Bedrock", ip: "geo.hivebedrock.network", description: "The Hive server is great for mini-games like DeathRun, Hide and Seek, and more! Bedrock and Java" },
    { name: "SUNDAY GAMES", platform: "Java", ip: "173.240.154.7", description: "Chill survival and creative world. Fun for relaxed gaming." },
    { name: "Survival 6", platform: "Bedrock and Java", ip: "server.dogcraft.net", description: "Casual survival with a friendly community. Bedrock and Java" },
    { name: "Play.MineHeroes", platform: "Bedrock and Java", ip: "play.mineheroes.org", description: "A well-rounded server with SkyBlock, Prison, and more! Bedrock and Java" },
    { name: "VanillaMC", platform: "Java", ip: "vanillamc.net", description: "A classic, no-frills survival world. Just Minecraft, pure and simple." },
    { name: "Mineplex", platform: "Bedrock", ip: "us.mineplex.com", description: "Lots of mini-games and a solid community. Bedrock and Java" },
    { name: "MineSuperior", platform: "Bedrock and Java", ip: "play.minesuperior.com", description: "Survival, SkyBlock, and more! Great for any playstyle." },
    { name: "Skyblock.net", platform: "Java", ip: "skyblock.net", description: "Famous SkyBlock server. Build your floating island and survive!" },
    { name: "Lifeboat", platform: "Bedrock", ip: "play.lbsg.net", description: "Survival, mini-games, and more. A solid community-based server." },
    { name: "PvPWars", platform: "Bedrock and Java", ip: "pvpwars.net", description: "A fun PvP-focused server with plenty of challenges. Bedrock and Java" },
    { name: "PixelmonCraft", platform: "Java", ip: "play.pixelmoncraft.com", description: "Pokémon-themed Minecraft server. Train and battle Pokémon in a Minecraft world!" },
    { name: "Desteria", platform: "Java", ip: "play.desteria.com", description: "PvP, factions, and tons of combat-based fun!" },
    { name: "Factions Universe", platform: "Bedrock", ip: "factionsuniverse.com", description: "Factions-based gameplay with custom plugins. Bedrock and Java" },
    { name: "GamerValley", platform: "Java", ip: "gamervalley.net", description: "Survival with custom features and a great community." },
    { name: "CraftYourTown", platform: "Bedrock and Java", ip: "play.craftyourtown.com", description: "Survival with town-building and PvP. Bedrock and Java" },
    { name: "CubeCraft", platform: "Bedrock", ip: "play.cubecraft.net", description: "Mini-games, SkyWars, and more! Bedrock and Java" },
    { name: "StormCraft", platform: "Java", ip: "stormcraftmc.net", description: "A chill server with custom survival and mini-games." },
    { name: "CraftBukkit Server", platform: "Java", ip: "mc.craftbukkit.org", description: "Bukkit-based server with mods and plugins." },
    { name: "TheArchon", platform: "Bedrock and Java", ip: "pvp.thearchon.net", description: "Factions and SkyBlock with intense PvP. Bedrock and Java" },
    { name: "BreakoutMC", platform: "Java", ip: "play.breakoutmc.com", description: "Prison-based server with custom gameplay mechanics." },
    { name: "SpleefCraft", platform: "Bedrock", ip: "play.spleefcraft.net", description: "Spleef, Hunger Games, and other mini-games. Bedrock and Java" },
    { name: "Dungeons and Dragons", platform: "Java", ip: "dungeonscraft.net", description: "Minecraft meets D&D with roleplay and adventure. A unique twist!" },
    { name: "NetherCraft", platform: "Bedrock and Java", ip: "play.nethercraft.net", description: "Survival with a Nether twist. Bedrock and Java" },
    { name: "Crafting Dead", platform: "Java", ip: "mc.craftingdead.com", description: "A Minecraft Zombie apocalypse server. Will you survive?" },
    { name: "TitanMC", platform: "Bedrock and Java", ip: "play.titanmc.net", description: "Survival, factions, and RPG mechanics. Bedrock and Java" },
    { name: "BlockHunt", platform: "Java", ip: "blockhunt.com", description: "Hide and Seek with a twist! Be the block or seek the players!" },
    { name: "MCProHosting", platform: "Bedrock", ip: "play.mcprohosting.com", description: "Great hosting services and a fun community to match. Bedrock and Java" },
    { name: "HCFactions", platform: "Java", ip: "play.hcfactions.net", description: "Hardcore Factions with plenty of PvP and challenges." },
    { name: "SurvivalPlus", platform: "Bedrock and Java", ip: "play.survivalplus.net", description: "Survival, PvP, and mini-games. A complete Minecraft experience." },
    { name: "Kingdoms MC", platform: "Java", ip: "kingdomsmc.net", description: "Create your kingdom and rule the world. PvP and survival." },
    { name: "MiniCraft", platform: "Bedrock", ip: "play.minicraft.com", description: "A server for mini-games and a laid-back experience. Bedrock and Java" },
    { name: "SuperCraft Bros", platform: "Java", ip: "play.supercraftbros.com", description: "Team-based battles in unique arenas!" },
    { name: "MysticRealms", platform: "Bedrock", ip: "mysticrealms.net", description: "Survival with RPG elements and custom quests. Bedrock and Java" },
    { name: "PixelPunks", platform: "Java", ip: "pixelpunks.com", description: "A server for those who love the Pixelmon mod!" },
    { name: "FactionMaster", platform: "Bedrock", ip: "play.factionmaster.net", description: "Hardcore factions PvP with custom plugins. Bedrock and Java" },
    { name: "PrisonCraft", platform: "Java", ip: "prisoncraft.com", description: "Start from the bottom in this prison-themed server. Grind your way to freedom." },
    { name: "ZombieCraft", platform: "Bedrock and Java", ip: "zombiecraft.net", description: "Survive waves of zombies and upgrade your gear. Bedrock and Java" },
    { name: "MurderMystery", platform: "Java", ip: "murdermystery.com", description: "Can you solve the mystery before it's too late? A fun, casual mini-game." },
    { name: "BlazeMC", platform: "Bedrock", ip: "play.blazemc.net", description: "PvP, SkyBlock, and Factions. A great all-around server. Bedrock and Java" },
    { name: "PixelGame", platform: "Java", ip: "pixelgame.net", description: "Pixel art and mini-games mixed together. A vibrant community." },
    { name: "GalaxyCraft", platform: "Bedrock", ip: "play.galaxycraft.com", description: "Explore a galaxy of mini-games. Bedrock and Java" },
    { name: "KingdomCraft", platform: "Java", ip: "kingdomcraft.com", description: "Survival-based kingdoms with epic battles and alliances." },
    { name: "WarriorCraft", platform: "Bedrock", ip: "warriorcraft.net", description: "An RPG server with warrior classes and epic quests. Bedrock and Java" },
    { name: "SMPHaven", platform: "Java", ip: "smphaven.net", description: "A simple survival multiplayer server. Just the basics." },
    { name: "Frostcraft", platform: "Bedrock", ip: "play.frostcraft.net", description: "A creative and survival server combo. Build and survive! Bedrock and Java" },
    { name: "CraftWars", platform: "Java", ip: "play.craftwars.com", description: "Survive, build, and fight for your life in the wars." },
    { name: "SkyPvP", platform: "Bedrock and Java", ip: "skypvp.net", description: "PvP battles in the sky. A true test of survival. Bedrock and Java" },
    { name: "CityCraft", platform: "Java", ip: "citycraft.net", description: "Build your city, trade, and survive in this custom world." },
    { name: "DreamCraft", platform: "Bedrock", ip: "dreamcraft.net", description: "An RPG-style survival server with tons of features. Bedrock and Java" },
    { name: "UHC Craft", platform: "Java", ip: "play.uhc.com", description: "The ultimate hardcore UHC experience. Can you survive?" },
    { name: "EpicPVP", platform: "Bedrock", ip: "play.epicpvp.net", description: "Epic PvP battles with unique mechanics and power-ups. Bedrock and Java" },
    { name: "SkyHighCraft", platform: "Java", ip: "skyhighcraft.com", description: "Survival and SkyBlock with a ton of customization options." },
    { name: "RPGCraft", platform: "Bedrock", ip: "play.rpgcraft.net", description: "Live the life of a hero in this Minecraft RPG world. Bedrock and Java" },
    { name: "SurvivalCraft", platform: "Java", ip: "play.survivalcraft.net", description: "Survival-focused, with plenty of challenges to keep you entertained." },
    { name: "StratosCraft", platform: "Bedrock and Java", ip: "play.stratoscraft.com", description: "A community-driven survival world with many fun activities. Bedrock and Java" },
    { name: "MiniMC", platform: "Java", ip: "play.minimc.com", description: "Mini-games galore! A fun server for any mood." },
    { name: "VexCraft", platform: "Bedrock", ip: "vexcraft.net", description: "A small community with survival, mini-games, and more. Bedrock and Java" },
    { name: "FrostedMC", platform: "Java", ip: "frostedmc.net", description: "A Minecraft server with unique survival and PvP experiences." },
    { name: "DragonMC", platform: "Bedrock", ip: "play.dragonmc.net", description: "PvP, survival, and a dragon-themed world to explore. Bedrock and Java" },
    { name: "CreeperCraft", platform: "Java", ip: "play.creepercraft.com", description: "Fun PvP battles, survival, and mini-games." },
    { name: "IronPVP", platform: "Bedrock", ip: "play.ironpvp.net", description: "Classic PvP action with factions and survival. Bedrock and Java" }
];


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
}
