/**
 * Generative Canvas Visualizers for Project Cards
 * Provides animated canvas illustrations (bars, wave, grid, ring)
 */
(function() {
  const C = { ink:'#101014', ultra:'#2B2BFF', pink:'#FF4D8D', green:'#2FBF71', bone:'#F1EFEA' };
  const FONT = '600 12px "Schibsted Grotesk", sans-serif';

  const mix = (a, b, t) => {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = (pa >> 16) * (1 - t) + (pb >> 16) * t;
    const g = ((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t;
    const bl = (pa & 255) * (1 - t) + (pb & 255) * t;
    return `rgb(${r | 0},${g | 0},${bl | 0})`;
  };

  function drawBars(x, w, h, t) {
    x.clearRect(0, 0, w, h);
    const n = 7, pad = 28, gap = 12, bw = (w - pad * 2 - gap * (n - 1)) / n, base = h - 36;
    const hi = Math.floor(t * 0.6) % n;
    const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
    for (let i = 0; i < n; i++) {
      const v = 0.42 + 0.36 * Math.sin(t * 0.9 + i * 0.9) * 0.5 + 0.2 * ((i * 37) % 11) / 11;
      const bh = Math.min(1, v) * (base - 40);
      const bx = pad + i * (bw + gap);
      x.fillStyle = i === hi ? C.pink : C.bone;
      x.beginPath();
      x.roundRect ? x.roundRect(bx, base - bh, bw, bh, 12) : x.rect(bx, base - bh, bw, bh);
      x.fill();
      x.fillStyle = 'rgba(241,239,234,.6)';
      x.font = FONT;
      x.textAlign = 'center';
      x.fillText(days[i], bx + bw / 2, h - 12);
    }
    x.fillStyle = 'rgba(241,239,234,.5)';
    x.font = FONT;
    x.textAlign = 'left';
    x.fillText('Ilustrasi grafik', 28, 30);
  }

  function drawWave(x, w, h, t) {
    x.clearRect(0, 0, w, h);
    const lines = 6;
    for (let l = 0; l < lines; l++) {
      x.beginPath();
      for (let px = 0; px <= w; px += 4) {
        const k = px / w;
        const y = h * 0.5 + Math.sin(k * 6 + t * 1.1 + l * 0.5) * h * 0.22 * (0.4 + 0.6 * k) + (l - lines / 2) * h * 0.035;
        px === 0 ? x.moveTo(px, y) : x.lineTo(px, y);
      }
      x.strokeStyle = l === lines - 1 ? C.pink : (l % 2 ? C.bone : 'rgba(241,239,234,.45)');
      x.lineWidth = l === lines - 1 ? 3 : 1.5;
      x.stroke();
    }
  }

  function drawGrid(x, w, h, t) {
    x.clearRect(0, 0, w, h);
    const cols = 16, rows = 9, pad = 22;
    const cw = (w - pad * 2) / cols, ch = (h - pad * 2) / rows;
    const scan = ((t * 0.12) % 1.2) * (w + 40) - 20;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const v = (Math.sin(i * 0.5 + t * 0.8) + Math.cos(j * 0.7 - t * 0.6) + 2) / 4;
        const lit = (pad + i * cw) < scan;
        x.fillStyle = lit ? mix(C.ink, C.green, v) : mix(C.bone, C.green, v * 0.25);
        x.globalAlpha = lit ? 1 : 0.35;
        x.fillRect(pad + i * cw + 2, pad + j * ch + 2, cw - 4, ch - 4);
      }
    }
    x.globalAlpha = 1;
    x.fillStyle = C.pink;
    x.fillRect(scan, 0, 2, h);
  }

  function drawRing(x, w, h, t) {
    x.clearRect(0, 0, w, h);
    const cx2 = w / 2, cy2 = h / 2, r = Math.min(w, h) * 0.3;
    const p = (t * 0.07) % 1;
    x.lineWidth = 16;
    x.lineCap = 'round';
    x.strokeStyle = 'rgba(16,16,20,.12)';
    x.beginPath();
    x.arc(cx2, cy2, r, 0, Math.PI * 2);
    x.stroke();
    x.strokeStyle = C.ultra;
    x.beginPath();
    x.arc(cx2, cy2, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
    x.stroke();
    x.fillStyle = C.ink;
    x.textAlign = 'center';
    x.font = `800 ${Math.round(r * 0.42)}px Anybody, sans-serif`;
    x.fillText(String(Math.floor(p * 50) + 1), cx2, cy2 + r * 0.14);
    x.font = `600 ${Math.max(10, Math.round(r * 0.16))}px "Schibsted Grotesk", sans-serif`;
    x.fillStyle = 'rgba(16,16,20,.6)';
    x.fillText('dari 50 soal', cx2, cy2 + r * 0.5);
  }

  window.PortfolioCanvas = {
    drawers: {
      bars: drawBars,
      wave: drawWave,
      grid: drawGrid,
      ring: drawRing
    }
  };
})();
