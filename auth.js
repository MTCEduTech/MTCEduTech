(function () {
  const checkAuth = () => {
    const isAuth = localStorage.getItem("authenticated") === "true";
    const currentUser = localStorage.getItem("nickname");
    const relogged = localStorage.getItem("demo_relogin") === "true"; // cờ đã đăng nhập lại

    // ✅ Nếu chưa đăng nhập
    if (!isAuth) {
      alert("🔒 Vui lòng đăng nhập trước khi truy cập.");
      window.location.href = "index.html";
      return;
    }

    // ✅ Nếu đang dùng tài khoản demo
    if (currentUser === "demo") {
      const today = new Date();
      const expireDate = new Date("2025-08-31T23:59:59");

      // ⛔ Nếu demo đã hết hạn → chặn hẳn
      if (today > expireDate) {
        alert("⚠️ Tài khoản DEMO đã hết hạn. Vui lòng đăng nhập lại hoặc liên hệ admin.");
        localStorage.clear();
        window.location.href = "index.html";
        return;
      }

      // ⚠️ Nếu chưa từng đăng nhập lại → ép thoát ra ngay
      if (!relogged) {
        alert("⚠️ Tài khoản DEMO cần xác thực lại. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "index.html";
        return;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", checkAuth);
})();
