/* StartBox Ventures — motion and small interactions. No dependencies. */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    });
  }

  /* Scroll progress + process line */
  var bar = document.querySelector('.progress');
  var steps = document.querySelector('.steps');
  var fill = steps && steps.querySelector('.steps-fill');
  var stepEls = steps ? steps.querySelectorAll('.step') : [];
  var ticking = false;
  function onScroll() {
    var h = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    if (fill) {
      var r = steps.getBoundingClientRect();
      var mid = window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      fill.style.height = (p * (r.height - 16)) + 'px';
      stepEls.forEach(function (s) { s.classList.toggle('lit', s.getBoundingClientRect().top < mid); });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* Reveal on scroll */
  var targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger], .frame');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-reveal-stagger')) {
          Array.prototype.forEach.call(el.children, function (c, i) { c.style.transitionDelay = (i * 80) + 'ms'; });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* Count-up numbers */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    if (reduce) { el.textContent = end; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* Hero diagnosis card: symptom -> diagnosis -> prescription, cycling */
  var dx = document.querySelector('.dx');
  if (dx) {
    var cases = JSON.parse(dx.getAttribute('data-cases'));
    var rows = dx.querySelectorAll('.dx-row');
    var vals = dx.querySelectorAll('.dx-v');
    var i = 0;
    function type(el, text, done) {
      if (reduce) { el.textContent = text; done(); return; }
      el.textContent = ''; el.classList.add('caret');
      var n = 0;
      (function tick() {
        n++; el.textContent = text.slice(0, n);
        if (n < text.length) setTimeout(tick, 22);
        else { el.classList.remove('caret'); done(); }
      })();
    }
    function play() {
      var c = cases[i % cases.length]; i++;
      rows.forEach(function (r) { r.classList.remove('on'); });
      dx.classList.remove('scanning'); void dx.offsetWidth; dx.classList.add('scanning');
      setTimeout(function () {
        rows[0].classList.add('on');
        type(vals[0], c[0], function () {
          setTimeout(function () {
            rows[1].classList.add('on');
            type(vals[1], c[1], function () {
              setTimeout(function () {
                rows[2].classList.add('on');
                type(vals[2], c[2], function () { if (!reduce) setTimeout(play, 3600); });
              }, 450);
            });
          }, 450);
        });
      }, reduce ? 0 : 1200);
    }
    setTimeout(play, reduce ? 0 : 900);
  }

  /* Work page filter */
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    var briefs = document.querySelectorAll('.brief');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        briefs.forEach(function (b) { b.hidden = !(f === 'all' || (' ' + b.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1); });
      });
    });
  }

  /* Contact form -> WhatsApp message (no data stored on our side) */
  var form = document.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hi StartBox, I would like to book a free discovery call.\n\n' +
        'Name: ' + d.get('name') + '\n' +
        'Business: ' + d.get('business') + '\n' +
        'Type: ' + d.get('type') + '\n' +
        'What I want to improve: ' + d.get('goal');
      window.open('https://wa.me/919696439231?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
