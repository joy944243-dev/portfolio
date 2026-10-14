/* ============================================================
   Afnan — Playground
   01 Generative flow field  ·  02 Grid reflex game
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     01 — Generative flow field
     --------------------------------------------------------- */
  function initField() {
    var canvas = document.getElementById("fieldCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var PALETTES = {
      lime: [[200, 247, 81], [110, 231, 255], [139, 123, 255]],
      ember: [[255, 138, 92], [255, 95, 158], [255, 209, 102]],
      mono: [[236, 236, 242], [150, 150, 165], [90, 90, 110]]
    };
    var current = "lime";

    var W = 0, H = 0, DPR = 1;
    var particles = [];
    var colors = PALETTES[current];
    var raf = 0, running = true, visible = true, t = 0;
    var pointer = { x: -9999, y: -9999, active: false, down: false };

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);
      seed();
    }

    function count() {
      return Math.max(400, Math.min(2600, Math.round((W * H) / 900)));
    }

    function spawn(p) {
      if (p) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      } else {
        p = { x: Math.random() * W, y: Math.random() * H, px: 0, py: 0, life: 60 + Math.random() * 160, c: colors[(Math.random() * colors.length) | 0] };
      }
      p.px = p.x;
      p.py = p.y;
      p.life = 80 + Math.random() * 180;
      return p;
    }

    function seed() {
      var n = count();
      particles.length = 0;
      for (var i = 0; i < n; i++) particles.push(spawn());
    }

    function angle(x, y, tt) {
      return (
        Math.sin(x * 0.0016 + tt * 0.0006) +
        Math.cos(y * 0.0019 - tt * 0.0005) +
        Math.sin((x + y) * 0.0011 + tt * 0.0004)
      ) * 1.05;
    }

    function step() {
      ctx.fillStyle = "rgba(10,10,12,0.075)";
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1.1;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.px = p.x;
        p.py = p.y;
        var a = angle(p.x, p.y, t);
        var vx = Math.cos(a) * 1.5;
        var vy = Math.sin(a) * 1.5;

        if (pointer.active) {
          var dx = p.x - pointer.x;
          var dy = p.y - pointer.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 24000 && d2 > 0.01) {
            var f = (1 - d2 / 24000) * (pointer.down ? 2.4 : 1.1);
            var inv = f / Math.sqrt(d2);
            vx += dx * inv;
            vy += dy * inv;
          }
        }

        p.x += vx;
        p.y += vy;
        p.life -= 1;

        ctx.strokeStyle = "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + ",0.55)";
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          spawn(p);
        }
      }
      t += 16;
    }

    function loop() {
      if (!running || !visible) { raf = 0; return; }
      step();
      raf = requestAnimationFrame(loop);
    }

    function start() { if (!raf && running && visible) raf = requestAnimationFrame(loop); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    // Pointer
    function updatePointer(e) {
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", function (e) { updatePointer(e); pointer.down = true; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointerup", function () { pointer.down = false; });
    canvas.addEventListener("pointerleave", function () { pointer.active = false; pointer.down = false; });

    // Controls
    var chips = document.querySelectorAll("[data-palette]");
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", function () {
        current = this.getAttribute("data-palette");
        colors = PALETTES[current] || PALETTES.lime;
        for (var j = 0; j < chips.length; j++) chips[j].classList.remove("is-active");
        this.classList.add("is-active");
        seed();
        staticFrame();
        if (!reduceMotion) start();
      });
    }

    var clearBtn = document.getElementById("fieldClear");
    if (clearBtn) clearBtn.addEventListener("click", function () {
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);
      seed();
      if (reduceMotion) staticFrame();
    });

    var pauseBtn = document.getElementById("fieldPause");
    if (pauseBtn) pauseBtn.addEventListener("click", function () {
      running = !running;
      pauseBtn.textContent = running ? "Pause" : "Play";
      pauseBtn.setAttribute("aria-pressed", running ? "false" : "true");
      if (running) start(); else stop();
    });

    // Static single frame for reduced motion
    function staticFrame() {
      if (!reduceMotion) return;
      for (var k = 0; k < 140; k++) step();
      t = 0;
    }

    // Visibility
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.05 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    var rTO;
    window.addEventListener("resize", function () {
      clearTimeout(rTO);
      rTO = setTimeout(resize, 150);
    });

    resize();
    if (reduceMotion) staticFrame(); else start();
  }

  /* ---------------------------------------------------------
     02 — Grid reflex game
     --------------------------------------------------------- */
  function initGame() {
    var grid = document.getElementById("gameGrid");
    if (!grid) return;
    var scoreEl = document.getElementById("gameScore");
    var bestEl = document.getElementById("gameBest");
    var timeEl = document.getElementById("gameTime");
    var overlay = document.getElementById("gameOverlay");
    var heading = document.getElementById("gameHeading");
    var blurb = document.getElementById("gameBlurb");
    var startBtn = document.getElementById("gameStart");

    var SIZE = 4;
    var cells = [];
    var target = -1;
    var playing = false;
    var score = 0;
    var interval = 900;
    var timeLeft = 20;
    var tick = 0, moveT = 0;
    var best = 0;
    try { best = parseInt(localStorage.getItem("afnan.reflex.best") || "0", 10) || 0; } catch (e) { best = 0; }
    bestEl.textContent = best;

    for (var i = 0; i < SIZE * SIZE; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "game__cell";
      b.setAttribute("data-i", i);
      b.setAttribute("aria-label", "Tile " + (i + 1));
      b.addEventListener("click", onCell);
      b.addEventListener("keydown", onCellKey);
      grid.appendChild(b);
      cells.push(b);
    }

    function onCell(e) {
      if (!playing) return;
      var i = parseInt(e.currentTarget.getAttribute("data-i"), 10);
      if (i === target) hit();
    }

    function onCellKey(e) {
      var i = parseInt(e.currentTarget.getAttribute("data-i"), 10);
      var r = Math.floor(i / SIZE), c = i % SIZE, n = null;
      if (e.key === "ArrowRight" && c < SIZE - 1) n = i + 1;
      else if (e.key === "ArrowLeft" && c > 0) n = i - 1;
      else if (e.key === "ArrowDown" && r < SIZE - 1) n = i + SIZE;
      else if (e.key === "ArrowUp" && r > 0) n = i - SIZE;
      if (n !== null) { e.preventDefault(); cells[n].focus(); }
    }

    function move() {
      var next = target;
      while (next === target) next = (Math.random() * cells.length) | 0;
      if (target >= 0) cells[target].classList.remove("is-target");
      target = next;
      cells[target].classList.add("is-target");
      cells[target].focus({ preventScroll: true });
    }

    function hit() {
      score++;
      scoreEl.textContent = score;
      interval = Math.max(360, 900 - score * 28);
      moveT = 0;
      move();
    }

    function end() {
      playing = false;
      if (tick) { clearInterval(tick); tick = 0; }
      if (target >= 0) cells[target].classList.remove("is-target");
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        try { localStorage.setItem("afnan.reflex.best", String(best)); } catch (e) {}
      }
      overlay.classList.add("is-visible");
      heading.textContent = "Time!";
      blurb.textContent = "You scored " + score + (score >= best ? " — new best!" : ". Best: " + best + ".");
      startBtn.textContent = "Play again";
    }

    function start() {
      score = 0; scoreEl.textContent = "0";
      interval = 900; timeLeft = 20; timeEl.textContent = "20";
      moveT = 0; playing = true;
      overlay.classList.remove("is-visible");
      move();
      if (tick) clearInterval(tick);
      var last = performance.now();
      tick = setInterval(function () {
        var now = performance.now();
        var dt = now - last; last = now;
        moveT += dt;
        if (moveT >= interval) { moveT = 0; if (playing) move(); }
        timeLeft -= dt / 1000;
        if (timeLeft <= 0) { timeLeft = 0; timeEl.textContent = "0"; end(); }
        else timeEl.textContent = Math.ceil(timeLeft);
      }, 100);
    }

    startBtn.addEventListener("click", start);
  }

  function boot() {
    initField();
    initGame();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
