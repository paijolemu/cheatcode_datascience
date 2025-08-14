/* ================================================== */
/*       SCRIPT.JS FINAL - PERBAIKAN DARI COPILOT       */
/* ================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // 1. KONFIGURASI ANIMASI BACKGROUND
    if (document.getElementById("tsparticles")) {
        tsParticles.load("tsparticles", { /* ...konfigurasi partikel... */ });
    }

    // 2. LOGIKA SIDEBAR
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('collapsed');
        });
    }

    // 3. LOGIKA ANIMASI KARTU
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

    // 4. LOGIKA TOMBOL COPY
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

    // 5. LOGIKA LIGHT/DARK MODE
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Terapkan tema tersimpan saat memuat
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.setAttribute('data-theme', currentTheme);
        }

        // Tambahkan event listener untuk tombol
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
});
