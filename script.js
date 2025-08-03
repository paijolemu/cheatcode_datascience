// Inisialisasi tsParticles di elemen #tsparticles
tsParticles.load("tsparticles", {
  fullScreen: false,
  detectRetina: true,
  fpsLimit: 60,
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    move: { enable: true, speed: 2, outMode: "out" },
    links: { enable: true, distance: 120, color: "#ffffff", opacity: 0.4, width: 1 }
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
      resize: true
    },
    modes: { grab: { distance: 140, links: { opacity: 0.7 } }, push: { quantity: 4 } }
  }
});
