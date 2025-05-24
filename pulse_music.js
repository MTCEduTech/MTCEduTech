const audioEl = document.getElementById("audioPlayer");
const popup = document.getElementById("music-visualizer-popup");
const visualizerCanvas = document.getElementById("visualizerCanvas"); // Đổi tên tránh trùng
const ctx = visualizerCanvas.getContext("2d");
const homeButton = document.getElementById("homeButton"); // An toàn cho cả hai trang

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audioEl);

source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const peakValues = new Array(bufferLength).fill(0);
const peakDropSpeed = 1;

function drawBars() {
  requestAnimationFrame(drawBars);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

  const barWidth = visualizerCanvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i];
    const barHeight = value / 2;
    const x = i * barWidth;
    const y = visualizerCanvas.height - barHeight;

    const hue = i * 10;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, y, barWidth - 1, barHeight);

    if (barHeight > peakValues[i]) {
      peakValues[i] = barHeight;
    } else {
      peakValues[i] -= peakDropSpeed;
      if (peakValues[i] < 0) peakValues[i] = 0;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, visualizerCanvas.height - peakValues[i] - 2, barWidth - 1, 2);
  }
}

audioEl.addEventListener("play", () => {
  const rect = homeButton.getBoundingClientRect();
  const popupWidth = rect.width;
  const popupHeight = popupWidth * 0.5;

  popup.style.width = popupWidth + "px";
  popup.style.height = popupHeight + "px";

  visualizerCanvas.width = popupWidth;
  visualizerCanvas.height = popupHeight;

  popup.style.display = "flex";

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  drawBars();
});

["pause", "ended"].forEach(event =>
  audioEl.addEventListener(event, () => {
    popup.style.display = "none";
  })
);
