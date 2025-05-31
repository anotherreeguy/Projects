document.addEventListener("DOMContentLoaded", () => {
    let typedText = "";
    const triggerWord = "envixity";
    let triggered = false;

    document.addEventListener("keydown", (e) => {
        if (triggered) return;
        typedText += e.key.toLowerCase();
        if (typedText.length > triggerWord.length) {
            typedText = typedText.slice(-triggerWord.length);
        }

        if (typedText === triggerWord) {
            if (targetImage) {
                targetImage.src = "src/banner-1-thumbbig.png";
            }
            const replaceTextNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.replace(/ReeGuy/gi, "Envixity");
                } else {
                    node.childNodes.forEach(replaceTextNodes);
                }
            };

            replaceTextNodes(document.body);
        }
    });
});
