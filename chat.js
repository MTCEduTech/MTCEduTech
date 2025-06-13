function showComments() {
  const wrapper = document.getElementById("commento-wrapper");
  wrapper.style.display = "block";

  // Chỉ tải script nếu chưa có
  if (!window.commentoScriptLoaded) {
    const s = document.createElement("script");
    s.src = "https://cdn.commento.io/js/commento.js";
    s.defer = true;
    document.body.appendChild(s);
    window.commentoScriptLoaded = true;
  }
}
