/* StartBox Ventures — the living page background.
   One fixed WebGL canvas behind every section: slow indigo and violet light drifting over
   near-black, with faint amber and film grain. Low resolution, pauses when the tab is hidden,
   one still frame for reduced motion, and a static CSS gradient when WebGL is unavailable. */
(function () {
  var c = document.createElement('canvas');
  c.className = 'bg-field'; c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  var gl = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { document.documentElement.classList.add('no-field'); return; }
  document.documentElement.classList.add('has-field');

  var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs = [
    'precision mediump float;uniform vec2 R;uniform float T;uniform float S;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}',
    'void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*vec2(R.x/R.y,1.)*1.6;',
    ' float t=T*.035;',
    ' vec2 q=vec2(fbm(p+vec2(t,0.)),fbm(p+vec2(-t*.8,t*.6)+3.1));',
    ' float f=fbm(p+q*1.8+vec2(0.,S*.6));',
    ' vec3 ink=vec3(.102,.102,.122),indigo=vec3(.176,.169,.333),violet=vec3(.416,.353,.804),amber=vec3(.957,.651,.165);',
    ' vec3 col=ink;',
    ' col=mix(col,indigo,smoothstep(.35,.85,f)*.75);',
    ' col+=violet*pow(smoothstep(.55,.95,f),2.)*.16;',
    ' col+=amber*pow(smoothstep(.62,1.,fbm(p*.7-q+vec2(t*.5,S*.3))),3.)*.07;',
    ' col+=(h(gl_FragCoord.xy+fract(T)*61.)-.5)*.035;',
    ' gl_FragColor=vec4(col,1.);}'
  ].join('');
  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { document.documentElement.classList.replace('has-field', 'no-field'); return; }
  gl.useProgram(pr);
  var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uS = gl.getUniformLocation(pr, 'S');
  var scale = 0.4;
  function size() { c.width = Math.max(2, Math.round(innerWidth * scale)); c.height = Math.max(2, Math.round(innerHeight * scale)); gl.viewport(0, 0, c.width, c.height); }
  size(); addEventListener('resize', size);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t0 = performance.now();
  function draw(now) {
    var s = (window.scrollY || 0) / Math.max(1, innerHeight);
    gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, reduce ? 40 : (now - t0) / 1000); gl.uniform1f(uS, s);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce) requestAnimationFrame(loop);
  }
  function loop(now) { if (document.hidden) { setTimeout(function () { requestAnimationFrame(loop); }, 400); return; } draw(now); }
  requestAnimationFrame(draw);
  if (reduce) addEventListener('scroll', function () { requestAnimationFrame(function (n) { draw(n); }); }, { passive: true });
})();
