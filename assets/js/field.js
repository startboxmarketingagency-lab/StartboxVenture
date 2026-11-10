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
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
    'void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;float t=T*.06;',
    ' vec3 ink=vec3(.102,.102,.122),amber=vec3(.957,.651,.165),cream=vec3(.941,.851,.71),violet=vec3(.416,.353,.804);',
    ' vec3 col=ink;',
    /* light ribbons: three slow bands of amber light, bent by noise and scroll */
    ' for(int i=0;i<3;i++){float fi=float(i);',
    '  float y=.32*sin(p.x*(.9+fi*.25)+t*(1.+fi*.3)+fi*2.1+S*.35)+(fi-1.)*.28+.12*(fbm(p*1.3+vec2(t,fi))-.5);',
    '  float d=abs(p.y-y);float w=.018+.05*fbm(vec2(p.x*2.+t,fi*3.));',
    '  float core=exp(-d*d/(w*w)*.6);float halo=exp(-d*6.);',
    '  vec3 c=mix(amber,cream,core*.6);if(i==2)c=mix(c,violet,.55);',
    '  col+=c*(core*.16+halo*.035);}',
    /* data field: a grid of light points that pulse in slow waves */
    ' vec2 g=gl_FragCoord.xy/R.y*42.;vec2 gi=floor(g),gf=fract(g)-.5;',
    ' float wave=sin(length(gi*.08-vec2(.0,S*.8))*1.6-t*6.)*.5+.5;float pick=step(.82,h(gi));',
    ' float dotm=smoothstep(.12,.0,length(gf))*pick*(.15+.85*pow(wave,6.));',
    ' col+=mix(cream,amber,wave)*dotm*.22;',
    /* a soft glow that drifts with scroll */
    ' vec2 gc=vec2(.55*sin(S*.7+t*.5),.25*cos(S*.5));float glow=exp(-length(p-gc)*2.2);',
    ' col+=amber*glow*.06+violet*exp(-length(p+gc)*2.6)*.03;',
    /* vignette and grain */
    ' col*=1.-.35*pow(length(uv-.5)*1.4,2.);',
    ' col+=(h(gl_FragCoord.xy+fract(T)*61.)-.5)*.03;',
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
  var scale = 0.5;
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
