// Nhúng Tawk.to
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/YOUR_ID/default'; // Thay YOUR_ID
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();

// Logic ẩn/hiện bằng nút ảnh
var chatVisible = false;
Tawk_API = Tawk_API || {};
Tawk_API.onLoad = function () {
  Tawk_API.hideWidget(); // Ẩn mặc định

  document.getElementById("chatToggleBtn").addEventListener("click", function () {
    if (chatVisible) {
      Tawk_API.minimize(); // Thu nhỏ
    } else {
      Tawk_API.showWidget(); // Hiện lại nếu bị ẩn
      Tawk_API.maximize();   // Mở to ra
    }
    chatVisible = !chatVisible;
  });
};
