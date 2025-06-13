function toggleComments() {
  const popup = document.getElementById("commento-popup");
  const isVisible = popup.style.display === "block";
  popup.style.display = isVisible ? "none" : "block";

  // Chỉ tải Commento script một lần
  if (!window.commentoScriptLoaded && !isVisible) {
    const s = document.createElement("script");
    s.src = "https://cdn.commento.io/js/commento.js";
    s.defer = true;
    document.body.appendChild(s);
    window.commentoScriptLoaded = true;
  }
}
