const soundsPath = '../sound/';

const sounds = {
  click: new Audio(`${soundsPath}se_ui_common_scroll_click.wav`),
  hover: new Audio(`${soundsPath}se_ui_common_select_showdetail.wav`),
  error: new Audio(`${soundsPath}se_ui_common_select_pagemove.wav`),
  completeSearchOptions: [
    new Audio(`${soundsPath}se_ui_common_goodbtn04.wav`),
    new Audio(`${soundsPath}se_ui_common_decide07.wav`)
  ]
};

function playClickSound() {
  sounds.click.currentTime = 0;
  sounds.click.play();
}

function playHoverSound() {
  sounds.hover.currentTime = 0;
  sounds.hover.play();
}

function playErrorSound() {
  sounds.error.currentTime = 0;
  sounds.error.play();
}

function playSearchCompleteSound() {
  const randomIndex = Math.floor(Math.random() * sounds.completeSearchOptions.length);
  const sound = sounds.completeSearchOptions[randomIndex];
  sound.currentTime = 0;
  sound.play();
}

export {
  playClickSound,
  playHoverSound,
  playErrorSound,
  playSearchCompleteSound
};
