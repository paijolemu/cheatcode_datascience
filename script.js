/* ================================================= */
/*        FILE JAVASCRIPT LENGKAP - VERSI FINAL        */
/* ================================================= */

// Jalankan SEMUA kode setelah struktur HTML halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. KONFIGURASI ANIMASI BACKGROUND (tsParticles) ---
    // Pastikan ini ada di dalam 'DOMContentLoaded'
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1.5, straight: false },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
        },
        detectRetina: true,
    });


    // --- 2. LOGIKA UNTUK MEMBUKA/MENUTUP SIDEBAR ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('sidebar-toggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('collapsed');
        });
    }


    // --- 3. LOGIKA UNTUK ANIMASI KARTU SAAT SCROLL ---
    const cards = document.querySelectorAll(".card");

    if (cards.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => {
            observer.observe(card);
        });
    }
});
