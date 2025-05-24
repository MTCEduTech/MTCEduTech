let menuVisible = false;

function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');

  if (menuVisible) {
    menu.style.left = '-260px';
    overlay.classList.remove('active');
  } else {
    menu.style.left = '0';
    overlay.classList.add('active');
  }

  menuVisible = !menuVisible;
}

// Gán sự kiện cho tất cả nút mở menu
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', toggleMenu);
  });

  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }

  // Thêm chức năng kéo thả cho nút có class draggable
  const draggable = document.querySelector('.menu-toggle.draggable');
  if (draggable) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    draggable.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - draggable.getBoundingClientRect().left;
      offsetY = e.clientY - draggable.getBoundingClientRect().top;
      draggable.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        draggable.style.left = `${e.clientX - offsetX}px`;
        draggable.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      draggable.style.cursor = 'grab';
    });
  }
});
