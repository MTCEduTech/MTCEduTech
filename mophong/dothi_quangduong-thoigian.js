document.addEventListener('DOMContentLoaded', () => {
  const dataTable = document.getElementById('dataTable');
  const addRowBtn = document.getElementById('addRowBtn'); 
  const drawGraphBtn = document.getElementById('drawGraphBtn');
  const timeUnitSelect = document.getElementById('timeUnit');
  const distanceUnitSelect = document.getElementById('distanceUnit');
  const ctx = document.getElementById('myChart').getContext('2d');

  let myChartInstance = null;

  // Plugin vẽ nét đứt
  Chart.register({
    id: 'annotationLines',
    afterDatasetsDraw(chart) {
      const { ctx, data, scales: { x, y } } = chart;
      ctx.save();
          ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      data.datasets[0].data.forEach(point => {
        const xPos = x.getPixelForValue(point.x);
        const yPos = y.getPixelForValue(point.y);
        ctx.beginPath(); ctx.moveTo(xPos, yPos); ctx.lineTo(xPos, y.getPixelForValue(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xPos, yPos); ctx.lineTo(x.getPixelForValue(0), yPos); ctx.stroke();
      });

      ctx.restore();
    }
  });

  const addRow = (t = '', s = '') => {
    const row = dataTable.querySelector('tbody').insertRow();
    row.innerHTML = `
      <td><input type="number" class="time-input" value="${t}" step="0.1"></td>
      <td><input type="number" class="distance-input" value="${s}" step="1"></td>
      <td><button class="remove-row">🗑</button></td>
    `;
    row.querySelector('.remove-row').onclick = () => row.remove();
  };

  addRowBtn.addEventListener('click', () => addRow());

  dataTable.querySelectorAll('.remove-row').forEach(btn => {
    btn.onclick = () => btn.closest('tr').remove();
  });

  const getDataFromTable = () => {
    const timeFactor = parseFloat(timeUnitSelect.value);
    const distanceFactor = parseFloat(distanceUnitSelect.value);

    const timeInputs = document.querySelectorAll('.time-input');
    const distanceInputs = document.querySelectorAll('.distance-input');
    const data = [];

    for (let i = 0; i < timeInputs.length; i++) {
      const rawTime = parseFloat(timeInputs[i].value);
      const rawDist = parseFloat(distanceInputs[i].value);
      if (!isNaN(rawTime) && !isNaN(rawDist)) {
        data.push({
          rawX: rawTime,
          rawY: rawDist,
          x: rawTime * timeFactor,
          y: rawDist * distanceFactor
        });
      }
    }

    data.sort((a, b) => a.x - b.x);
    return data;
  };

  function getGCD(arr) {
  if (!arr.length) return 1; // ⚠ Tránh lỗi reduce trên mảng rỗng
  const gcdTwo = (a, b) => b ? gcdTwo(b, a % b) : a;
  return arr.reduce((a, b) => gcdTwo(a, b));
}


  const drawGraph = () => {
    const points = getDataFromTable();
    if (myChartInstance) myChartInstance.destroy();

    if (points.length === 0) {
      ctx.clearRect(0, 0, 800, 400);
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Không có dữ liệu để hiển thị biểu đồ.', 400, 200);
      return;
    }

    const unitTimeLabel = timeUnitSelect.selectedOptions[0].text;
    const unitDistanceLabel = distanceUnitSelect.selectedOptions[0].text;
    const timeFactor = parseFloat(timeUnitSelect.value);
    const distanceFactor = parseFloat(distanceUnitSelect.value);

    const rawXs = points.map(p => p.rawX);
    const rawYs = points.map(p => p.rawY);
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    const stepX = getGCD(points.map(p => Math.round(p.x * 100000))) / 100000;
    const stepY = getGCD(points.map(p => Math.round(p.y * 100000))) / 100000;

    myChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Quãng đường s',
          data: points.map(p => ({ x: p.x, y: p.y, rawX: p.rawX, rawY: p.rawY })),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          tension: 0,
          pointRadius: 6,
          pointBackgroundColor: '#28a745',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
  x: {
    type: 'linear',
    min: 0,
    max: maxX,
    title: {
      display: true,
      text: `Thời gian t (${unitTimeLabel})`,
      font: { size: 14 }
    },
     border:{ 
color: '#4B004B',
width: 2 // ✅ chỉ đổi màu trục chính
    },
    ticks: {
      stepSize: stepX || 1,
      autoSkip: false,
      callback: function (value) {
        return (value / timeFactor).toFixed(1);
      }
    }
  },
  y: {
    type: 'linear',
    min: 0,
    max: maxY,
    title: {
      display: true,
      text: `Quãng đường s (${unitDistanceLabel})`,
      font: { size: 14 }
    },
    border:{ 
color: '#4B004B',
width: 2 // ✅ chỉ đổi màu trục chính
    },
ticks: {
      stepSize: stepY || 1,
      callback: function (value) {
        return (value / distanceFactor).toFixed(1);
      }
    }
  }
        }, // ✅ dấu phẩy ở đây là quan trọng
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: ctx => `s: ${ctx.raw.rawY} ${unitDistanceLabel}`,
              title: ctx => `t: ${ctx.raw.rawX} ${unitTimeLabel}`
            }
          }
        }
      }
    });
  };

  drawGraphBtn.addEventListener('click', drawGraph);
  drawGraph();
});
