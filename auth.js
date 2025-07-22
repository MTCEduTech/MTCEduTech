(function () {
  const checkAuth = () => {
    const isAuth = localStorage.getItem("authenticated") === "true";
    const currentUser = localStorage.getItem("nickname");

    // 👉 Nếu đang đăng nhập bằng tài khoản demo → buộc đăng xuất
    if (isAuth && currentUser === "demo") {
      alert("⚠️ Phiên đăng nhập tài khoản DEMO đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.clear(); // xóa hết thông tin
      window.location.href = "index.html";
      return;
    }

    // Nếu chưa đăng nhập thì cũng chuyển về trang đăng nhập
    if (!isAuth) {
      alert("🔒 Vui lòng đăng nhập trước khi truy cập.");
      window.location.href = "index.html";
      document.write("<h2 style='text-align:center;margin-top:50px;'>⏳ Đang chuyển hướng...</h2>");
    }
  };

  document.addEventListener("DOMContentLoaded", checkAuth);
  window.onload = checkAuth;
})();
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
