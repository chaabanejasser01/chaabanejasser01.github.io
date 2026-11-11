(function () {
  'use strict';

  // Hero load sequence: start once fonts are ready (or after 600 ms at most), so text never jumps.
  var root = document.documentElement;
  var go = function () { requestAnimationFrame(function () { root.classList.add('is-ready'); document.dispatchEvent(new Event('portfolio:ready')); setTimeout(function () { root.classList.add('is-settled'); }, 2600); }); };
  var started = false;
  var start = function () { if (!started) { started = true; go(); } };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(start); setTimeout(start, 600); } else { start(); }

  // Copy email
  var btn = document.querySelector('[data-copy]');
  if (btn) {
    var label = btn.querySelector('.pill__label');
    var original = label.textContent;
    var timer;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        label.textContent = 'Copied';
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = original; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = 'mailto:' + text; });
      } else {
        window.location.href = 'mailto:' + text;
      }
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }

  // Demo videos start at the speed set in data-speed (the AMR demo is slow, so it plays at 2x).
  // It is applied once when the video loads; the visitor can still change it with the player's speed menu.
  [].slice.call(document.querySelectorAll('video[data-speed]')).forEach(function (v) {
    var rate = parseFloat(v.getAttribute('data-speed')) || 1;
    v.defaultPlaybackRate = rate;
    v.playbackRate = rate;
    v.addEventListener('loadedmetadata', function () { v.defaultPlaybackRate = rate; v.playbackRate = rate; });
  });
})();
