/**
 * Main Portfolio Interactions & Animations
 * Vanesya Wilyan (Nezy)
 */

function initMain() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const root = document.documentElement;

  /* ==========================================================================
     1. INTRO SCREEN ANIMATION
     ========================================================================== */
  const intro = document.getElementById('intro');
  const introName = document.getElementById('introName');

  if (intro) {
    if (reduce) {
      intro.remove();
    } else {
      root.classList.add('intro-on');
      const cols = ['#F1EFEA', '#FF4D8D', '#F1EFEA', '#2FBF71', '#F1EFEA', '#FF4D8D', '#F1EFEA'];
      let k = 0;
      if (introName) {
        introName.querySelectorAll('.iw').forEach(w => {
          [...w.dataset.word].forEach(ch => {
            const sp = document.createElement('span');
            sp.textContent = ch;
            sp.style.setProperty('--d', (0.15 + k * 0.07) + 's');
            sp.style.color = cols[k % cols.length];
            w.appendChild(sp);
            k++;
          });
        });
      }

      const endIntro = () => {
        if (intro) intro.style.display = 'none';
        root.classList.remove('intro-on');
      };

      setTimeout(endIntro, 3700);
      intro.addEventListener('click', endIntro);

      // Replay intro buttons
      const replay = () => {
        intro.style.display = '';
        setTimeout(endIntro, 3700);
      };

      const mkReplayBtn = parent => {
        if (!parent) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'replay';
        b.textContent = '▶ ulang intro';
        b.addEventListener('click', replay);
        parent.appendChild(b);
      };

      mkReplayBtn(document.querySelector('.top nav'));
      mkReplayBtn(document.querySelector('.foot-end'));
    }
  }

  /* ==========================================================================
     2. HERO TITLE & MARQUEE
     ========================================================================== */
  const mega = document.getElementById('mega');
  if (mega) {
    mega.innerHTML =
      [...'Nezy']
        .map((c, i) => `<span class="ch" style="--d:${0.06 + i * 0.09}s">${c}</span>`)
        .join('') + '<span class="dot">.</span>';
  }

  const track = document.getElementById('track');
  let mx = 0, halfW = 0;
  if (track) {
    const phrases = [
      'Web & Mobile',
      'UI/UX Design',
      'Business Process',
      'Data Visualization',
      'Laravel & React',
      'Power BI',
      'no cap fr'
    ];
    track.innerHTML = phrases.map(p => `<span>${p}</span><em>✳</em>`).join('').repeat(4);
    const measure = () => { halfW = track.scrollWidth / 2; };
    measure();
    window.addEventListener('resize', measure);
  }

  /* ==========================================================================
     3. CUSTOM CURSOR & MAGNETIC BUTTONS
     ========================================================================== */
  const cursor = document.getElementById('cursor');
  let cx = innerWidth / 2, cy = innerHeight / 2, curX = cx, curY = cy;

  if (cursor) {
    if (fine && !reduce) {
      window.addEventListener('mousemove', e => {
        cx = e.clientX;
        cy = e.clientY;
      });

      document.querySelectorAll('a, .card, .row, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
      });

      document.querySelectorAll('.magnet').forEach(el => {
        el.addEventListener('mousemove', e => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.25}px, ${(e.clientY - (r.top + r.height / 2)) * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = '';
        });
      });
    } else {
      cursor.style.display = 'none';
    }
  }

  /* Font width variation on Hero */
  let targetW = 100, curW = 100;
  const heroSection = document.querySelector('.hero');
  if (heroSection && fine && !reduce) {
    heroSection.addEventListener('mousemove', e => {
      targetW = 50 + (e.clientX / innerWidth) * 100;
    });
  }

  /* ==========================================================================
     4. CARD CANVAS VISUALIZERS & MAIN TICK LOOP
     ========================================================================== */
  const vis = [...document.querySelectorAll('canvas[data-kind]')].map(c => ({
    c,
    kind: c.dataset.kind,
    s: null
  }));

  function fitCanvas(v) {
    const r = v.c.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    v.c.width = r.width * d;
    v.c.height = r.height * d;
    const x = v.c.getContext('2d');
    x.setTransform(d, 0, 0, d, 0, 0);
    v.s = { x, w: r.width, h: r.height };
  }

  vis.forEach(fitCanvas);
  window.addEventListener('resize', () => vis.forEach(fitCanvas));

  const drawers = (window.PortfolioCanvas && window.PortfolioCanvas.drawers) || {};

  let lastY = scrollY, vel = 0;
  let t0 = null;

  function renderLoop(now) {
    if (t0 === null) t0 = now;
    const t = (now - t0) / 1000;

    curW += (targetW - curW) * 0.08;
    root.style.setProperty('--w', curW.toFixed(2));

    if (fine && !reduce && cursor) {
      curX += (cx - curX) * 0.22;
      curY += (cy - curY) * 0.22;
      cursor.style.transform = `translate(${curX}px,${curY}px)`;
    }

    if (track && halfW > 0) {
      vel += ((scrollY - lastY) - vel) * 0.1;
      lastY = scrollY;
      mx -= 0.6 + Math.min(Math.abs(vel), 60) * 0.12;
      if (mx < -halfW) mx += halfW;
      track.style.transform = `translate3d(${mx}px,0,0)`;
    }

    vis.forEach(v => {
      if (v.s && drawers[v.kind]) {
        drawers[v.kind](v.s.x, v.s.w, v.s.h, t);
      }
    });

    requestAnimationFrame(renderLoop);
  }

  if (reduce) {
    root.style.setProperty('--w', '100');
    vis.forEach(v => {
      if (v.s && drawers[v.kind]) drawers[v.kind](v.s.x, v.s.w, v.s.h, 0);
    });
  } else {
    requestAnimationFrame(renderLoop);
  }

  /* ==========================================================================
     5. DARK/LIGHT MODE TOGGLE
     ========================================================================== */
  const modeBtn = document.createElement('button');
  modeBtn.className = 'mode';
  modeBtn.textContent = '◐ mode';
  modeBtn.setAttribute('aria-label', 'Ganti mode terang atau gelap');
  modeBtn.addEventListener('click', () => root.classList.toggle('dark'));
  document.body.appendChild(modeBtn);

  /* ==========================================================================
     6. 3D TILT EFFECTS (PROJECT CARDS & PHONE)
     ========================================================================== */
  if (fine && !reduce) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  const phone = document.querySelector('.phone');
  const kenalSec = document.querySelector('.kenal');
  if (phone && !reduce) {
    const stage = phone.parentElement;
    const fls = stage ? [...stage.querySelectorAll('.fl')] : [];
    let tx = 0, ty = 0, pcx = 0, pcy = 0;

    if (fine) {
      const targetArea = kenalSec || stage;
      targetArea.addEventListener('mousemove', e => {
        const r = stage.getBoundingClientRect();
        tx = Math.max(-0.6, Math.min(0.6, (e.clientX - r.left) / r.width - 0.5));
        ty = Math.max(-0.6, Math.min(0.6, (e.clientY - r.top) / r.height - 0.5));
        stage.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
        stage.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
      });
      targetArea.addEventListener('mouseleave', () => {
        tx = 0; ty = 0;
        stage.style.setProperty('--mx', '50%');
        stage.style.setProperty('--my', '30%');
      });
    }

    const loopPhone = t => {
      pcx += (tx - pcx) * 0.08;
      pcy += (ty - pcy) * 0.08;
      const bob = Math.sin(t / 950) * 8;
      phone.style.transform = `perspective(1100px) rotateY(${pcx * 24}deg) rotateX(${-pcy * 18}deg) translateY(${bob}px)`;
      phone.style.setProperty('--gx', (-pcx * 1.5).toFixed(2));
      phone.style.setProperty('--gy', (-pcy * 1.5).toFixed(2));

      // Parallax for floating badges
      fls.forEach((fl, idx) => {
        const factor = (idx + 1) * 8;
        fl.style.translate = `${-pcx * factor}px ${-pcy * factor}px`;
      });

      requestAnimationFrame(loopPhone);
    };
    requestAnimationFrame(loopPhone);
  }

  document.querySelectorAll('video[autoplay]').forEach(v => {
    v.muted = true;
    v.play().catch(() => {});
  });

  /* ==========================================================================
     7. SPARKLE CURSOR TRAIL & EASTER EGG ("nezy")
     ========================================================================== */
  if (fine && !reduce) {
    let lastSpark = 0;
    window.addEventListener('mousemove', e => {
      const now = performance.now();
      if (now - lastSpark < 45) return;
      lastSpark = now;
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      document.body.appendChild(s);
      s.animate(
        [{ transform: 'scale(1)', opacity: 0.9 }, { transform: 'scale(0)', opacity: 0 }],
        { duration: 600, fill: 'forwards' }
      ).onfinish = () => s.remove();
    });
  }

  // Easter Egg: type "nezy"
  let eggBuffer = '';
  window.addEventListener('keydown', e => {
    if (e.key.length !== 1) return;
    eggBuffer = (eggBuffer + e.key.toLowerCase()).slice(-4);
    if (eggBuffer === 'nezy' && !reduce) {
      eggBuffer = '';
      confettiExplosion();
    }
  });

  function confettiExplosion() {
    const colors = ['#FF4D8D', '#2B2BFF', '#2FBF71', '#F1EFEA', '#101014'];
    for (let i = 0; i < 90; i++) {
      const el = document.createElement('i');
      el.style.cssText = `position:fixed;left:50%;top:40%;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px;background:${colors[i % colors.length]};z-index:70;pointer-events:none;border-radius:2px`;
      document.body.appendChild(el);
      const dx = (Math.random() - 0.5) * 700;
      const dy = 300 + Math.random() * 500;
      const rot = Math.random() * 720 - 360;
      el.animate(
        [{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity: 0 }],
        { duration: 1400 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }
      ).onfinish = () => el.remove();
    }
  }

  /* Reels tap navigation */
  const reels = [...document.querySelectorAll('.reel')];
  reels.forEach((r, i) =>
    r.addEventListener('click', () => {
      const next = reels[(i + 1) % reels.length];
      next.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    })
  );

  /* ==========================================================================
     8. GALLERY: STICKY HORIZONTAL SCROLL & PARALLAX
     ========================================================================== */
  const momenEl = document.querySelector('.momen');
  if (momenEl && !reduce) {
    const mTrack = momenEl.querySelector('.momen-track');
    const pin = momenEl.querySelector('.momen-pin');
    const bar = momenEl.querySelector('.gbar i');
    const tiles = [...mTrack.querySelectorAll('.m')];

    const updateGallery = () => {
      const rect = momenEl.getBoundingClientRect();
      const total = momenEl.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const maxX = mTrack.scrollWidth - pin.clientWidth;
      mTrack.style.transform = `translate3d(${-p * maxX}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
      tiles.forEach(t => {
        const r = t.getBoundingClientRect();
        const c = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        const img = t.querySelector('img');
        if (img) {
          img.style.transform = `translate3d(0,${c * -70}px,0) scale(1.15)`;
        }
      });
    };

    window.addEventListener('scroll', () => requestAnimationFrame(updateGallery), { passive: true });
    window.addEventListener('resize', updateGallery);
    updateGallery();
  }

  /* ==========================================================================
     9. EXPERIENCE LINE SCROLL PROGRESS
     ========================================================================== */
  const expLine = document.querySelector('.exp-line');
  if (expLine) {
    const fillUpd = () => {
      if (reduce) {
        expLine.style.setProperty('--fill', '100%');
        return;
      }
      const r = expLine.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      expLine.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
    };
    window.addEventListener('scroll', () => requestAnimationFrame(fillUpd), { passive: true });
    window.addEventListener('resize', fillUpd);
    fillUpd();
  }

  /* ==========================================================================
     10. LIVE FRONTEND PREVIEW TOGGLES
     ========================================================================== */
  document.querySelectorAll('.live-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const visEl = btn.parentElement;
      const on = visEl.classList.toggle('live-on');
      btn.textContent = on ? '◼ tutup preview' : '▶ coba live';
    });
  });

  /* ==========================================================================
     11. FOOTER: LIVE WIB CLOCK & BACK TO TOP
     ========================================================================== */
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    const fmt = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const tickClock = () => {
      clockEl.textContent = fmt.format(new Date()).replace(/\./g, ':');
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  const toTop = document.getElementById('totop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ==========================================================================
     12. TYPEWRITER EFFECT
     ========================================================================== */
  const typed = document.getElementById('typed');
  if (typed) {
    const lines = ['bikin web yang kepake ✨', 'ngolah data jadi cerita 📊', 'ide bisnis dari nol 🚀'];
    if (reduce) {
      typed.textContent = lines[0];
    } else {
      let li = 0, ci = 0, del = false;
      const tick = () => {
        const chars = Array.from(lines[li]);
        if (!del) {
          ci++;
          typed.textContent = chars.slice(0, ci).join('');
          if (ci === chars.length) {
            del = true;
            return setTimeout(tick, 1500);
          }
          return setTimeout(tick, 70);
        } else {
          ci--;
          typed.textContent = chars.slice(0, ci).join('');
          if (ci === 0) {
            del = false;
            li = (li + 1) % lines.length;
            return setTimeout(tick, 350);
          }
          return setTimeout(tick, 35);
        }
      };
      setTimeout(tick, 2400);
    }
  }

  /* ==========================================================================
     13. FLYING PHOTOS ANIMATION
     ========================================================================== */
  const figs = [...document.querySelectorAll('.m')];
  if (reduce) {
    figs.forEach(f => f.classList.add('in'));
  } else {
    const ioPhotos = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            ioPhotos.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    figs.forEach(f => ioPhotos.observe(f));
  }

  /* ==========================================================================
     14. BACKGROUND MUSIC TOGGLE
     ========================================================================== */
  const bgm = document.getElementById('bgm');
  if (bgm) {
    const btnMusic = document.createElement('button');
    btnMusic.className = 'music';
    btnMusic.textContent = '♫ putar musik';
    btnMusic.addEventListener('click', () => {
      if (bgm.paused) {
        bgm.play().then(() => {
          btnMusic.textContent = '❚❚ jeda musik';
        }).catch(() => {});
      } else {
        bgm.pause();
        btnMusic.textContent = '♫ putar musik';
      }
    });
    bgm.addEventListener('error', () => btnMusic.remove());
    document.body.appendChild(btnMusic);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMain);
} else {
  initMain();
}
