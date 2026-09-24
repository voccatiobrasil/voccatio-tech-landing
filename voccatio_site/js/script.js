(function () {
  'use strict';

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Carousels (services / testimonials)
     Structure expected:
       [data-carousel="name"] > .carousel-track > li (cards)
       [data-carousel-controls="name"] > .arrow-btn[data-dir]
       [data-carousel-dots="name"]  (dot buttons injected here)
  --------------------------------------------------------- */
  function initCarousel(name) {
    var root = document.querySelector('[data-carousel="' + name + '"]');
    var controls = document.querySelector('[data-carousel-controls="' + name + '"]');
    var dotsHost = document.querySelector('[data-carousel-dots="' + name + '"]');
    if (!root) return;

    var track = root.querySelector('.carousel-track');
    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;

    // Build dot indicators
    var dots = [];
    if (dotsHost) {
      items.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir para item ' + (i + 1));
        b.addEventListener('click', function () { scrollToIndex(i); });
        dotsHost.appendChild(b);
        dots.push(b);
      });
    }

    // Position of each item relative to the track's own scrollable content
    // (offsetLeft is unreliable here since no ancestor is positioned).
    function itemOffset(item) {
      var trackRect = track.getBoundingClientRect();
      var itemRect = item.getBoundingClientRect();
      return (itemRect.left - trackRect.left) + track.scrollLeft;
    }

    function currentIndex() {
      var trackLeft = track.scrollLeft;
      var closest = 0;
      var closestDist = Infinity;
      items.forEach(function (item, i) {
        var dist = Math.abs(itemOffset(item) - trackLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      var idx = currentIndex();
      dots.forEach(function (d, i) {
        d.setAttribute('aria-current', i === idx ? 'true' : 'false');
      });
    }

    function scrollToIndex(i) {
      var clamped = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: itemOffset(items[clamped]), behavior: 'smooth' });
    }

    if (controls) {
      controls.querySelectorAll('.arrow-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var dir = parseInt(btn.getAttribute('data-dir'), 10) || 1;
          scrollToIndex(currentIndex() + dir);
        });
      });
    }

    var scrollTimeout;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateDots, 80);
    });

    updateDots();
  }

  initCarousel('services');
  initCarousel('testimonials');

  /* ---------------------------------------------------------
     Contact form (client-side only — no backend wired up)
  --------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      if (!form.checkValidity()) {
        status.textContent = 'Preencha todos os campos antes de enviar.';
        return;
      }
      status.textContent = 'Obrigado, ' + name.split(' ')[0] + '! Vamos responder em breve.';
      form.reset();
    });
  }
})();
