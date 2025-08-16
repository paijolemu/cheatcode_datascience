/* ======================================================= */
/*      SCRIPT.JS FINAL LENGKAP - SEMUA FITUR DIPERBAIKI      */
/* ======================================================= */

// Jalankan semua fungsi setelah struktur HTML halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. KONFIGURASI ANIMASI BACKGROUND "LIVE" ---
    if (document.getElementById("tsparticles")) {
        tsParticles.load("tsparticles", {
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: { enable: true, mode: "push" },
                    onHover: { enable: true, mode: "repulse" },
                    resize: true
                },
                modes: {
                    push: { quantity: 4 },
                    repulse: { distance: 150, duration: 0.4 }
                }
            },
            particles: {
                color: { value: "#ffffff" },
                links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
                collisions: { enable: true },
                move: {
                    direction: "none", enable: true, outModes: { default: "bounce" },
                    random: false, speed: 2, straight: false
                },
                number: { density: { enable: true, area: 800 }, value: 80 },
                opacity: { value: 0.3 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 5 } }
            },
            detectRetina: true
        });
    }

    // --- 2. LOGIKA SIDEBAR (DESKTOP & MOBILE) ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                sidebar.classList.toggle('open');
                mainContent.classList.toggle('sidebar-open');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('collapsed');
            }
        });
    }

    // --- 3. LOGIKA ANIMASI KARTU SAAT SCROLL ---
    const cards = document.querySelectorAll(".card");
    if (cards.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cards.forEach(card => { observer.observe(card); });
    }

    // --- 4. LOGIKA TOMBOL COPY KODE ---
    const copyButtons = document.querySelectorAll(".copy-button");
    copyButtons.forEach(button => {
        button.addEventListener("click", () => {
            const codeBlock = button.closest('.code-block');
            const preElement = codeBlock.querySelector('pre');
            if (preElement) {
                navigator.clipboard.writeText(preElement.innerText).then(() => {
                    button.innerText = "Copied!";
                    setTimeout(() => { button.innerText = "Copy"; }, 2000);
                });
            }
        });
    });

    // --- 5. LOGIKA LIGHT/DARK MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.setAttribute('data-theme', currentTheme);
        }
        themeToggle.addEventListener('click', () => {
            let theme = document.body.getAttribute('data-theme');
            if (theme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 6. LOGIKA UNTUK ANIMASI KETIKAN JUDUL ---
// --- 6. LOGIKA UNTUK ANIMASI KETIKAN JUDUL ---
    const typingTitle = document.getElementById('typing-title');
    if (typingTitle) {
        const textToType = "Data Science Cheat Codes";
        let index = 0;
        typingTitle.innerHTML = ''; // Ensure it's empty before starting
    
        function type() {
            if (index < textToType.length) {
                typingTitle.innerHTML += textToType.charAt(index);
                index++;
                setTimeout(type, 150);
            } else {
                // === THIS IS THE FIX ===
                // When typing is done, remove the right border (the cursor)
                typingTitle.style.borderRight = 'none';
            }
        }
        setTimeout(type, 500); // Start the animation
    }
}); // <-- Penutup DOMContentLoaded
