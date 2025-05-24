body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Nút menu nổi cố định và kéo thả được */
.menu-toggle.draggable {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1101;
  background-color: white; /* 🎯 Nền trắng */
  padding: 10px;
  border: none;
  border-radius: 0; /* ❌ Bỏ bo tròn */
  cursor: grab;
  user-select: none;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none; /* ❌ Bỏ bóng nếu có */
}

.menu-toggle.draggable:hover {
  background-color: yellow; /* 🎯 Màu vàng khi hover */
}

.menu-toggle .menu-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  pointer-events: none; /* tránh ảnh cản kéo */
  border-radius: 0; /* ❌ Bỏ bo tròn nếu ảnh là hình tròn */
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  z-index: 999;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

.side-menu {
  position: fixed;
  top: 0;
  left: -260px;
  width: 250px;
  height: auto;
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  color: white;
  overflow: hidden;
  transition: left 0.4s ease;
  padding: 20px 0;
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  max-height: 90vh;
  overflow-y: auto;
}

.side-menu a {
  padding: 15px 25px;
  display: block;
  font-size: 18px;
  color: #f1f1f1;
  text-decoration: none;
  transition: background 0.3s;
}

.side-menu a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
