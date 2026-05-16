const Jumpscare = {
  screen: null,
  img: null,

  // Gambar placeholder jumpscare (nanti bisa diganti gambar asli)
  images: [
    'assets/images/hoo.jpg'
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