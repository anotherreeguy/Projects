function handleKeyPress(e) {
    if (e.key === "Enter") {
        fetchThumbnail();
    }
}
function extractVideoId(u) {
    const r = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const m = u.match(r);
    return m ? m[1] : u;
}
function fetchThumbnail() {
    const i = document.getElementById("videoId").value.trim(),
        v = extractVideoId(i);
    if (v.length !== 11) {
        alert("Eaither the link doesn't lead to the video, or script isn't working.");
        return;
    }
    const h = `https://img.youtube.com/vi/${v}/maxresdefault.jpg`,
        f = `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
    fetch(h, { method: "HEAD" })
        .then((r) => {
            document.getElementById("thumbnailPreview").src = r.ok ? h : f;
            document.getElementById("thumbnailPreview").style.display = "block";
            document.getElementById("downloadBtn").style.display = "inline-block";
        })
        .catch(() => {
            document.getElementById("thumbnailPreview").src = f;
            document.getElementById("thumbnailPreview").style.display = "block";
            document.getElementById("downloadBtn").style.display = "inline-block";
        });
}
