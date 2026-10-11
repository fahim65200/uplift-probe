(function () {
  // mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // footer year
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // image viewer
  var box = document.querySelector('.lightbox');
  if (box && box.showModal) {
    var big = box.querySelector('img');
    var cap = box.querySelector('.lb-cap');
    document.querySelectorAll('a.zoom').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        big.src = a.getAttribute('href');
        big.alt = a.dataset.cap || '';
        cap.textContent = a.dataset.cap || '';
        box.showModal();
      });
    });
    box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (ev) { if (ev.target === box) box.close(); });
  }

  // news filter
  var list = document.querySelector('[data-filter-list]');
  if (list) {
    var chips = document.querySelectorAll('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.dataset.filter;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        list.querySelectorAll('.card').forEach(function (card) {
          card.hidden = !(want === 'all' || card.dataset.kind === want);
        });
      });
    });
  }

  // slide decks
  document.querySelectorAll('[data-deck]').forEach(function (deck) {
    var track = deck.querySelector('.deck-track');
    var slides = track.children;
    var prev = deck.querySelector('[data-prev]');
    var next = deck.querySelector('[data-next]');
    var count = deck.querySelector('[data-count]');
    function current() {
      return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    }
    function update() {
      var i = current();
      count.textContent = (i + 1) + ' of ' + slides.length;
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    }
    function go(i) {
      var s = slides[Math.max(0, Math.min(slides.length - 1, i))];
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
    track.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(current() + 1); }
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(current() - 1); }
    });
    update();
  });

  // contact form: builds an email, stores nothing
  var form = document.querySelector('form[data-mailto]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = new FormData(form);
      var body = f.get('message') + '\n\n' + f.get('name');
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(f.get('subject')) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
