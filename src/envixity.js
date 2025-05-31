document.addEventListener("DOMContentLoaded", () => {
    let typedText = "";
    const triggerWord = "envixity";
    const imageSelector = 'img[src="src/Banner-1-thumbsmall.png"]';
    const targetImage = document.querySelector(imageSelector);
    let activated = false;

    document.addEventListener("keydown", (e) => {
        if (activated) return;

        typedText += e.key.toLowerCase();
        if (typedText.length > triggerWord.length) {
            typedText = typedText.slice(-triggerWord.length);
        }

        if (typedText === triggerWord) {
            if (targetImage) {
                targetImage.src = "src/Banner-1-thumbbig.png";
            }
            const replaceTextContent = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.replace(/ReeGuy/gi, "Envixity");
                } else {
                    node.childNodes.forEach(replaceTextContent);
                }
            };

            replaceTextContent(document.body);
            activated = true;
        }
    });
});
