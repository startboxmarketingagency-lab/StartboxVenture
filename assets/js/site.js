/* StartBox Ventures — motion and interactions.
   Libraries (self-hosted, /assets/vendor): GSAP + ScrollTrigger + SplitText + Flip, Lenis.
   The page is fully readable without them; .motion is only added when they load
   and the visitor has not asked for reduced motion. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText, Flip = window.Flip;
  var canAnimate = !reduce && G && ST && Split;

  /* ---------- Always-on basics ---------- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; if (window.__lenis) window.__lenis.start(); }
    });
  }

  var form = document.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hi StartBox, I would like to book a free discovery call.\n\nName: ' + d.get('name') + '\nBusiness: ' + d.get('business') + '\nType: ' + d.get('type') + '\nWhat I want to improve: ' + d.get('goal');
      window.open('https://wa.me/919696439231?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* Hero diagnosis card: symptom -> diagnosis -> fix, cycling */
  var dx = document.querySelector('.dx');
  if (dx) {
    var cases = JSON.parse(dx.getAttribute('data-cases'));
    var rows = dx.querySelectorAll('.dx-row'), vals = dx.querySelectorAll('.dx-v'), ci = 0;
    var type = function (el, text, done) {
      if (reduce) { el.textContent = text; done(); return; }
      el.textContent = ''; el.classList.add('caret');
      var n = 0;
      (function tick() { n++; el.textContent = text.slice(0, n); if (n < text.length) setTimeout(tick, 22); else { el.classList.remove('caret'); done(); } })();
    };
    var play = function () {
      var c = cases[ci % cases.length]; ci++;
      rows.forEach(function (r) { r.classList.remove('on'); });
      dx.classList.remove('scanning'); void dx.offsetWidth; dx.classList.add('scanning');
      setTimeout(function () {
        rows[0].classList.add('on');
        type(vals[0], c[0], function () { setTimeout(function () {
          rows[1].classList.add('on');
          type(vals[1], c[1], function () { setTimeout(function () {
            rows[2].classList.add('on');
            type(vals[2], c[2], function () { if (!reduce) setTimeout(play, 3600); });
          }, 450); });
        }, 450); });
      }, reduce ? 0 : 1000);
    };
    dx.__play = play;
  }

  /* Work filter (animated with Flip when available) */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var briefs = document.querySelectorAll('.brief');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        var state = canAnimate && Flip ? Flip.getState(briefs) : null;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        briefs.forEach(function (b) { b.hidden = !(f === 'all' || (' ' + b.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1); });
        if (state) {
          Flip.from(state, { duration: .7, ease: 'expo.out', stagger: .02, absolute: true,
            onEnter: function (els) { return G.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out', stagger: .03 }); },
            onLeave: function (els) { return G.to(els, { opacity: 0, duration: .2 }); },
            onComplete: function () { ST.refresh(); } });
        }
      });
    });
  }

  /* ---------- Fallback: no animation libraries or reduced motion ---------- */
  if (!canAnimate) {
    doc.classList.remove('first');
    document.querySelectorAll('.frame').forEach(function (f) { f.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
    document.querySelectorAll('.step').forEach(function (s) { s.classList.add('lit'); });
    if (dx) dx.__play();
    return;
  }

  /* ---------- Motion ---------- */
  doc.classList.add('motion');
  G.registerPlugin(ST, Split);
  if (Flip) G.registerPlugin(Flip);
  var ease = 'expo.out';

  /* Smooth scroll */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    window.__lenis = lenis;
    lenis.on('scroll', ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -88 }); }
    });
  }

  /* Header: hide on scroll down, show on scroll up; progress bar */
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.progress');
  var lastY = 0;
  var onScroll = function () {
    var y = window.scrollY, h = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    if (header && !(nav && nav.classList.contains('open'))) header.classList.toggle('is-hidden', y > 240 && y > lastY);
    lastY = y;
  };
  if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });

  /* Split headings into masked lines */
  var splitReveal = function (el, opts) {
    Split.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit: function (self) {
        return G.from(self.lines, Object.assign({ yPercent: 110, duration: 1.2, ease: ease, stagger: .09 }, opts || {}));
      }
    });
  };

  /* Intro: preloader (first visit per session), then hero */
  var hero = document.querySelector('.hero2, .hero, .article-head');
  var heroTitle = hero && hero.querySelector('h1');
  var introItems = hero ? hero.querySelectorAll('.label, .lead, .btn-row, .hero2-meta, .crumbs, .article-meta, .dx, .frame') : [];
  var startHero = function () {
    if (heroTitle) splitReveal(heroTitle, { delay: .05 });
    var tweenItems = [], cssItems = [];
    Array.prototype.forEach.call(introItems, function (el) { (el.hasAttribute('data-reveal') || el.classList.contains('frame') ? cssItems : tweenItems).push(el); });
    if (tweenItems.length) G.from(tweenItems, { y: 32, opacity: 0, duration: 1.1, ease: ease, stagger: .08, delay: .25, clearProps: 'transform,opacity' });
    cssItems.forEach(function (el, i) { setTimeout(function () { el.classList.add('in'); }, 300 + i * 120); });
    if (dx) setTimeout(dx.__play, 600);
  };

  if (doc.classList.contains('first') && document.querySelector('.loader')) {
    var lb = '.loader-box ';
    var tl = G.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: function () {
      try { sessionStorage.setItem('sbv-seen', '1'); } catch (e) {}
      doc.classList.remove('first'); startHero(); ST.refresh();
    } });
    tl.from(lb + '.l', { scaleY: 0, duration: .5 })
      .from(lb + '.b', { scaleX: 0, duration: .45 }, '-=.15')
      .from(lb + '.r', { scaleY: 0, duration: .4 }, '-=.1')
      .from(lb + '.t', { scaleX: 0, duration: .4 }, '-=.25')
      .from(lb + '.sq', { x: -60, y: 60, scale: .2, opacity: 0, duration: .6, ease: 'back.out(2)' }, '-=.15')
      .from('.loader-word', { opacity: 0, y: 12, duration: .4 }, '-=.3')
      .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: .8, ease: 'expo.inOut' }, '+=.25');
  } else {
    doc.classList.remove('first');
    startHero();
  }

  /* Section headings */
  document.querySelectorAll('.sec-head h2, .cta-band h2, .hs-intro h2, .proc-side h2, section h2[data-split]').forEach(function (h) {
    if (hero && hero.contains(h)) return;
    Split.create(h, { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit: function (self) { return G.from(self.lines, { yPercent: 110, duration: 1.1, ease: ease, stagger: .08, scrollTrigger: { trigger: h, start: 'top 88%', once: true } }); } });
  });

  /* Generic reveals */
  ST.batch('[data-reveal], [data-reveal-stagger], .frame', {
    start: 'top 88%', once: true,
    onEnter: function (els) {
      els.forEach(function (el, i) {
        if (el.hasAttribute('data-reveal-stagger')) Array.prototype.forEach.call(el.children, function (c, j) { c.style.transitionDelay = (j * 70) + 'ms'; });
        setTimeout(function () { el.classList.add('in'); }, i * 90);
      });
    }
  });

  /* Count-up */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10), o = { v: 0 };
    G.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(o.v); } });
  });

  var mm = G.matchMedia();

  /* Horizontal problems (desktop pins, small screens swipe) */
  document.querySelectorAll('.hs').forEach(function (sec) {
    var track = sec.querySelector('.hs-track'), fill = sec.querySelector('.hs-progress i');
    mm.add('(min-width: 901px)', function () {
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
      G.to(track, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: function (self) { if (fill) fill.style.transform = 'scaleX(' + self.progress + ')'; } } });
      G.utils.toArray(sec.querySelectorAll('.hs-card')).forEach(function (card, i) {
        G.from(card, { y: 60 + (i % 2) * 40, opacity: .2, duration: 1, ease: ease, scrollTrigger: { trigger: sec, start: 'top 70%', once: true }, delay: i * .06 });
      });
    });
    mm.add('(max-width: 900px)', function () { sec.classList.add('no-pin'); return function () { sec.classList.remove('no-pin'); }; });
  });

  /* Process: steps light up as they pass, counter follows */
  var proc = document.querySelector('.proc');
  var steps = document.querySelectorAll('.steps .step');
  var count = document.querySelector('.proc-count b');
  var fillLine = document.querySelector('.steps-fill');
  steps.forEach(function (s, i) {
    ST.create({ trigger: s, start: 'top 62%', end: 'bottom 62%',
      onToggle: function (self) { if (self.isActive || self.direction === 1) s.classList.add('lit'); if (self.isActive && count) count.textContent = String(i + 1).padStart(2, '0'); },
      onLeaveBack: function () { if (i > 0) s.classList.remove('lit'); } });
  });
  var stepsWrap = document.querySelector('.steps');
  if (stepsWrap && fillLine) {
    ST.create({ trigger: stepsWrap, start: 'top 62%', end: 'bottom 62%', scrub: true,
      onUpdate: function (self) { fillLine.style.height = (self.progress * (stepsWrap.offsetHeight - 16)) + 'px'; } });
  }

  /* Marquee rows: constant drift, speed and direction follow scrolling */
  var rowsTl = [];
  document.querySelectorAll('.mq-row').forEach(function (row) {
    var rev = row.classList.contains('alt');
    var t = G.fromTo(row, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 40, ease: 'none', repeat: -1 });
    rowsTl.push(t);
  });
  if (rowsTl.length) {
    ST.create({ start: 0, end: 'max', onUpdate: function (self) {
      var v = Math.min(5, 1 + Math.abs(self.getVelocity()) / 400);
      rowsTl.forEach(function (t) { G.to(t, { timeScale: v * (self.direction || 1), duration: .2, overwrite: true }); G.to(t, { timeScale: self.direction || 1, duration: 1.2, delay: .25 }); });
    } });
  }

  /* Parallax depth */
  document.querySelectorAll('[data-speed]').forEach(function (el) {
    var sp = parseFloat(el.getAttribute('data-speed')) || .2;
    G.to(el, { yPercent: -sp * 40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Section colour wipe when entering ivory sections */
  document.querySelectorAll('.section.light').forEach(function (sec) {
    G.fromTo(sec, { clipPath: 'inset(6% 4% 0 4%)' }, { clipPath: 'inset(0% 0% 0 0%)', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 35%', scrub: true } });
  });

  /* Cursor + magnetic buttons (fine pointers only) */
  mm.add('(hover: hover) and (pointer: fine)', function () {
    var cur = document.querySelector('.cursor');
    if (!cur) return;
    var label = cur.querySelector('span');
    var xTo = G.quickTo(cur, 'x', { duration: .45, ease: 'power3' }), yTo = G.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
    var move = function (e) { xTo(e.clientX); yTo(e.clientY); };
    var over = function (e) {
      var v = e.target.closest('[data-cursor]');
      var l = e.target.closest('a, button, summary, input, select, textarea, label');
      cur.classList.toggle('is-view', !!v);
      cur.classList.toggle('is-link', !v && !!l);
      if (v && label) label.textContent = v.getAttribute('data-cursor');
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    var mags = document.querySelectorAll('.btn-gold, .magnetic, .svc-row .arr');
    var handlers = [];
    mags.forEach(function (m) {
      var mx = G.quickTo(m, 'x', { duration: .6, ease: 'elastic.out(1, .4)' }), my = G.quickTo(m, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      var mv = function (e) { var r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .3); my((e.clientY - r.top - r.height / 2) * .35); };
      var lv = function () { mx(0); my(0); };
      m.addEventListener('mousemove', mv); m.addEventListener('mouseleave', lv);
      handlers.push([m, mv, lv]);
    });
    return function () {
      window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over);
      handlers.forEach(function (h) { h[0].removeEventListener('mousemove', h[1]); h[0].removeEventListener('mouseleave', h[2]); });
    };
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  window.addEventListener('load', function () { ST.refresh(); });
})();
