(function () {
  const checkAuth = () => {
    const isAuth = localStorage.getItem("authenticated") === "true";
    const currentUser = localStorage.getItem("nickname");
    const relogged = localStorage.getItem("demo_relogin") === "true";

    // ❌ Nếu chưa đăng nhập
    if (!isAuth) {
      alert("🔒 Vui lòng đăng nhập trước khi truy cập.");
      window.location.href = "index.html";
      return;
    }

    // ⏳ Nếu là demo
    if (currentUser === "demo") {
      const today = new Date();
      const expireDate = new Date("2025-08-31T23:59:59");

      // ⛔ Nếu demo đã hết hạn
      if (today > expireDate) {
        alert("⚠️ Tài khoản DEMO đã hết hạn. Vui lòng đăng nhập lại hoặc liên hệ admin.");
        localStorage.clear(); // xóa toàn bộ
        window.location.href = "index.html";
        return;
      }

      // ⛔ Nếu chưa relogin → ép thoát
      if (!relogged) {
        alert("⚠️ Tài khoản DEMO cần xác thực lại. Vui lòng đăng nhập lại.");
        // ⚠️ Chỉ xóa các thông tin đăng nhập, KHÔNG xóa demo_relogin
        localStorage.removeItem("authenticated");
        localStorage.removeItem("nickname");
        localStorage.removeItem("username");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("name");
        // giữ nguyên demo_relogin
        window.location.href = "index.html";
        return;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", checkAuth);
})();
