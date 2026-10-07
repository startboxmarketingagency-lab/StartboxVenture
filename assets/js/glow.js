/* StartBox Ventures — live "liquid gold" backgrounds and spotlight glow.
   A small WebGL shader renders moving light in brand colours behind the hero and the
   closing call to action. It works like a background video without downloading one:
   it renders at reduced resolution, pauses when off screen, draws a single still frame
   for visitors who prefer reduced motion, and falls back to a CSS glow without WebGL. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    'precision mediump float;',
    'uniform vec2 r;uniform float t;uniform vec2 m;uniform float v;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}',
    'float fbm(vec2 p){float s=0.,a=.5;mat2 k=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){s+=a*n(p);p=k*p;a*=.5;}return s;}',
    'void main(){',
    ' vec2 p=(gl_FragCoord.xy-.5*r)/r.y;',
    ' float T=t*.045;',
    ' vec2 q=vec2(fbm(p*1.3+vec2(0.,T)),fbm(p*1.3+vec2(5.2,-T)));',
    ' vec2 w=vec2(fbm(p*1.7+q*1.9+vec2(1.7,9.2)+T*1.4),fbm(p*1.7+q*1.9+vec2(8.3,2.8)-T));',
    ' float f=fbm(p*1.15+w*1.7);',
    // silk-like folds of light
    ' float b=sin((f*5.5+p.x*1.2-p.y*.6)*3.14159);',
    ' float silk=pow(smoothstep(.72,1.,b),1.6)*.95+pow(f,4.)*1.1;',
    // light gathers towards the upper right, away from the headline
    ' float focus=smoothstep(-1.1,.9,p.x*.9+p.y*.6+v*.3);',
    ' float md=length(p-m);float glow=exp(-md*md*2.6)*.28;',
    ' vec3 ink=vec3(.039);vec3 gold=vec3(.769,.6,.165);vec3 ivory=vec3(.957,.945,.918);',
    ' vec3 c=ink+gold*(silk*.55*focus+glow*.8)+vec3(.02,.015,.005)*f;',
    ' c+=ivory*pow(max(silk*focus-.55,0.),1.6)*.7;',
    ' c=mix(c,ink,smoothstep(.15,-.7,p.y)*.55);',
    ' c+=(h(gl_FragCoord.xy+fract(t))-.5)*.035;',
    ' gl_FragColor=vec4(c,1.);',
    '}'
  ].join('\n');

  function Shader(canvas) {
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) throw new Error('no webgl');
    var sh = function (type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.gl = gl; this.canvas = canvas;
    this.u = { r: gl.getUniformLocation(prog, 'r'), t: gl.getUniformLocation(prog, 't'), m: gl.getUniformLocation(prog, 'm'), v: gl.getUniformLocation(prog, 'v') };
    this.variant = canvas.getAttribute('data-shader') === 'cta' ? 1 : 0;
    this.mouse = [.55, .25]; this.target = [.55, .25];
    this.time = 18 + Math.random() * 20;
    this.visible = false; this.running = false;
    this.resize();
  }
  Shader.prototype.resize = function () {
    var c = this.canvas, scale = Math.min(window.devicePixelRatio || 1, 2) * (window.innerWidth < 700 ? .45 : .6);
    var w = Math.max(2, Math.round(c.clientWidth * scale)), h = Math.max(2, Math.round(c.clientHeight * scale));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; this.gl.viewport(0, 0, w, h); }
  };
  Shader.prototype.draw = function () {
    var gl = this.gl;
    this.mouse[0] += (this.target[0] - this.mouse[0]) * .04;
    this.mouse[1] += (this.target[1] - this.mouse[1]) * .04;
    gl.uniform2f(this.u.r, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.t, this.time);
    gl.uniform2f(this.u.m, this.mouse[0], this.mouse[1]);
    gl.uniform1f(this.u.v, this.variant);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  Shader.prototype.loop = function () {
    var self = this, last = performance.now();
    if (this.running) return;
    this.running = true;
    (function frame(now) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      self.time += Math.min(.05, (now - last) / 1000); last = now;
      self.draw();
      requestAnimationFrame(frame);
    })(last);
  };

  var shaders = [];
  document.querySelectorAll('canvas[data-shader]').forEach(function (canvas) {
    var host = canvas.parentElement;
    try {
      var s = new Shader(canvas);
      shaders.push(s);
      host.classList.add('has-gl');
      if (reduce) { s.draw(); return; }
      host.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        s.target[0] = ((e.clientX - rect.left) - rect.width / 2) / rect.height;
        s.target[1] = (rect.height / 2 - (e.clientY - rect.top)) / rect.height;
      });
      new IntersectionObserver(function (entries) {
        s.visible = entries[0].isIntersecting;
        if (s.visible) s.loop();
      }, { rootMargin: '100px' }).observe(canvas);
    } catch (err) {
      host.classList.add('no-gl');
      canvas.remove();
    }
  });
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { shaders.forEach(function (s) { s.resize(); if (reduce) s.draw(); }); }, 150);
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) shaders.forEach(function (s) { if (s.visible) s.loop(); }); });

  /* Spotlight: cards light up where the pointer is */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }
})();
