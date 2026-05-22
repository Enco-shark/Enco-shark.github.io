/**
 * 平滑滚动优化
 * 1. 所有锚点链接平滑滚动
 * 2. 回到顶部按钮平滑动画
 * 3. 滚动惯性优化
 */
function initSmoothScroll() {
  // 1. 锚点链接平滑滚动
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // 更新 URL 但不触发跳转
        history.pushState(null, null, targetId);
      }
    }
  });

  // 2. 优化回到顶部按钮
  const scrollTopBtn = document.querySelector('.tool-scroll-to-top');
  if (scrollTopBtn) {
    const originalClick = scrollTopBtn.onclick;
    scrollTopBtn.onclick = null;
    scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. 自定义滚动条样式
  const scrollStyle = document.createElement('style');
  scrollStyle.innerHTML = `
    /* 自定义滚动条 */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(128, 128, 128, 0.1);
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        rgba(163, 31, 52, 0.6) 0%,
        rgba(232, 89, 79, 0.6) 100%
      );
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(
        180deg,
        rgba(163, 31, 52, 0.8) 0%,
        rgba(232, 89, 79, 0.8) 100%
      );
    }

    /* 平滑滚动 */
    html {
      scroll-behavior: smooth;
    }

    /* 滚动优化 */
    body {
      -webkit-overflow-scrolling: touch;
    }
  `;
  document.head.appendChild(scrollStyle);

  // 4. 导航栏滚动隐藏/显示优化
  let lastScrollY = window.scrollY;
  let ticking = false;
  const navbar = document.querySelector('.navbar-container');

  if (navbar) {
    // 添加过渡动画
    navbar.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
          } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // 5. 强制覆盖 sidebar-links 液态玻璃样式
  // 使用 MutationObserver 确保在 DOM 完全加载后执行
  function applySidebarLinksStyle() {
    const links = document.querySelectorAll('.sidebar-links a.links, .sidebar-links .links');
    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.setProperty('background', 'rgba(255, 255, 255, 0.04)', 'important');
        this.style.setProperty('background-color', 'rgba(255, 255, 255, 0.04)', 'important');
        this.style.setProperty('backdrop-filter', 'blur(3px) saturate(120%)', 'important');
        this.style.setProperty('-webkit-backdrop-filter', 'blur(3px) saturate(120%)', 'important');
        this.style.setProperty('transform', 'translateX(2px)');
        this.style.setProperty('color', 'var(--primary-color)', 'important');
      });
      link.addEventListener('mouseleave', function() {
        this.style.removeProperty('background');
        this.style.removeProperty('background-color');
        this.style.removeProperty('backdrop-filter');
        this.style.removeProperty('-webkit-backdrop-filter');
        this.style.removeProperty('transform');
        this.style.removeProperty('color');
      });
    });
  }

  // 立即执行
  applySidebarLinksStyle();

  // 监听 DOM 变化，确保动态加载的内容也能应用样式
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        applySidebarLinksStyle();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}
