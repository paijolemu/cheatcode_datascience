/* ================================================== */
/*        SCRIPT.JS FINAL DENGAN LIVE BACKGROUND BARU       */
/* ================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. KONFIGURASI ANIMASI BACKGROUND "LIVE" BARU ---
    if (document.getElementById("tsparticles")) {
        tsParticles.load("tsparticles", {
            background: {
                color: {
                    value: "transparent" // Mengikuti warna body
                }
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push" // Menambah partikel saat diklik
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse" // Partikel menjauh dari kursor
                    },
                    resize: true
                },
                modes: {
                    push: {
                        quantity: 4
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    }
                }
            },
            particles: {
                color: {
                    value: "#ffffff" // Warna partikel
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                collisions: {
                    enable: true
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce"
                    },
                    random: false,
                    speed: 2, // Kecepatan partikel
                    straight: false
                },
                number: {
                    density: {
                        enable: true,
                        area: 800
                    },
                    value: 80
                },
                opacity: {
                    value: 0.3
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 5 }
                }
            },
            detectRetina: true
        });
    }

    // --- 2. LOGIKA SIDEBAR ---
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('collapsed');
        });
    }

    // --- 3. LOGIKA ANIMASI KARTU ---
    // ... (kode animasi kartu Anda) ...

    // --- 4. LOGIKA TOMBOL COPY ---
    // ... (kode tombol copy Anda) ...

    // --- 5. LOGIKA LIGHT/DARK MODE ---
    // ... (kode light/dark mode Anda) ...

});
