const Jumpscare = {
  screen: null,
  img: null,

  // Gambar placeholder jumpscare (nanti bisa diganti gambar asli)
  images: [
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23000"/><text x="200" y="180" font-size="120" text-anchor="middle" fill="%23f00">👻</text><text x="200" y="280" font-size="48" text-anchor="middle" fill="%23fff" font-family="monospace">BOO!</text></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23000"/><text x="200" y="180" font-size="120" text-anchor="middle" fill="%23f00">💀</text><text x="200" y="280" font-size="48" text-anchor="middle" fill="%23fff" font-family="monospace">MATI!</text></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23000"/><text x="200" y="180" font-size="120" text-anchor="middle" fill="%23f00">😱</text><text x="200" y="280" font-size="48" text-anchor="middle" fill="%23fff" font-family="monospace">AHHH!</text></svg>',
  ],

  init() {
    this.screen = document.getElementById('screen-jumpscare');
    this.img    = document.getElementById('jumpscare-img');
  },

  show(reason, callback) {
    const random = this.images[Math.floor(Math.random() * this.images.length)];
    this.img.src = random;
    this.screen.classList.remove('hidden');

    // Flash merah di background
    document.body.style.background = '#600';
    setTimeout(() => { document.body.style.background = '#000'; }, 150);

    setTimeout(() => {
      this.screen.classList.add('hidden');
      callback();
    }, 1500);
  },
};