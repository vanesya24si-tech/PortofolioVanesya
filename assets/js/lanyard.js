/**
 * Interactive Verlet Rope & 3D ID Card Lanyard Simulation
 */
(function() {
  function initLanyard() {
    const canvas = document.getElementById('lanyard');
    if (!canvas) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    const N = 14, SEG = 18, G = 0.55, CW = 170, CH = 230;
    const C = { ultra: '#2B2BFF', pink: '#FF4D8D', ink: '#101014', bone: '#F1EFEA' };
    let W = 0, H = 0, pts = [], dragging = false, started = false, raf = 0;
    let shine = 0.5, shineT = 0.5;

    // Preload actual ID card photo
    const cardImg = new Image();
    cardImg.src = 'lanyard.jpeg';
    cardImg.onload = () => {
      if (started) draw();
    };

    function resize() {
      const r = canvas.getBoundingClientRect();
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = r.width * d;
      canvas.height = r.height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      W = r.width;
      H = r.height;
    }

    const anchor = () => ({ x: W / 2, y: -10 });

    function reset() {
      const a = anchor();
      pts = [];
      for (let i = 0; i < N; i++) {
        const y = a.y - 260 - i * SEG;
        pts.push({ x: a.x + (Math.random() - 0.5) * 30, y, px: a.x, py: y });
      }
    }

    function step() {
      const a = anchor();
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        if (i === 0) {
          p.x = a.x; p.y = a.y; p.px = p.x; p.py = p.y;
          continue;
        }
        if (dragging && i === N - 1) continue;
        const vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + G;
      }
      for (let it = 0; it < 8; it++) {
        for (let i = 0; i < N - 1; i++) {
          const p = pts[i], q = pts[i + 1];
          const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1;
          const diff = (d - SEG) / d;
          const wp = i === 0 ? 0 : 1;
          const wq = (dragging && i + 1 === N - 1) ? 0 : 1;
          const tot = wp + wq;
          if (!tot) continue;
          p.x += dx * diff * (wp / tot);
          p.y += dy * diff * (wp / tot);
          q.x -= dx * diff * (wq / tot);
          q.y -= dy * diff * (wq / tot);
        }
      }
    }

    function rr(x0, y0, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x0 + r, y0);
      ctx.arcTo(x0 + w, y0, x0 + w, y0 + h, r);
      ctx.arcTo(x0 + w, y0 + h, x0, y0 + h, r);
      ctx.arcTo(x0, y0 + h, x0, y0, r);
      ctx.arcTo(x0, y0, x0 + w, y0, r);
      ctx.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = C.ultra;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < N; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      const L = pts[N - 1], P = pts[N - 2];
      const theta = Math.atan2(L.x - P.x, L.y - P.y);
      ctx.save();
      ctx.translate(L.x, L.y);
      ctx.rotate(-theta);

      /* card shadow */
      ctx.shadowColor = 'rgba(16,16,20,.25)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = C.ultra;
      rr(-CW / 2, 14, CW, CH, 18);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      /* draw ID card image if loaded */
      if (cardImg.complete && cardImg.naturalWidth > 0) {
        ctx.save();
        rr(-CW / 2, 14, CW, CH, 18);
        ctx.clip();
        const imgAspect = cardImg.naturalWidth / cardImg.naturalHeight;
        const cardAspect = CW / CH;
        let sx, sy, sw, sh;
        if (imgAspect > cardAspect) {
          sh = cardImg.naturalHeight;
          sw = sh * cardAspect;
          sx = (cardImg.naturalWidth - sw) / 2;
          sy = 0;
        } else {
          sw = cardImg.naturalWidth;
          sh = sw / cardAspect;
          sx = 0;
          sy = (cardImg.naturalHeight - sh) * 0.15;
        }
        ctx.drawImage(cardImg, sx, sy, sw, sh, -CW / 2, 14, CW, CH);
        ctx.restore();
      } else {
        /* text fallback */
        ctx.textAlign = 'center';
        ctx.fillStyle = C.bone;
        ctx.font = '800 26px Anybody, sans-serif';
        ctx.fillText('Nezy.', 0, 96);
        ctx.font = '600 13px "Schibsted Grotesk", sans-serif';
        ctx.fillText('Full-Stack & ML Engineer', 0, 122);
        ctx.globalAlpha = 0.75;
        ctx.fillText('Politeknik Caltex Riau', 0, 142);
        ctx.globalAlpha = 1;

        ctx.fillStyle = C.pink;
        rr(-CW / 2, CH - 44, CW, 44, 18);
        ctx.fill();
        ctx.fillStyle = C.ink;
        ctx.font = '700 13px "Schibsted Grotesk", sans-serif';
        ctx.fillText('✳ bikin web yuk', 0, CH - 17);
      }

      /* clip + hole */
      ctx.fillStyle = C.pink;
      rr(-22, 14, 44, 14, 6);
      ctx.fill();
      ctx.fillStyle = C.bone;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      /* holographic sheen that follows the pointer */
      const cx0 = -CW / 2 + shine * CW;
      const g = ctx.createLinearGradient(cx0 - 90, 0, cx0 + 90, CH);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.5, 'rgba(255,255,255,.24)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      rr(-CW / 2, 14, CW, CH, 18);
      ctx.fill();
      ctx.restore();
    }

    function loop() {
      step();
      shine += (shineT - shine) * 0.08;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (started) return;
      started = true;
      resize();
      reset();
      if (reduce) {
        for (let i = 0; i < 300; i++) step();
        draw();
        return;
      }
      loop();
    }

    /* drag the card */
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener('pointerdown', e => {
      if (!started) return;
      const m = pos(e), L = pts[N - 1];
      if (Math.hypot(m.x - L.x, m.y - L.y) < 110) {
        dragging = true;
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('pointermove', e => {
      shineT = pos(e).x / W;
      if (!dragging) return;
      const m = pos(e), L = pts[N - 1];
      L.x = m.x; L.y = m.y; L.px = m.x; L.py = m.y;
      if (reduce) { step(); draw(); }
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      pts[N - 1].px = pts[N - 1].x;
      pts[N - 1].py = pts[N - 1].y;
      canvas.style.cursor = '';
    };

    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    window.addEventListener('resize', () => {
      resize();
      if (reduce && started) draw();
    });

    /* drop in when it scrolls into view */
    const io = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) {
        start();
        io.disconnect();
      }
    }, { threshold: 0.35 });

    io.observe(canvas);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanyard);
  } else {
    initLanyard();
  }
})();
