// myVideo contins the video i am working with

const myVideo = document.querySelector("#my-video");
console.log(myVideo);

const playPauseButton = document.querySelector("#play-pause-button");
console.log(myVideo);

const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);

// this funstion will play and pause the video by clicking on it

// myVideo.addEventListener("click", toggleVideo);
playPauseButton.addEventListener("click", toggleVideo);

function toggleVideo() {
  if (myVideo.paused || myVideo.ended) {
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
    myVideo.play();
  } else {
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
    myVideo.pause();
  }
}

//this function will mute or unmute the video by clicking

const muteUnmuteButton = document.querySelector("#mute-unmute-button");
console.log(muteUnmuteButton);

muteUnmuteButton.addEventListener("click", toggleSound);

function toggleSound() {
  if (myVideo.muted) {
    muteUnmuteButton.style.backgroundColor = "blue";
    myVideo.muted = false;
  } else {
    muteUnmuteButton.style.backgroundColor = "red";
    myVideo.muted = true;
  }
}

//this fuction will show and update the progress bar as the user is watching to show how much of the video has been watched.

const progressBar = document.querySelector("#progress-bar-fill");
console.log(progressBar);

myVideo.addEventListener("timeupdate", updateProgressBar);

function updateProgressBar() {
  const progress = (myVideo.currentTime / myVideo.duration) * 100;
  console.log(progress);
  progressBar.style.width = progress + "%";
}

//this function will be used for making the video fullscreen when the user double clicks on the video.

myVideo.addEventListener("dblclick", goFullScreen);

const fullscreenButton = document.querySelector("#fullscreen-button");

fullscreenButton.addEventListener("click", goFullScreen);

function goFullScreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// this function will add time stamps for easy navigation when users want to find a point of the video

const step1Button = document.querySelector("#step-1-button");
console.log(step1Button);

step1Button.addEventListener("click", goToStep1);

function goToStep1() {
  myVideo.currentTime = 16.0;
}

const step2Button = document.querySelector("#step-2-button");
console.log(step2Button);

step2Button.addEventListener("click", goToStep2);

function goToStep2() {
  myVideo.currentTime = 25.0;
}
