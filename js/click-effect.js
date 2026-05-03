function clickEffect() {
  var words = ["❤", "✨", "🌟", "💫", "🎉", "🎊", "💕", "😊"];
  var colors = ["#A31F34", "#e8594f", "#ff6b81", "#ff9ff3", "#f368e0", "#ff6348", "#ff7979", "#eb4d4b"];
  
  document.addEventListener("click", function (e) {
    var word = words[Math.floor(Math.random() * words.length)];
    var color = colors[Math.floor(Math.random() * colors.length)];
    var span = document.createElement("span");
    span.textContent = word;
    span.style.cssText =
      "position:fixed;z-index:99999;pointer-events:none;font-size:18px;user-select:none;" +
      "left:" + e.clientX + "px;top:" + e.clientY + "px;color:" + color + ";";
    document.body.appendChild(span);

    var angle = Math.random() * Math.PI * 2;
    var velocity = 60 + Math.random() * 40;
    var vx = Math.cos(angle) * velocity;
    var vy = Math.sin(angle) * velocity - 30;
    var startTime = Date.now();
    var duration = 800;

    function animate() {
      var elapsed = Date.now() - startTime;
      var progress = elapsed / duration;
      if (progress >= 1) {
        span.remove();
        return;
      }
      var x = e.clientX + vx * progress;
      var y = e.clientY + vy * progress + 200 * progress * progress;
      span.style.left = x + "px";
      span.style.top = y + "px";
      span.style.opacity = 1 - progress;
      span.style.transform = "scale(" + (1 - progress * 0.5) + ")";
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", clickEffect);
} else {
  clickEffect();
}
