document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("chat-toggle");
  const popup = document.getElementById("chat-popup");

  toggle.addEventListener("click", function () {
    popup.style.display = popup.style.display === "block" ? "none" : "block";
  });

  // Load Disqus only once
  let disqusLoaded = false;
  toggle.addEventListener("click", function () {
    if (!disqusLoaded) {
      const d = document, s = d.createElement('script');
      s.src = 'https://mtcedutech.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
      disqusLoaded = true;
    }
  });
});
