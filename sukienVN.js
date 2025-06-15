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
  const year = yearInput.value.trim();

  let currentDay = parseInt(dayInput.value);
  let currentMonth = parseInt(monthInput.value);
  let hasDayMonth = !isNaN(currentDay) && !isNaN(currentMonth);
  const hasKeyword = keyword.length > 0;
  const hasYear = year.length > 0;

  // Nếu không nhập gì cả → dùng ngày hiện tại
  if (!hasDayMonth && !hasKeyword && !hasYear) {
    currentDay = today.getDate();
    currentMonth = today.getMonth() + 1;
    dayInput.value = currentDay;
    monthInput.value = currentMonth;
    hasDayMonth = true;
  }

  // Nếu chỉ tìm từ khóa hoặc năm, thì xóa giá trị ngày/tháng khỏi ô input
  if ((hasKeyword || hasYear) && !hasDayMonth) {
    dayInput.value = '';
    monthInput.value = '';
  }

  // Lọc dữ liệu
  const filtered = data.filter(item => {
    const matchDayMonth = hasDayMonth ? item.Ngày === currentDay && item.Tháng === currentMonth : true;
    const matchYear = hasYear ? item.Năm == year : true;
    const matchKeyword = hasKeyword
      ? (item["Sự kiện"]?.toLowerCase().includes(keyword) || item["Thông tin"]?.toLowerCase().includes(keyword))
      : true;

    return matchDayMonth && matchYear && matchKeyword;
  });

  // Ghi nội dung tiêu đề hiển thị
  if (filtered.length > 0) {
    let msg = "Những sự kiện lịch sử";

    const isToday =
      currentDay === today.getDate() &&
      currentMonth === today.getMonth() + 1 &&
      !hasYear && !hasKeyword;

    if (isToday) {
      msg += ` ngày ${currentDay} tháng ${currentMonth} (Ngày này năm xưa)`;
    } else if (hasDayMonth && !hasKeyword && !hasYear) {
      msg += ` ngày ${currentDay} tháng ${currentMonth} (mà bạn tìm kiếm)`;
    } else if (hasKeyword && !hasDayMonth && !hasYear) {
      msg += ` theo từ khóa "${keyword}"`;
    } else {
      if (hasDayMonth) msg += ` ngày ${currentDay} tháng ${currentMonth}`;
      if (hasYear) msg += ` năm ${year}`;
      if (hasKeyword) msg += ` với từ khóa "${keyword}"`;
    }

    displayDate.textContent = msg;
  } else {
    displayDate.textContent = "Không tìm thấy sự kiện phù hợp.";
  }

  renderEvents(filtered);
}
document.addEventListener('DOMContentLoaded', () => {
  const keywordInput = document.getElementById('keyword');
  const dayInput = document.getElementById('day');
  const monthInput = document.getElementById('month');

  if (keywordInput) {
    keywordInput.addEventListener('input', () => {
      // Khi người dùng bắt đầu nhập từ khóa, xóa ngày & tháng
      if (keywordInput.value.trim().length > 0) {
        dayInput.value = '';
        monthInput.value = '';
      }
    });
  }
});


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
