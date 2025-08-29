// script.js (updated)
// Integrates tsparticles, sidebar behavior (desktop/mobile), copy buttons,
// theme toggle (supports old data-theme or new body.light), card reveal, typing title.
// Replace existing script.js with this file.

document.addEventListener("DOMContentLoaded", () => {

  // --------- 0. helpers ----------
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const body = document.body;

  // normalize theme storage: prefer 'cheat_theme' else 'theme'
  const storedTheme = localStorage.getItem('cheat_theme') || localStorage.getItem('theme');

  // --------- 1. TSPARTICLES (if present) ----------
  if (window.tsParticles && document.getElementById("tsparticles")) {
    // choose a sensible color for particles using computed body color (rgb or hex)
    const computedColor = getComputedStyle(document.body).color || "#ffffff";
    // set particle count based on viewport size for performance
    const baseCount = window.innerWidth > 1400 ? 100 : window.innerWidth > 900 ? 70 : 35;

    tsParticles.load("tsparticles", {
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: true, mode: "repulse" },
          resize: true
        },
        modes: { push: { quantity: 4 }, repulse: { distance: 140, duration: 0.4 } }
      },
      particles: {
        color: { value: computedColor },
        links: { color: computedColor, distance: 160, enable: true, opacity: 0.08, width: 1 },
        move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1.2, straight: false },
        number: { density: { enable: true, area: 800 }, value: baseCount },
        opacity: { value: 0.28 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 4 } }
      },
      detectRetina: true
    }).catch(e => console.warn("tsParticles load failed:", e));
  }

  // --------- 2. Sidebar toggle (desktop vs mobile) ----------
  const sidebar = $('#sidebar');
  const mainContent = $('#main-content');
  const sidebarToggle = $('#sidebar-toggle');

  function isMobileWidth() { return window.innerWidth <= 768; }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (isMobileWidth()) {
        // mobile: open overlay menu
        body.classList.toggle('sidebar-open');
        sidebarToggle.setAttribute('aria-expanded', String(body.classList.contains('sidebar-open')));
      } else {
        // desktop: collapse narrow
        body.classList.toggle('sidebar-collapsed');
        sidebarToggle.setAttribute('aria-expanded', String(!body.classList.contains('sidebar-collapsed')));
      }
    });

    // keyboard accessibility
    sidebarToggle.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') sidebarToggle.click();
    });
  }

  // Ensure mobile-open state is removed when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && body.classList.contains('sidebar-open')) {
      body.classList.remove('sidebar-open');
    }
  });

  // --------- 3. Card reveal on scroll (IntersectionObserver) ----------
  const cards = $$('.card');
  if (cards.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(c => io.observe(c));
  }

  // --------- 4. Copy-to-clipboard (graceful) ----------
  $$('.copy-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        const codeBlock = btn.closest('.code-block');
        if (!codeBlock) return;
        const pre = codeBlock.querySelector('pre');
        if (!pre) return;
        const text = pre.innerText;
        await navigator.clipboard.writeText(text);
        const prev = btn.innerHTML;
        btn.innerText = 'Copied ✓';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = prev; btn.disabled = false; }, 1400);
      } catch (err) {
        console.warn('Copy failed', err);
        // fallback: select text
        try {
          const code = btn.closest('.code-block').querySelector('pre');
          const range = document.createRange();
          range.selectNodeContents(code);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } catch(ignore){}
      }
    });
    // make keyboard-friendly
    btn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') btn.click(); });
  });

  // --------- 5. Theme toggle (support both data-theme and body.light) ----------
  const themeToggle = $('#theme-toggle');

  // Apply stored theme (priority: cheat_theme, theme)
  if (storedTheme === 'light') body.classList.add('light');
  else if (storedTheme === 'dark') body.classList.remove('light');

  // Sync attribute for legacy code (data-theme)
  if (body.classList.contains('light')) body.setAttribute('data-theme', 'light');
  else body.removeAttribute('data-theme');

  // Icon visibility helper (assumes icons with .icon-moon and .icon-sun inside #theme-toggle)
  function updateThemeIcons() {
    if (!themeToggle) return;
    const moon = themeToggle.querySelector('.icon-moon');
    const sun = themeToggle.querySelector('.icon-sun');
    const isLight = body.classList.contains('light');
    if (moon) moon.style.display = isLight ? 'none' : '';
    if (sun) sun.style.display = isLight ? '' : 'none';
    themeToggle.setAttribute('aria-pressed', isLight);
  }
  updateThemeIcons();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nowLight = body.classList.toggle('light');
      if (nowLight) {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('cheat_theme', 'light');
        localStorage.setItem('theme', 'light'); // legacy compat
      } else {
        body.removeAttribute('data-theme');
        localStorage.setItem('cheat_theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeIcons();
    });

    themeToggle.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') themeToggle.click(); });
  }

  // --------- 6. Typing title (caret blink) ----------
  // small, non-blocking typewriter that reveals title and leaves caret blinking
  (function typingTitle() {
    const text = "Data Science Cheat Codes";
    const target = $('#typing-title');
    if (!target) return;
    let idx = 0;
    const speed = 80; // ms per char
    const caret = document.createElement('span');
    caret.className = 'live-caret';
    caret.textContent = "|";
    caret.setAttribute('aria-hidden','true');

    const span = document.createElement('span');
    span.className = 'live-gradient';
    target.innerHTML = '';
    target.appendChild(span);
    target.appendChild(caret);

    function step() {
      idx++;
      span.textContent = text.slice(0, idx);
      if (idx < text.length) {
        setTimeout(step, speed);
      } else {
        // finished: ensure full text and keep caret blinking
        span.textContent = text;
      }
    }
    setTimeout(step, 420);
    // caret blink via JS fallback if no CSS
    let visible = true;
    setInterval(() => { caret.style.opacity = (visible ? '1' : '0.15'); visible = !visible; }, 600);
  })();

  // --------- 7. Close mobile sidebar when clicking outside ----------
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('sidebar-open')) return;
    // if click outside sidebar area, close it
    if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      body.classList.remove('sidebar-open');
    }
  });

  // --------- 8. small accessibility niceties ----------
  // ensure links and interactive elements have keyboard focus outline in case CSS omits it
  $$('a, button, [role="button"]').forEach(el => {
    el.addEventListener('keydown', (ev) => {
      if (ev.key === ' ' || ev.key === 'Enter') ev.target.click && ev.target.click();
    });
  });

}); // DOMContentLoaded end
