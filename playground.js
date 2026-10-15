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

  /* ---------------------------------------------------------
     03 — Target range (shooting game)
     --------------------------------------------------------- */
  function initShoot() {
    var canvas = document.getElementById("shootCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var scoreEl = document.getElementById("shootScore");
    var bestEl = document.getElementById("shootBest");
    var ammoEl = document.getElementById("shootAmmo");
    var timeEl = document.getElementById("shootTime");
    var overlay = document.getElementById("shootOverlay");
    var heading = document.getElementById("shootHeading");
    var blurb = document.getElementById("shootBlurb");
    var startBtn = document.getElementById("shootStart");

    var MAXAMMO = 12;
    var DURATION = 30;
    var RELOAD = 1.1;

    var W = 0, H = 0, DPR = 1;
    var raf = 0, visible = true;
    var pointer = { x: -9999, y: -9999, inside: false };
    var targets = [], impacts = [], rings = [], sparks = [];
    var playing = false, reloading = false, reloadT = 0;
    var score = 0, shots = 0, hits = 0, ammo = MAXAMMO;
    var timeLeft = DURATION, spawnT = 0, last = 0;
    var best = 0;
    try { best = parseInt(localStorage.getItem("afnan.shoot.best") || "0", 10) || 0; } catch (e) { best = 0; }
    bestEl.textContent = best;
    ammoEl.textContent = ammo;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function spawn() {
      var r = 30 + Math.random() * 18;
      var m = r + 16;
      var life = 1.7 + Math.random() * 1.1;
      targets.push({
        x: m + Math.random() * Math.max(1, W - m * 2),
        y: m + Math.random() * Math.max(1, H - m * 2),
        r: r,
        life: life,
        maxLife: life,
        vx: (Math.random() - 0.5) * 46,
        vy: (Math.random() - 0.5) * 46
      });
    }

    function hud() {
      scoreEl.textContent = score;
      ammoEl.textContent = reloading ? "··" : ammo;
      timeEl.textContent = Math.max(0, Math.ceil(timeLeft));
    }

    function beginReload() {
      if (reloading || ammo >= MAXAMMO) return;
      reloading = true; reloadT = 0;
      hud();
    }

    function shoot(x, y) {
      if (!playing || reloading || ammo <= 0) return;
      ammo--; shots++;
      impacts.push({ x: x, y: y, life: 0.7, max: 0.7 });

      var hit = null, hd = Infinity;
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        var dx = x - t.x, dy = y - t.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d <= t.r && d < hd) { hd = d; hit = t; }
      }

      if (hit) {
        hits++;
        var acc = 1 - hd / hit.r;
        score += 50 + Math.round(acc * 50);
        rings.push({ x: hit.x, y: hit.y, r: hit.r * 0.35, max: hit.r * 1.6, life: 0.42, m: 0.42, c: "#c8f751" });
        for (var s = 0; s < 8; s++) {
          var a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * 130;
          sparks.push({ x: hit.x, y: hit.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.35, m: 0.35 });
        }
        var idx = targets.indexOf(hit);
        if (idx >= 0) targets.splice(idx, 1);
      }

      if (ammo <= 0) beginReload();
      hud();
    }

    function update(dt) {
      if (reloading) {
        reloadT += dt;
        if (reloadT >= RELOAD) { reloading = false; ammo = MAXAMMO; }
        hud();
      }

      if (playing) {
        timeLeft -= dt;
        if (timeLeft <= 0) { timeLeft = 0; hud(); end(); }
        spawnT += dt;
        if (targets.length < 3 && spawnT >= 0.45) { spawnT = 0; spawn(); }

        for (var i = targets.length - 1; i >= 0; i--) {
          var t = targets[i];
          t.x += t.vx * dt; t.y += t.vy * dt;
          if (t.x < t.r || t.x > W - t.r) t.vx *= -1;
          if (t.y < t.r || t.y > H - t.r) t.vy *= -1;
          t.x = Math.max(t.r, Math.min(W - t.r, t.x));
          t.y = Math.max(t.r, Math.min(H - t.r, t.y));
          t.life -= dt;
          if (t.life <= 0) targets.splice(i, 1);
        }
      }

      for (var j = impacts.length - 1; j >= 0; j--) { impacts[j].life -= dt; if (impacts[j].life <= 0) impacts.splice(j, 1); }
      for (var k = rings.length - 1; k >= 0; k--) { rings[k].life -= dt; if (rings[k].life <= 0) rings.splice(k, 1); }
      for (var q = sparks.length - 1; q >= 0; q--) {
        var spk = sparks[q];
        spk.x += spk.vx * dt; spk.y += spk.vy * dt;
        spk.vx *= 0.9; spk.vy *= 0.9;
        spk.life -= dt; if (spk.life <= 0) sparks.splice(q, 1);
      }
    }

    function draw() {
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      var step = 46;
      for (var gx = step; gx < W; gx += step) { ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
      for (var gy = step; gy < H; gy += step) { ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
      ctx.stroke();

      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        ctx.save();
        ctx.globalAlpha = t.life < 0.45 ? t.life / 0.45 : 1;
        var rg = ctx.createRadialGradient(t.x, t.y, t.r * 0.1, t.x, t.y, t.r);
        rg.addColorStop(0, "rgba(110,231,255,0.95)");
        rg.addColorStop(0.55, "rgba(200,247,81,0.85)");
        rg.addColorStop(1, "rgba(139,123,255,0.35)");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(10,10,12,0.55)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.62, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(t.x, t.y, t.r * 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, t.life / t.maxLife));
        ctx.stroke();
        ctx.restore();
      }

      for (var p = 0; p < impacts.length; p++) {
        var im = impacts[p];
        ctx.save();
        ctx.globalAlpha = im.life / im.max;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath(); ctx.arc(im.x, im.y, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(im.x, im.y, 4.6, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      for (var r = 0; r < rings.length; r++) {
        var rg2 = rings[r];
        var tt = 1 - rg2.life / rg2.m;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - tt);
        ctx.strokeStyle = rg2.c; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(rg2.x, rg2.y, rg2.r + (rg2.max - rg2.r) * tt, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      for (var sp = 0; sp < sparks.length; sp++) {
        var sk = sparks[sp];
        ctx.save();
        ctx.globalAlpha = Math.max(0, sk.life / sk.m);
        ctx.fillStyle = "#c8f751";
        ctx.beginPath(); ctx.arc(sk.x, sk.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      if (pointer.inside) {
        var x = pointer.x, y = pointer.y;
        ctx.save();
        ctx.strokeStyle = playing ? "rgba(200,247,81,0.9)" : "rgba(200,247,81,0.45)";
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 22, y); ctx.lineTo(x - 8, y);
        ctx.moveTo(x + 8, y); ctx.lineTo(x + 22, y);
        ctx.moveTo(x, y - 22); ctx.lineTo(x, y - 8);
        ctx.moveTo(x, y + 8); ctx.lineTo(x, y + 22);
        ctx.stroke();
        ctx.fillStyle = "#c8f751";
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        if (reloading) {
          ctx.strokeStyle = "rgba(110,231,255,0.9)"; ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, reloadT / RELOAD));
          ctx.stroke();
        }
        ctx.restore();
      }

      if (playing && !reloading && ammo <= 0) {
        ctx.fillStyle = "#f4f3ee";
        ctx.font = "600 13px 'Space Grotesk', monospace";
        ctx.textAlign = "center";
        ctx.fillText("PRESS R TO RELOAD", W / 2, H - 26);
      }
    }

    function loop(now) {
      raf = 0;
      if (!visible) return;
      var dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (dt > 0.05) dt = 0.05;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    function start() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(loop); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function toLocal(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    canvas.addEventListener("pointermove", function (e) { var p = toLocal(e); pointer.x = p.x; pointer.y = p.y; pointer.inside = true; });
    canvas.addEventListener("pointerleave", function () { pointer.inside = false; });
    canvas.addEventListener("pointerdown", function (e) {
      var p = toLocal(e);
      pointer.x = p.x; pointer.y = p.y; pointer.inside = true;
      e.preventDefault();
      shoot(p.x, p.y);
    });

    document.addEventListener("keydown", function (e) {
      if ((e.key === "r" || e.key === "R") && playing && !reloading) beginReload();
    });

    function resetGame() {
      targets.length = 0; impacts.length = 0; rings.length = 0; sparks.length = 0;
      score = 0; shots = 0; hits = 0; ammo = MAXAMMO;
      reloading = false; reloadT = 0; timeLeft = DURATION; spawnT = 0.45;
    }

    function play() {
      resetGame();
      playing = true;
      overlay.classList.remove("is-visible");
      spawn(); spawn();
      hud();
      start();
    }

    function end() {
      playing = false;
      var acc = shots ? Math.round((hits / shots) * 100) : 0;
      var record = score > best && score > 0;
      if (score > best) {
        best = score;
        bestEl.textContent = best;
        try { localStorage.setItem("afnan.shoot.best", String(best)); } catch (e) {}
      }
      heading.textContent = "Time!";
      blurb.textContent = "Score " + score + " · accuracy " + acc + "% · " + hits + "/" + shots + " hits." +
        (record ? " New best!" : " Best: " + best + ".");
      startBtn.textContent = "Play again";
      overlay.classList.add("is-visible");
    }

    startBtn.addEventListener("click", play);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.05 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });

    var rTO;
    window.addEventListener("resize", function () { clearTimeout(rTO); rTO = setTimeout(resize, 150); });

    resize();
    start();
  }

  function boot() {
    initField();
    initGame();
    initShoot();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
