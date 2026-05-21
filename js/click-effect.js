function clickEffect() {
  var words = ["❤", "✨", "🌟", "💫", "🎉", "🎊", "💕", "😊"];
  var colors = ["#A31F34", "#e8594f", "#ff6b81", "#ff9ff3", "#f368e0", "#ff6348", "#ff7979", "#eb4d4b"];
  var lastTime = 0;

  document.addEventListener("click", function (e) {
    // 节流：150ms 内只触发一次
    var now = Date.now();
    if (now - lastTime < 150) return;
    lastTime = now;

    // 随机 2-3 个粒子
    var count = 2 + Math.floor(Math.random() * 2);
    for (var i = 0; i < count; i++) {
      spawnParticle(e.clientX, e.clientY, words, colors);
    }
  });

  function spawnParticle(x, y, words, colors) {
    var word = words[Math.floor(Math.random() * words.length)];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var size = 14 + Math.random() * 8;
    var rotation = (Math.random() - 0.5) * 720; // ±360°

    var span = document.createElement("span");
    span.textContent = word;
    span.style.cssText =
      "position:fixed;z-index:99999;pointer-events:none;user-select:none;" +
      "left:" + x + "px;top:" + y + "px;color:" + color + ";" +
      "font-size:" + size + "px;will-change:transform,opacity,filter;";
    document.body.appendChild(span);

    var angle = Math.random() * Math.PI * 2;
    var velocity = 40 + Math.random() * 30;
    var vx = Math.cos(angle) * velocity;
    var vy = Math.sin(angle) * velocity - 20; // 初始向上
    var startTime = Date.now();
    var duration = 1200;

    function animate() {
      var elapsed = Date.now() - startTime;
      var progress = elapsed / duration;
      if (progress >= 1) {
        span.remove();
        return;
      }

      // 重力飘落
      var gravity = 180 * progress * progress;
      var px = x + vx * progress;
      var py = y + vy * progress + gravity;

      // 旋转
      var rot = rotation * progress;

      // 缩小 + 模糊消失
      var scale = 1 - progress * 0.4;
      var opacity = 1 - progress;
      var blur = progress * 2;

      span.style.left = px + "px";
      span.style.top = py + "px";
      span.style.opacity = opacity;
      span.style.transform = "scale(" + scale + ") rotate(" + rot + "deg)";
      span.style.filter = "blur(" + blur + "px)";

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", clickEffect);
} else {
  clickEffect();
}
