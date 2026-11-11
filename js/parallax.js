/* Subtle parallax.
   A few elements drift at slightly different speeds while you scroll, so the page gains depth without moving much:
   at most about 6 to 12 percent of the scroll distance, and never more than MAX pixels.

   How to use: data-parallax="0.08"   positive = lags behind the scroll (feels farther away), negative = moves ahead.
               data-parallax-from="top"  measure from the top of the page (hero); default measures from the viewport centre.

   It moves elements with the CSS "translate" property, so it never fights the entrance animations (they use "transform").
   It is off when the visitor asks for reduced motion, and also when the browser does not support "translate". */
(function () {
  'use strict';

  if (!window.CSS || !CSS.supports || !CSS.supports('translate', '0 1px')) return;

  var MAX = 80;           // px, hard cap on how far anything can shift
  var SMALL = 0.6;        // gentler on narrow screens

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;
  var items = [].slice.call(document.querySelectorAll('[data-parallax]')).map(function (el) {
    return {
      el: el,
      speed: parseFloat(el.getAttribute('data-parallax')) || 0,
      fromTop: el.getAttribute('data-parallax-from') === 'top',
      base: 0,   // centre of the element in the page, measured without any shift applied
      half: 0,   // half of its height
      y: 0,      // shift currently applied
      on: true   // near the viewport
    };
  });
  if (!items.length) return;

  var enabled = false, ticking = false, io = null;

  function measure() {
    var sy = window.pageYOffset;
    items.forEach(function (it) {
      var r = it.el.getBoundingClientRect();
      it.half = r.height / 2;
      it.base = r.top + sy + it.half - it.y;        // subtract the shift so measuring never feeds back into itself
    });
  }

  function clamp(v) { return Math.max(-MAX, Math.min(MAX, v)); }

  // Offset (in scroll units) used to compute the shift. It is clamped, never cut off, so the motion stays continuous:
  // an element simply stops drifting once it is far from the screen, instead of snapping back.
  //  - normal elements: 0 when centred in the viewport, growing as it moves away (up to +/- 0.9 viewport heights)
  //  - hero pieces (data-parallax-from="top"): the scroll position itself, up to 0.8 viewport heights
  function shiftFor(it, sy, vh) {
    var d;
    if (it.fromTop) {
      d = Math.min(sy, vh * 0.8);
    } else {
      d = (sy + vh / 2) - it.base;
      d = Math.max(-vh * 0.9, Math.min(vh * 0.9, d));
    }
    return d * it.speed;
  }

  function update() {
    ticking = false;
    var sy = window.pageYOffset, vh = window.innerHeight;
    var k = window.innerWidth < 680 ? SMALL : 1;
    items.forEach(function (it) {
      if (!it.on) return;
      var y = Math.round(clamp(shiftFor(it, sy, vh) * k) * 10) / 10;
      if (y !== it.y) { it.y = y; it.el.style.translate = '0 ' + y + 'px'; }
    });
  }

  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function onResize() { measure(); request(); }

  function enable() {
    if (enabled) return;
    enabled = true;
    root.classList.add('parallax-on');
    measure();
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          for (var i = 0; i < items.length; i++) { if (items[i].el === e.target) { items[i].on = e.isIntersecting; } }
        });
        request();
      }, { rootMargin: '25% 0px 25% 0px' });
      items.forEach(function (it) { io.observe(it.el); });
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(onResize); }
    update();
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    root.classList.remove('parallax-on');
    window.removeEventListener('scroll', request);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', onResize);
    if (io) { io.disconnect(); io = null; }
    items.forEach(function (it) { it.y = 0; it.on = true; it.el.style.translate = ''; });
  }

  function sync() { if (mq.matches) { disable(); } else { enable(); } }
  sync();
  if (mq.addEventListener) { mq.addEventListener('change', sync); } else if (mq.addListener) { mq.addListener(sync); }
})();
