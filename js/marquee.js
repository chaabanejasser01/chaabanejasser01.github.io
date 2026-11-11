/* Infinite logo strip.
   Behavior ported from the React LogoMarquee / InfiniteSlider component:
   - the list is rendered twice and the track slides by half of its width, so the loop has no seam
   - reverse direction (moves to the right), 80 s per loop, 25 s while the pointer is over it
   - same edge fade (mask in CSS)
   Without JavaScript, or with "reduce motion" on, the logos stay as a static wrapped list. */
(function () {
  'use strict';

  var root = document.querySelector('[data-marquee]');
  if (!root || !root.animate) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DURATION = 80000;        // ms per loop
  var HOVER_DURATION = 25000;  // ms per loop while hovered
  var RATE_HOVER = DURATION / HOVER_DURATION;

  var track = root.querySelector('.marks');
  var items = Array.prototype.slice.call(track.children);

  // 4 copies in total (2 x 2), as in the original component; clones are hidden from screen readers
  for (var i = 0; i < 3; i++) {
    items.forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }
  root.classList.add('is-marquee');

  // reverse: from -50% to 0, i.e. the logos travel to the right
  var anim = track.animate(
    [{ transform: 'translateX(-50%)' }, { transform: 'translateX(0)' }],
    { duration: DURATION, iterations: Infinity, easing: 'linear' }
  );

  // ease the speed change instead of jumping between the two speeds
  var rate = 1, target = 1, raf = 0;
  function step() {
    rate += (target - rate) * 0.12;
    if (Math.abs(target - rate) < 0.01) rate = target;
    anim.updatePlaybackRate(rate);
    raf = rate === target ? 0 : requestAnimationFrame(step);
  }
  function setTarget(v) { target = v; if (!raf) raf = requestAnimationFrame(step); }
  root.addEventListener('pointerenter', function () { setTarget(RATE_HOVER); });
  root.addEventListener('pointerleave', function () { setTarget(1); });

  // do not animate off-screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { anim.play(); } else { anim.pause(); } });
    }).observe(root);
  }
})();
