const list = [
    { name: "Hypixel", ip: "hypixel.net", platform: "Java", description: "Mini-games like Bed Wars & SkyBlock." },
    { name: "The Hive", ip: "geo.hivebedrock.network", platform: "Bedrock", description: "Mini-games like DeathRun & Hide and Seek." },
    { name: "SUNDAY GAMES", ip: "173.240.154.7", platform: "Bedrock and Java", description: "Chill survival & creative." },
    { name: "Survival 6", ip: "server.dogcraft.net", platform: "Bedrock and Java", description: "Casual survival, friendly community." },
    { name: "MineSuperior", ip: "play.minesuperior.com", platform: "Bedrock and Java", description: "Survival, SkyBlock & more!" },
];

function findServer(){document.getElementById("loadingSpinner").style.display="block",document.getElementById("errorMessage").textContent="";const e=list[Math.floor(Math.random()*list.length)];document.getElementById("serverDetails").innerHTML=`\n        <center><strong>${e.name}</strong></center>\n        <center><p>${e.description}</p></center>\n        <p>IP Address: ${e.ip}</p>\n        <p>Platform: ${e.platform}</p>\n        <iframe style="width:728px;height:90px;max-width:100%;border:none;display:block;margin:auto" \n                src="https://namemc.com/server/${e.ip}/embed"></iframe>\n    `,document.getElementById("loadingSpinner").style.display="none"}document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("findServerButton").onclick=findServer}));