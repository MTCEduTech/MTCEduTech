// greeting.js

(function() {
  // Kiểm tra trạng thái đăng nhập
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  // Tạo greeting box HTML
  const greetingBox = document.createElement("div");
  greetingBox.id = "greeting-box";
  greetingBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <p id="greeting" style="margin: 0;">👋 Xin chào ${username}</p>
      <button id="logout-button">🚪 Đăng xuất</button>
    </div>
  `;

  // Gắn CSS cho greeting box
  Object.assign(greetingBox.style, {
    position: 'fixed',
    top: '0px',
    right: '0px',
    zIndex: '9999',
    backgroundColor: 'blue',
    border: '3px solid gold',
    borderRadius: '12px',
    padding: '12px 16px',
    fontFamily: "'Times New Roman', serif",
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'opacity 1s ease, transform 1s ease',
    display: 'inline-block',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px'
  });

  // Thêm greeting box vào trang
  document.body.appendChild(greetingBox);

  // Thêm style cho nút đăng xuất
  const logoutButton = document.getElementById("logout-button");
  Object.assign(logoutButton.style, {
    padding: '6px 10px',
    background: '#00BFFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '12px'
  });

  // Hiển thị box với hiệu ứng
  setTimeout(() => {
    greetingBox.style.opacity = '1';
    greetingBox.style.transform = 'translateY(0)';
  }, 100);

  // Gắn sự kiện logout
  logoutButton.onclick = () => {
    localStorage.removeItem("username");
    window.location.href = "index.html";
  };
})();
