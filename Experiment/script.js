const video = document.getElementById("video");
const playPauseButton = document.getElementById("play-pause");
const volumeSlider = document.getElementById("volume-slider");
const muteButton = document.getElementById("mute");
const fullscreenButton = document.getElementById("fullscreen");
const progressBar = document.getElementById("progress-bar");

// Play/Pause toggle
playPauseButton.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playPauseButton.textContent = "Pause";
  } else {
    video.pause();
    playPauseButton.textContent = "Play";
  }
});

// Volume control
volumeSlider.addEventListener("input", () => {
  video.volume = volumeSlider.value;
});

// Mute/Unmute toggle
muteButton.addEventListener("click", () => {
  video.muted = !video.muted;
  muteButton.textContent = video.muted ? "Unmute" : "Mute";
});

// Fullscreen toggle
fullscreenButton.addEventListener("click", () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    // Firefox
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    // Chrome, Safari, and Opera
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    // IE/Edge
    video.msRequestFullscreen();
  }
});

// Update progress bar as video plays
video.addEventListener("timeupdate", () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressBar.value = progress;
});

// Seek video
progressBar.addEventListener("input", (e) => {
  const seekTime = (progressBar.value / 100) * video.duration;
  video.currentTime = seekTime;
});
