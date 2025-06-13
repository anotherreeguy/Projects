document.addEventListener("DOMContentLoaded", () => {
    let typedText = "";
    const triggerWord = "en";
    let triggered = false;
    document.addEventListener("keydown", (e) => {
        if (triggered) return;
        typedText += e.key.toLowerCase();
        if (typedText.length > triggerWord.length) {
            typedText = typedText.slice(-triggerWord.length);
        }
        if (typedText === triggerWord) {
            triggered = true;
            const targetImage = document.querySelector(".button-grid a:first-child img");
            if (targetImage) {
                targetImage.src = "src/Banner-1-thumbbig.png";
            }
            const replaceTextNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.replace(/ReeGuy/gi, "Envixity");
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    for (let child of node.childNodes) {
                        replaceTextNodes(child);
                    }
                }
            };
            replaceTextNodes(document.body);
        }
    });
});
