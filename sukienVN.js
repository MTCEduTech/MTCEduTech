// sukienVN.js

let data = [];

// Load dữ liệu JSON dạng đối tượng từ file chuẩn hóa
fetch('sukienVN.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    applyFilter(); // Hiển thị mặc định
  });

function applyFilter() {
  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');
  const yearInput = document.getElementById('year');
  const keywordInput = document.getElementById('keyword');
  const displayDate = document.getElementById('displayDate');

  const today = new Date();
  const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';

  let currentDay = parseInt(dayInput.value);
  let currentMonth = parseInt(monthInput.value);
  const year = yearInput.value.trim();
  const hasKeyword = keyword.length > 0;

  let hasDayMonth = !isNaN(currentDay) && !isNaN(currentMonth);

  // Nếu không có ngày/tháng nào được nhập, gán ngày hiện tại
  if (!hasDayMonth) {
    currentDay = today.getDate();
    currentMonth = today.getMonth() + 1;
    hasDayMonth = true; // ✅ cập nhật lại trạng thái
    dayInput.value = currentDay;
    monthInput.value = currentMonth;
  }

  // Lọc dữ liệu
  const filtered = data.filter(item => {
    const matchDayMonth = hasDayMonth ? item.Ngày === currentDay && item.Tháng === currentMonth : true;
    const matchYear = !year || item.Năm == year;
    const matchKeyword =
      !hasKeyword ||
      (item["Sự kiện"] && item["Sự kiện"].toLowerCase().includes(keyword)) ||
      (item["Thông tin"] && item["Thông tin"].toLowerCase().includes(keyword));

    return matchDayMonth && matchYear && matchKeyword;
  });

  // Tiêu đề hiển thị – như đã sửa ở câu trước
  if (filtered.length > 0) {
    let msg = 'Những sự kiện lịch sử';
    if (!hasKeyword && !year && dayInput.value == today.getDate() && monthInput.value == (today.getMonth() + 1)) {
      msg += ` ngày ${currentDay} tháng ${currentMonth} (hiện tại)`;
    } else if (hasDayMonth && !hasKeyword) {
      msg += ` ngày ${currentDay} tháng ${currentMonth} (tìm kiếm)`;
    } else if (hasKeyword && !hasDayMonth && !year) {
      msg += ` theo từ khóa "${keyword}"`;
    } else {
      if (hasDayMonth) msg += ` ngày ${currentDay} tháng ${currentMonth}`;
      if (year) msg += ` năm ${year}`;
      if (hasKeyword) msg += ` với từ khóa "${keyword}"`;
    }

    displayDate.textContent = msg;
  } else {
    displayDate.textContent = `Không tìm thấy sự kiện phù hợp.`;
  }

  renderEvents(filtered);
}

  renderEvents(filtered);
}


function renderEvents(events) {
  const container = document.getElementById("events");
  container.innerHTML = "";

  const grouped = {};
  events.forEach(item => {
    if (!grouped[item.Năm]) grouped[item.Năm] = [];
    grouped[item.Năm].push(item);
  });

  Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
    const yDiv = document.createElement("div");
    yDiv.className = "event-year";
    yDiv.textContent = year;
    container.appendChild(yDiv);

    grouped[year].forEach(ev => {
      const eDiv = document.createElement("div");
      eDiv.className = "event-item";
      eDiv.textContent = ev["Sự kiện"];
      eDiv.onclick = () => {
  const dateStr = `${ev["Ngày"]}/${ev["Tháng"]}/${ev["Năm"]}`;
  showPopup(ev["Sự kiện"], (ev["Thông tin"] || '').replace(/\n/g, '<br>'), dateStr);
};

      container.appendChild(eDiv);
    });
  });
}

function showPopup(title, content, dateStr) {
  const popup = document.getElementById('popup');
  const popupContent = document.getElementById('popupContent');
  const popupDateBox = document.getElementById('popup-date-box');

  popupContent.innerHTML = `<strong>${title}</strong><br><br>${content}`;
  popupDateBox.textContent = dateStr || '';
  popup.classList.remove('hidden');
}


function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}

// Thêm CSS trực tiếp cho popup và tiêu đề
const style = document.createElement('style');
style.textContent = `
  h1 {
    color: blue;
    font-family: 'Times New Roman', Times, serif;
    text-align: center;
    font-weight: bold;
    font-size: 36px;
  }
  .popup-wrapper {
  position: relative;
  display: inline-block;
}

.popup-content {
  background: white;
  padding: 20px;
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* Nút "TẮT" bám góc phải ngoài popup-content */
.popup-close {
  position: absolute;
  top: -30px;
  right: 0px;
  background: crimson;
  color: white;
  border: none;
  padding: 6px 12px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  z-index: 1001;
}

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  .hidden { display: none; }
`;
document.head.appendChild(style);
