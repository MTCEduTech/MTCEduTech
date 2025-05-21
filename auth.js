(function checkAuth() {
  if (localStorage.getItem("authenticated") !== "true") {
    alert("Vui lòng đăng nhập trước khi truy cập.");
    window.location.href = "index.html";
  }
})();
