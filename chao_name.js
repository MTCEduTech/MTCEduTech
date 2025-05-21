(function () {
  const name = localStorage.getItem("userName");
  if (name) {
    const p = document.createElement("p");
    p.id = "greeting";
    p.textContent = '👋 Xin chào ' + name;
    p.style.cssText = `
      position: fixed;
      top: 0px;
      right: 20px;
      z-index: 9999;
      color: white;
      font-weight: bold;
      background-color: blue;
      border: 3px solid gold;
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 16px;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
      font-family: 'Times New Roman', serif;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 1s ease, transform 1s ease;
    `;
    document.body.appendChild(p);

    setTimeout(() => {
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
    }, 100);
  }
})();
