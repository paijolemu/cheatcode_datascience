document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const plotGallery = document.getElementById('plot-gallery');
    const plotCards = plotGallery.getElementsByClassName('plot-card');

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        for (let i = 0; i < plotCards.length; i++) {
            const card = plotCards[i];
            const title = card.getAttribute('data-title').toLowerCase();

            // Jika judul kartu mengandung kata pencarian, tampilkan. Jika tidak, sembunyikan.
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
});
