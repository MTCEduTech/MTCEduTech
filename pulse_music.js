const audio = document.getElementById("audioPlayer");
const popup = document.getElementById("music-visualizer-popup");
const canvas = document.getElementById("visualizerCanvas");
const ctx = canvas.getContext("2d");
const homeButton = document.querySelector("button[onclick*='index.html']");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawBars() {
  requestAnimationFrame(drawBars);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    const hue = i * 10;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
  }
}

audio.addEventListener("play", () => {
  // Tính kích thước popup dựa theo nút "Về trang chủ"
  const rect = homeButton.getBoundingClientRect();
  const popupWidth = rect.width;
  const popupHeight = popupWidth * 0.5;

  popup.style.width = popupWidth + "px";
  popup.style.height = popupHeight + "px";

  canvas.width = popupWidth;
  canvas.height = popupHeight;

  popup.style.display = "flex";

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  drawBars();
});


audio.addEventListener("pause", () => {
  document.getElementById("music-visualizer-popup").style.display = "none";
});

audio.addEventListener("ended", () => {
  document.getElementById("music-visualizer-popup").style.display = "none";
});

