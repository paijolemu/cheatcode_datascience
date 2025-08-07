// GANTI SEMUA ISI script.js DENGAN INI
document.addEventListener('DOMContentLoaded', function () {
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
});

const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleBtn = document.getElementById('sidebar-toggle');
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
    });
}
function revealOnScroll() {
    const cards = document.querySelectorAll('.card');
    
    for (let i = 0; i < cards.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = cards[i].getBoundingClientRect().top;
        const elementVisible = 150; // Jarak dari bawah layar sebelum animasi dimulai

        if (elementTop < windowHeight - elementVisible) {
            cards[i].classList.add('is-visible');
        } else {
            // Opsional: Hapus kelas jika scroll ke atas lagi
            // cards[i].classList.remove('is-visible');
        }
    }
}

// Jalankan fungsi saat scroll dan saat halaman pertama kali dimuat
window.addEventListener('scroll', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);
