(function() {
  // Kiểm tra trạng thái đăng nhập
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const username = loggedInUser?.name;
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  // Tạo greeting box HTML (không có nút thoát)
  const greetingBox = document.createElement("div");
  greetingBox.id = "greeting-box";
  greetingBox.innerHTML = `
    <div style="display: flex; align-items: center; gap: 6px;">
      <span id="greeting" style="margin: 0;">👋 Xin chào ${username}</span>
    </div>
  `;

  // Gắn CSS cho greeting box
  Object.assign(greetingBox.style, {
    position: 'fixed',
    top: '0px',
    right: '0px',
    zIndex: '9999',
    backgroundColor: 'blue',
    border: '2px solid gold',
    borderRadius: '8px',
    padding: '4px 8px',
    fontFamily: "'Times New Roman', serif",
    boxShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'opacity 1s ease, transform 1s ease',
    display: 'inline-block',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '1.2'
  });

  // Thêm greeting box vào trang
  document.body.appendChild(greetingBox);

  // Hiển thị greeting box với hiệu ứng
  setTimeout(() => {
    greetingBox.style.opacity = '1';
    greetingBox.style.transform = 'translateY(0)';
  }, 100);
})();
