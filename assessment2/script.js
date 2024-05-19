//getteing all of the elements from index.html and creating there "own code" for the javascript. Both getElementById and QuerySelector were used here. These were used
// to see if there would be a difference between the two as a sort of experiment. The console.log is to identify problems in the google chrome inspect tool
// I have chosen to keep some aspects out of the website to keep it seemleess with little but function aspects. for example i have chosen to use a volume slider rather than buttons
// because it is more functional or the user. I have chosen to incorporate an interactive progress bar rather than fast forward or backward buttons, or instead of clik step1, step2 etc.

const video = document.getElementById("video");
console.log(video);
const playPauseButton = document.getElementById("play-pause-button");
console.log(playPauseButton);
const playPauseImg = document.querySelector("#play-pause-img");
console.log(playPauseImg);
const volumeSlider = document.querySelector("#volume-slider");
console.log(volumeSlider);
const progressBar = document.querySelector(".progress-bar");
console.log(progressBar);
const progress = document.querySelector(".progress");
console.log(progress);
const muteUnmuteButton = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteButton);
const muteUnmuteImg = document.querySelector("#mute-unmute-img");
console.log(muteUnmuteImg);
const fullscreenButton = document.querySelector("#fullscreen-button");
console.log(fullscreenButton);
const currentTimeDisplay = document.getElementById("currentTimeDisplay");
console.log(currentTimeDisplay);

// adding event listeners to the certain elements. For example in the below event listener we ask to bring the play pause button from above and when we "click" this element
// on the active website it tells the theplaPauseButton to toggle video. This applies to all of the event listeners in this code whether that be a mousedown action or an input action.

playPauseButton.addEventListener("click", toggleVideo);
video.addEventListener("click", toggleVideo);

// the function below relates to the above event listener and takes the toggle video aspect from above to tell the computer what to do. in the below segment the function says:
// if the video has paused or the video has ended and the use clicks the button the video will play and display a certain image. We then say "else" meaning if the vido is anything
// else but paused or ended when the button is clicked pause the video. In this scenario the only other option available is if the video is playing

function toggleVideo() {
  if (video.paused || video.ended) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}

// the below function is to format the time in minutes and seconds so that the the seconds dont become confusing after 60s and with the html element this is made to llo like it is .../...
// similar to youtube or other interfaces.

video.addEventListener("timeupdate", function () {
  currentTimeDisplay.textContent = formatTime(video.currentTime);
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

//this function will mute or unmute the video by clicking

muteUnmuteButton.addEventListener("click", toggleSound);

function toggleSound() {
  if (video.muted) {
    video.muted = false;
    muteUnmuteImg.src =
      "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
  } else {
    video.muted = true;
    muteUnmuteImg.src = "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png";
  }
}

// this next section takes the volumeSlider from the top and says update the volume in response to the input

volumeSlider.addEventListener("input", updateVolume);

// in this case the input is being put through via a volume slider. The function says volume of the video is determined by the volume slider value chosen. Looking at the html on this we see a min of 0
// a max of one and the steps at which the volume can be adjusted which is .01 and allows for the slider affect rather that the jumpiness if it were to be .1 instead.

function updateVolume() {
  video.volume = volumeSlider.value;
}

//this function will be used for making the video fullscreen when the user double clicks on the video.

video.addEventListener("dblclick", goFullScreen);

fullscreenButton.addEventListener("click", goFullScreen);

function goFullScreen() {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// this is the interactive progress bar. This was inluenced via a variety of sources and then played with and debugged to create an interactive progress bar.
// There were many issues I faced with this progress bar wile making it. The main issue being that it would often restart the video when being interacted with. I believe this was due to the
// miss calculation of time relative to the mouse's position. Alternatively, i may have made a mistake regarding the event handling. But i think the main problem was to do with the a local
// problem as the code would often revert to working again with any input into the html or javascript.
// bellow we identify that isDragging is false to get rid of any uncertainty that dragging when the progress bar is not clicked does not affect it.

let isDragging = false;

// the below function is used to display the distance we are through the video by taking the current time and dividing it by the total video duration. With this data we then times it by 100 to get a fraction
// then to display this we use the progress.style.width

video.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progress.style.width = percent + "%";
}

// the next step is to make the progress bar interactive. to do this we first have to identify the user mouse movement through event listener. If the user is holds down the the left click button on the progress bar
// is dragging becomes true and the progress is set and when the mouse when the left click button is released or "mouseup" is dragging is then returned to false

progressBar.addEventListener("mousedown", function (e) {
  isDragging = true;
  setProgress(e);
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    setProgress(e);
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
});

// we can take the information ffrom above to see whether the mouse is up or not and apply it to the function. first of all the function takes "e" as the event object. this event object is then passed through
// the event listeners above. Once we identify that the mouse is dragging we then getBoundingClientRect which identifies were the progress bar element is in relation to the viewport.
// We then need to calculate the new time in relation to were the user has placed their cursor. To do this we create a const called newTime. Within this we find e.clientX and rect.left.
// These two both work on the x axis and gives the corrdinates of the cursor relative to the left edge of the progress bar, e.clientX being the position of the cursor and rect.left is the left hand side of the rectangle.
// Once we have this information we then divide it by the total progress bar or progressBar.offsetWidth. Once this is multiplied by the video duration this is the new time and the progress is updated

function setProgress(e) {
  if (isDragging) {
    const rect = progressBar.getBoundingClientRect();
    const newTime =
      ((e.clientX - rect.left) / progressBar.offsetWidth) * video.duration;
    video.currentTime = newTime;
    updateProgress();
  }
}
