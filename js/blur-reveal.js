/* Blur reveal, word by word.
   Port of the React <BlurReveal> component (motion/react): each word starts transparent, blurred (10px) and 20% low,
   then fades in, sharpens and rises once the title is in view. It runs only once per title.
   Usage: add data-blur to a heading. data-blur="hero" waits for the page's load sequence (fonts ready) first.
   Without JavaScript the title is just visible; with "reduce motion" the words fade in without blur or movement. */
(function () {
  'use strict';

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-blur]'));
  if (!els.length) return;

  var MAX_STAGGER = 0.5;   // seconds across the whole title (the component's delay step is 0.1 s per word)
  var STEP = 0.1;

  // Wrap every word in a span, keeping nested elements (like the gray span) in place.
  function split(node, words) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.nodeValue.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'blur-word';
          w.textContent = part;
          words.push(w);
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        split(child, words);
      }
    });
  }

  function whenReady(el, fn) {
    if (el.getAttribute('data-blur') !== 'hero' || document.documentElement.classList.contains('is-ready')) { fn(); return; }
    document.addEventListener('portfolio:ready', fn, { once: true });
  }

  els.forEach(function (el) {
    var words = [];
    split(el, words);
    var step = words.length > 1 ? Math.min(STEP, MAX_STAGGER / (words.length - 1)) : STEP;
    el.style.setProperty('--step', step + 's');
    words.forEach(function (w, i) { w.style.setProperty('--i', i); });
    el.classList.add('is-split');

    var reveal = function () { requestAnimationFrame(function () { el.classList.add('is-revealed'); }); };
    if (!('IntersectionObserver' in window)) { whenReady(el, reveal); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); whenReady(el, reveal); }
    }, { threshold: 0.2 });
    io.observe(el);
  });
})();
