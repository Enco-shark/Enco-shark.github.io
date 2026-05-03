/**
 * 图片灯箱查看器
 * 点击图片放大查看，支持键盘操作
 */
function initLightbox() {
  // 创建灯箱容器
  const lightbox = document.createElement('div');
  lightbox.id = 'image-lightbox';
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    cursor: zoom-out;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  // 创建图片元素
  const img = document.createElement('img');
  img.src = '';
  img.alt = '大图预览';
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    transition: transform 0.3s ease;
  `;

  // 创建关闭按钮
  const closeBtn = document.createElement('div');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  closeBtn.onmouseover = () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    closeBtn.style.transform = 'rotate(90deg)';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    closeBtn.style.transform = 'rotate(0deg)';
  };

  // 创建提示文字
  const hint = document.createElement('div');
  hint.innerHTML = '点击任意位置关闭';
  hint.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    pointer-events: none;
  `;

  lightbox.appendChild(img);
  lightbox.appendChild(closeBtn);
  lightbox.appendChild(hint);
  document.body.appendChild(lightbox);

  // 打开灯箱
  function openLightbox(src) {
    lightbox.style.display = 'flex';
    setTimeout(() => {
      lightbox.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 10);
    img.src = src;
    document.body.style.overflow = 'hidden';
  }

  // 关闭灯箱
  function closeLightbox() {
    lightbox.style.opacity = '0';
    img.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lightbox.style.display = 'none';
      img.src = '';
      document.body.style.overflow = '';
    }, 300);
  }

  // 事件绑定
  lightbox.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  img.addEventListener('click', (e) => e.stopPropagation());

  // 键盘操作
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape' || e.key === ' ') {
        closeLightbox();
      }
    }
  });

  // 为所有文章图片添加点击事件
  setTimeout(() => {
    const articleImages = document.querySelectorAll('.markdown-body img, .article-content img, .home-article-cover img');
    articleImages.forEach(img => {
      if (img.src && !img.closest('a')) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(img.src);
        });
      }
    });
  }, 1000);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}
