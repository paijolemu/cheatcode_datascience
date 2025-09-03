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

  // --- 2) Sidebar toggle & mobile overlay ---
  const sidebar = $('#sidebar');
  const overlay = $('#mobile-overlay'); // ensure you added this DIV to HTML
  const sidebarToggle = $('#sidebar-toggle');

  const isMobileWidth = () => window.innerWidth <= 768;
  let toggleLock = false;

  function safeToggleSidebar() {
    if (toggleLock) return;
    toggleLock = true;
    const mobile = isMobileWidth();
    if (mobile) {
      body.classList.toggle('sidebar-open');
      sidebarToggle?.setAttribute('aria-expanded', String(body.classList.contains('sidebar-open')));
    } else {
      body.classList.toggle('sidebar-collapsed');
      // For desktop aria-expanded describes whether menu is expanded; invert for collapsed state
      sidebarToggle?.setAttribute('aria-expanded', String(!body.classList.contains('sidebar-collapsed')));
    }
    setTimeout(() => { toggleLock = false; }, 420);
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => { e.preventDefault(); safeToggleSidebar(); });
    sidebarToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.code === 'Space') { e.preventDefault(); safeToggleSidebar(); }
    });
  }

  // overlay click closes mobile sidebar
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (body.classList.contains('sidebar-open')) body.classList.remove('sidebar-open');
    });
  }

  // auto-close mobile sidebar when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && body.classList.contains('sidebar-open')) {
      body.classList.remove('sidebar-open');
    }
  });

  // --- 3) Smooth & safe navigation for links (sidebar + post-nav) ---
  (function setupSafeLinks() {
    const navLinks = Array.from(document.querySelectorAll('#sidebar a, .post-nav a'));
    navLinks.forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href') || '';
        if (!href) return;

        // allow external links to behave normally
        try {
          const url = new URL(href, location.href);
          if (url.origin !== location.origin) return; // external
        } catch (err) {
          // relative link or hash - continue
        }

        // if anchor to same page (#id) -> smooth scroll
        if (href.startsWith('#')) {
          ev.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // close mobile sidebar if open
            if (body.classList.contains('sidebar-open')) body.classList.remove('sidebar-open');
            try { target.focus(); } catch(_) {}
          }
          return;
        }

        // if ctrl/meta clicked => open new tab: don't intercept
        if (ev.ctrlKey || ev.metaKey || ev.button !== 0) return;

        // if link points to missing file, browser will show 404; we still do fade UX
        ev.preventDefault();
        if (a.__navigating) return;
        a.__navigating = true;

        // close mobile sidebar before leaving
        if (body.classList.contains('sidebar-open')) body.classList.remove('sidebar-open');

        // micro fade-out then navigate
        document.documentElement.style.transition = 'opacity .22s ease';
        document.documentElement.style.opacity = '0';
        setTimeout(() => {
          window.location.href = a.href;
        }, 220);
      });
    });
  })();
  
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
// --- Post nav enhancements ---
(function(){
  const nav = document.querySelector('.post-nav');
  if (!nav) return;

  const prev = nav.querySelector('.post-nav-item.prev');
  const next = nav.querySelector('.post-nav-item.next');

  // helper: set thumbnail background from data-thumb or fallback gradient
  nav.querySelectorAll('.post-nav-item').forEach(item => {
    const thumbEl = item.querySelector('.nav-thumb');
    const url = item.getAttribute('data-thumb');
    if (url && thumbEl) {
      thumbEl.style.backgroundImage = `url('${url}')`;
    } else if (thumbEl) {
      // fallback: synthetic gradient using title initials
      const title = (item.querySelector('.nav-title')?.textContent || '').trim();
      // simple seeded gradient based on title hash
      let hash = 0;
      for (let i=0;i<title.length;i++){ hash = ((hash<<5)-hash) + title.charCodeAt(i); hash |= 0 }
      const hue = Math.abs(hash) % 360;
      thumbEl.style.backgroundImage = `linear-gradient(135deg, hsl(${hue} 80% 55% / 1), hsl(${(hue+60)%360} 70% 36% / 1))`;
      thumbEl.style.display = 'block';
    }

    // prefetch on hover to speed next navigation
    item.addEventListener('mouseenter', () => {
      const href = item.getAttribute('href');
      if (!href) return;
      // micro-prefetch: create rel=prefetch link only if not created yet
      if (!document.querySelector(`link[rel="prefetch"][data-href="${href}"]`)) {
        const l = document.createElement('link');
        l.rel = 'prefetch';
        l.href = href;
        l.setAttribute('data-href', href);
        document.head.appendChild(l);
      }
    }, {passive:true});
  });

  // keyboard navigation: left -> prev, right -> next
  document.addEventListener('keydown', (e) => {
    // ignore when focused in input/textarea
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
    if (e.key === 'ArrowLeft' && prev) {
      e.preventDefault();
      prev.focus({preventScroll:true});
      // small delay for better UX
      setTimeout(()=> window.location.href = prev.href, 80);
    } else if (e.key === 'ArrowRight' && next) {
      e.preventDefault();
      next.focus({preventScroll:true});
      setTimeout(()=> window.location.href = next.href, 80);
    }
  });

  // add visible focus when clicked via mouse (nice micro animation)
  [prev, next].forEach(el => {
    if (!el) return;
    el.addEventListener('click', (ev) => {
      // smooth fade-out then navigate (preserve normal behavior if ctrl/meta used)
      if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button !== 0) return;
      ev.preventDefault();
      document.documentElement.style.transition = 'opacity .22s ease';
      document.documentElement.style.opacity = '0';
      setTimeout(()=> window.location.href = el.href, 220);
    });
  });
})();
/* ----------------------------
   Init mini-sidebar behavior
   - set data-label for tooltips
   - keyboard focus expands sidebar temporarily
   ---------------------------- */
(function initMiniSidebar() {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  // set data-label from .nav-text for each link (used by CSS tooltip)
  const links = Array.from(sidebarEl.querySelectorAll('.nav-item a'));
  links.forEach(a => {
    const txtEl = a.querySelector('.nav-text');
    const label = (txtEl && txtEl.textContent.trim()) || a.textContent.trim() || a.getAttribute('aria-label') || '';
    if (label) a.setAttribute('data-label', label);
    // ensure links are focusable
    a.setAttribute('tabindex', '0');
  });

  // keyboard accessibility: on focus expand the mini sidebar temporarily
  links.forEach(a => {
    a.addEventListener('focus', () => {
      if (document.body.classList.contains('sidebar-collapsed')) {
        sidebarEl.classList.add('hover-expand'); // CSS uses .hover-expand to expand
      }
    });
    a.addEventListener('blur', () => {
      sidebarEl.classList.remove('hover-expand');
    });
    // also on mouseenter keep expanded (useful on touch or pointer)
    a.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('sidebar-collapsed')) {
        sidebarEl.classList.add('hover-expand');
      }
    });
    a.addEventListener('mouseleave', () => {
      sidebarEl.classList.remove('hover-expand');
    });
  });

  // If toggle button is focused/used, keep aria state in sync
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.code === 'Space') && document.body.classList.contains('sidebar-collapsed')) {
        // after toggling collapsed -> if collapsed, ensure focus expansion works
        setTimeout(() => { sidebarEl.classList.remove('hover-expand'); }, 50);
      }
    });
  }

})();

}); // DOMContentLoaded end
