document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Jika elemen (kartu) masuk ke dalam viewport (terlihat di layar)
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                // Opsional: berhenti mengamati setelah animasi berjalan
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // Animasi dimulai saat 10% dari kartu terlihat
    });

    // Mulai amati setiap kartu
    cards.forEach(card => {
        observer.observe(card);
    });
});
