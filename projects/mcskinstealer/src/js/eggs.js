const technoAudio = new Audio('/projects/mcskinstealer/src/sound/techno.mp3');
const envixityAudio = new Audio('/projects/mcskinstealer/src/sound/creditstonintendo.mp3');

export function handleEasterEggs(input) {
  if (!input) return;
  const v = input.toLowerCase();
  if (v === "envixitybo2") {
    if (envixityAudio.paused) envixityAudio.play().catch(() => {});
  } else {
    envixityAudio.pause();
    envixityAudio.currentTime = 0;

    if (v === "technoblade") {
      if (technoAudio.paused) technoAudio.play().catch(() => {});
    } else {
      technoAudio.pause();
      technoAudio.currentTime = 0;
    }
  }
}
