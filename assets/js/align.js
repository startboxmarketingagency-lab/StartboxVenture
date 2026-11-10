/* StartBox Ventures — home hero: chaos to alignment.
   Scroll drives one story: a sample business looks different on six platforms, diagnosis
   pins drop onto the problems (Penny's labelled cursor places them), then every platform
   straightens, lines up and takes one voice while the headline changes.
   Runs only when site.js has added .motion (libraries loaded, no reduced-motion request);
   otherwise the scattered board and pins stay visible as a still image. */
(function () {
  function start() {
    var root = document.documentElement;
    var sec = document.querySelector('.ca');
    if (!sec || !window.gsap || !window.ScrollTrigger || !root.classList.contains('motion')) return;
    var G = window.gsap;
    G.registerPlugin(window.ScrollTrigger);

    var stage = sec.querySelector('.ca-stage');
    var board = sec.querySelector('.ca-board');
    var cards = [].slice.call(board.querySelectorAll('.tp'));
    var pins = [].slice.call(board.querySelectorAll('.pin'));
    var cursor = board.querySelector('.p-cursor');
    var before = sec.querySelectorAll('.ca-before .ln > span');
    var after = sec.querySelectorAll('.ca-after .ln > span');
    var css = function (el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); };

    // Headline lines rise in once on load.
    G.from(before, { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.09, delay: 0.15 });
    G.from(cards, { autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.07, delay: 0.35 });

    var afterBox = sec.querySelector('.ca-after');
    G.set(after, { yPercent: 115 });
    // Scattered state comes from each card's CSS variables.
    cards.forEach(function (c) { G.set(c, { rotation: parseFloat(css(c, '--cr')) || 0 }); });

    var mm = G.matchMedia();
    mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (ctx) {
      var desk = ctx.conditions.desk;
      var tl = G.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: { trigger: stage, start: desk ? 'top top' : 'bottom bottom', end: desk ? '+=230%' : '+=170%', pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1 }
      });

      // 1. Diagnosis: Penny's cursor travels to each problem and drops a pin.
      tl.set(cursor, { left: '50%', top: '40%' });
      tl.to(cursor, { autoAlpha: 1, duration: 0.2 });
      pins.forEach(function (p) {
        tl.to(cursor, { left: 'calc(' + css(p, '--px') + ' - 18px)', top: 'calc(' + css(p, '--py') + ' - 14px)', duration: 0.5 });
        tl.fromTo(p, { autoAlpha: 0, y: -24, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
      });
      tl.to({}, { duration: 0.35 });

      // 2. Alignment: pins lift away, every platform straightens into one grid and one voice.
      tl.addLabel('align');
      tl.to(pins, { autoAlpha: 0, y: -16, duration: 0.3, stagger: 0.04 }, 'align');
      tl.to(cursor, { autoAlpha: 0, duration: 0.2 }, 'align');
      cards.forEach(function (c) {
        tl.to(c, { left: css(c, '--ax'), top: css(c, '--ay'), width: '32%', height: '46%', rotation: 0, duration: 1 }, 'align+=0.15');
        tl.to(c.querySelector('.tp-x'), { autoAlpha: 0, duration: 0.4 }, 'align+=0.55');
        tl.to(c.querySelector('.tp-o'), { autoAlpha: 1, duration: 0.45 }, 'align+=0.6');
      });
      tl.to(before, { yPercent: -115, duration: 0.5, stagger: 0.05, ease: 'power3.in' }, 'align+=0.1');
      tl.set(afterBox, { visibility: 'visible' }, 'align+=0.5');
      tl.fromTo(after, { yPercent: 115 }, { yPercent: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }, 'align+=0.55');
      tl.to({}, { duration: 0.5 });
      return function () { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
    });
  }
  function go() { start(); if (window.ScrollTrigger) { window.ScrollTrigger.sort(); window.ScrollTrigger.refresh(); } }
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
