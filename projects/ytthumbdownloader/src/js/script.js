function handleKeyPress(e) {
    if (e.key === "Enter") {
        fetchThumbnail();
    }
}

function extractVideoId(input) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
    }
    const regex = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/(?:embed|v|shorts)\/)([a-zA-Z0-9_-]{11})/;
    const match = input.match(regex);
    return match ? match[1] : '';
}

function fetchThumbnail() {
    const rawInput = document.getElementById("videoId").value.trim();
    const videoId = extractVideoId(rawInput);
    if (videoId.length !== 11) {
        document.getElementById('errorMessage').textContent = "Check the video ID! (or my script doesn't work haha)";
        return;
    }
    const highRes = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const fallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    fetch(highRes, { method: "HEAD" })
        .then((response) => {
            document.getElementById("thumbnailPreview").src = response.ok ? highRes : fallback;
            document.getElementById("thumbnailPreview").style.display = "block";
            document.getElementById("downloadBtn").style.display = "inline-block";
        })
        .catch(() => {
            document.getElementById("thumbnailPreview").src = fallback;
            document.getElementById("thumbnailPreview").style.display = "block";
            document.getElementById("downloadBtn").style.display = "inline-block";
        });
    document.getElementById('errorMessage').textContent = "";
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam) {
        const inputField = document.getElementById("videoId");
        inputField.value = idParam;
        fetchThumbnail()
    }
};
