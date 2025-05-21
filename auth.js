(function () {
  const checkAuth = () => {
    const isAuth = localStorage.getItem("authenticated") === "true";
    if (!isAuth) {
      alert("🔒 Vui lòng đăng nhập trước khi truy cập.");
      window.location.href = "index.html";
      document.write("<h2 style='text-align:center;margin-top:50px;'>⏳ Đang chuyển hướng...</h2>");
    }
  };

  // Kiểm tra ngay khi DOM được tải
  document.addEventListener("DOMContentLoaded", checkAuth);
  
  // Kiểm tra khi toàn bộ trang (bao gồm hình ảnh, CSS) tải xong
  window.onload = checkAuth;
})();
