/* StartBox Ventures — the three diagnosis objects on the home page.
   [data-obj="lens"]    hero: a glass loupe drifting over the editorial layer, magnifying it.
   [data-obj="iceberg"] "Sound familiar?": the symptom above the water, the problem below.
   [data-obj="funnel"]  audit card: enquiries leak through cracks, then the cracks seal.
   Three.js is self-hosted and loaded once, only when a stage comes near. Each stage renders only
   while visible, caps pixel ratio, draws one still frame for reduced motion, and keeps its CSS
   fallback (.no-gl) when WebGL is unavailable. */
const stages = [...document.querySelectorAll('[data-obj]')];
if (stages.length) {
  let three = null;
  const getThree = () => (three ||= import('/assets/vendor/three/three.module.min.js'));
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      const el = e.target;
      el.__visible = e.isIntersecting;
      if (e.isIntersecting && !el.__started) {
        el.__started = true;
        getThree().then((T) => BUILD[el.dataset.obj](T, el)).catch(() => el.classList.add('no-gl'));
      }
    });
  }, { rootMargin: '40% 0px' });
  stages.forEach((s) => io.observe(s));
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = { cream: 0xf0d9b5, amber: 0xf4a62a, indigo: 0x2d2b55, violet: 0x6a5acd, lilac: 0xa678b9 };

function stage(THREE, el, fov, z) {
  const canvas = el.querySelector('canvas');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' }); }
  catch (e) { el.classList.add('no-gl'); return null; }
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  el.classList.add('gl-on');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, z);
  const st = { THREE, el, renderer, scene, camera, px: 0, py: 0, tx: 0, ty: 0, w: 1, h: 1, onSize: null };
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    st.w = w; st.h = h; st.narrow = innerWidth < 900;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix(); st.onSize && st.onSize();
  };
  st.size = size;
  addEventListener('resize', size);
  if (!reduce) (el.dataset.pointer === 'page' ? window : el).addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect(); st.tx = (e.clientX - r.left) / r.width - 0.5; st.ty = (e.clientY - r.top) / r.height - 0.5; st.touched = performance.now();
  }, { passive: true });
  scene.add(new THREE.HemisphereLight(C.cream, C.indigo, 0.7));
  const key = new THREE.DirectionalLight(0xffe6c2, 1.8); key.position.set(4, 6, 8); scene.add(key);
  const rim = new THREE.PointLight(C.violet, 80, 40, 2); rim.position.set(-6, -3, -2); scene.add(rim);
  return st;
}

function run(st, update) {
  const t0 = performance.now();
  st.size();
  const frame = (now) => {
    const t = reduce ? 4 : (now - t0) / 1000;
    update(t); st.renderer.render(st.scene, st.camera);
    if (!reduce) requestAnimationFrame(loop);
  };
  const loop = (now) => {
    if (st.el.__visible === false || document.hidden) { setTimeout(() => requestAnimationFrame(loop), 300); return; }
    frame(now);
  };
  requestAnimationFrame(frame);
}

const glowMat = (THREE, c1, c2, s = 0.6) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { a: { value: new THREE.Color(c1) }, b: { value: new THREE.Color(c2) }, s: { value: s } },
  vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'uniform vec3 a;uniform vec3 b;uniform float s;varying vec2 vU;void main(){float d=length(vU-.5)*2.;vec3 c=mix(a,b,smoothstep(.15,.9,d));float k=(exp(-d*d*5.)*.7+exp(-d*3.)*.2)*s;gl_FragColor=vec4(c*k,k);}'
});

const BUILD = {
  /* ---------- Hero: the lens ---------- */
  lens(THREE, el) {
    const st = stage(THREE, el, 32, 10); if (!st) return;
    const { scene, camera } = st;
    const cv = document.createElement('canvas'); const g = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const U = { map: { value: tex }, c: { value: new THREE.Vector2(0.5, 0.5) }, r: { value: 0.1 }, asp: { value: 2 } };
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false,
      vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform sampler2D map;uniform vec2 c;uniform float r;uniform float asp;varying vec2 vU;void main(){vec2 d=vU-c;d.x*=asp;float l=length(d);vec4 col=texture2D(map,vU);if(l<r){float k=l/r;float mag=mix(.5,.8,k*k);vec2 o=d*mag;o.x/=asp;vec2 uv=c+o;float ca=.0018*k*k;vec4 m=texture2D(map,uv);col=vec4(texture2D(map,uv+vec2(ca,0.)).r,m.g,texture2D(map,uv-vec2(ca,0.)).b,m.a);col.rgb*=1.25;col.a=max(min(col.a*2.6,1.),.05);col.rgb+=vec3(.957,.651,.165)*.04*(1.-k);}gl_FragColor=col;\n#include <colorspace_fragment>\n}'
    }));
    plane.position.z = -1.2; scene.add(plane);

    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(st.w * dpr); cv.height = Math.round(st.h * dpr);
      const W = cv.width, H = cv.height, s = W / 1440;
      g.clearRect(0, 0, W, H);
      const font = getComputedStyle(document.body).fontFamily;
      // the giant editorial word
      const fs = Math.min(W * 0.24, H * 0.42);
      g.font = `600 ${fs}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = Math.max(1, 1.4 * dpr); g.strokeStyle = 'rgba(166,120,185,.32)';
      g.strokeText('diagnose', W / 2, H * 0.44);
      // what a diagnosis looks at
      g.font = `500 ${Math.max(12, 15 * s) * (st.narrow ? 1.3 : 1)}px ${font}`; g.fillStyle = 'rgba(166,120,185,.75)';
      const words = ['offer', 'website', 'ads', 'follow-up', 'pricing', 'trust', 'reviews', 'sales calls'];
      const spots = st.narrow
        ? [[.2, .2], [.78, .26], [.14, .52], [.84, .5], [.3, .66], [.72, .7]]
        : [[.16, .3], [.84, .3], [.3, .2], [.7, .2], [.12, .56], [.88, .56], [.24, .7], [.76, .7]];
      spots.forEach(([x, y], i) => g.fillText(`[ ${words[i]} ]`, W * x, H * y));
      tex.needsUpdate = true;
    };
    const lens = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.SphereGeometry(1.25, 96, 64), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, roughness: 0, clearcoat: 1, depthWrite: false }));
    disc.scale.set(1, 1, 0.14); lens.add(disc);
    const metal = new THREE.MeshPhysicalMaterial({ color: C.amber, metalness: 1, roughness: 0.28, clearcoat: 0.6 });
    lens.add(new THREE.Mesh(new THREE.TorusGeometry(1.27, 0.09, 24, 128), metal));
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 2.1, 32), new THREE.MeshPhysicalMaterial({ color: C.indigo, metalness: 0.4, roughness: 0.35, clearcoat: 1 }));
    handle.position.set(1.55, -1.55, 0); handle.rotation.z = Math.PI / 4; lens.add(handle);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 32), metal);
    collar.position.set(0.98, -0.98, 0); collar.rotation.z = Math.PI / 4; lens.add(collar);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.5), glowMat(THREE, C.amber, C.violet, 0.3)); halo.position.z = -0.9; lens.add(halo);
    lens.position.z = 1.4; scene.add(lens);

    let viewW = 1, viewH = 1;
    st.onSize = () => {
      const d = camera.position.z - plane.position.z;
      viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d; viewW = viewH * camera.aspect;
      plane.scale.set(viewW, viewH, 1); draw();
      const ls = st.narrow ? 0.5 : 0.6; lens.scale.setScalar(ls);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => st.onSize());

    run(st, (t) => {
      const idle = !st.touched || performance.now() - st.touched > 2500;
      // drift in the upper part of the hero, away from the headline
      // idle: a slow loop around the headline (wide on desktop, above it on phones)
      const ax = idle ? Math.sin(t * 0.2) * (st.narrow ? 0.22 : 0.43) : st.tx;
      const ay = idle ? (st.narrow ? -0.3 + Math.cos(t * 0.2) * 0.05 : -Math.cos(t * 0.2) * 0.37) : st.ty;
      st.px += (ax - st.px) * 0.05; st.py += (ay - st.py) * 0.05;
      const dz = camera.position.z - lens.position.z, vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dz, vw = vh * camera.aspect;
      lens.position.x = st.px * vw * 0.9; lens.position.y = -st.py * vh * 0.9;
      lens.rotation.y = st.px * 0.5; lens.rotation.x = st.py * 0.4; lens.rotation.z = Math.sin(t * 0.4) * 0.05;
      const cam = camera.position, lp = lens.position, pz = plane.position.z;
      const f = (cam.z - pz) / (cam.z - lp.z);
      const hx = cam.x + (lp.x - cam.x) * f, hy = cam.y + (lp.y - cam.y) * f;
      U.c.value.set(hx / viewW + 0.5, hy / viewH + 0.5);
      U.r.value = (1.25 * lens.scale.x * f) / viewH; U.asp.value = viewW / viewH;
    });
  },

  /* ---------- Sound familiar: the iceberg ---------- */
  iceberg(THREE, el) {
    const st = stage(THREE, el, 34, 11); if (!st) return;
    const { scene, camera } = st;
    camera.position.set(0, 1.6, 11); camera.lookAt(0, -0.6, 0);
    const geo = new THREE.IcosahedronGeometry(1.7, 3);
    const pos = geo.attributes.position, v = new THREE.Vector3();
    const rnd = (x, y, z) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      v.multiplyScalar(1 + (rnd(Math.round(v.x * 4), Math.round(v.y * 4), Math.round(v.z * 4)) - 0.5) * 0.35);
      v.y *= 1.45; if (v.y > 0) { v.x *= 0.62; v.z *= 0.62; v.y *= 0.7; }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const ice = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0xf6ead6, roughness: 0.35, clearcoat: 1, flatShading: true, sheen: 0.4, sheenColor: new THREE.Color(C.lilac) }));
    scene.add(ice);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 120, 120), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { t: { value: 0 } },
      vertexShader: 'uniform float t;varying vec2 vU;varying float vH;void main(){vU=uv;vec3 p=position;float h=sin(p.x*1.3+t)*.04+sin(p.y*1.7-t*1.2)*.04;p.z+=h;vH=h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
      fragmentShader: 'varying vec2 vU;varying float vH;void main(){float d=length(vU-.5)*2.;vec3 c=mix(vec3(.176,.169,.333),vec3(.416,.353,.804),.35+vH*4.);float a=.62*(1.-smoothstep(.55,1.,d));gl_FragColor=vec4(c,a);}'
    }));
    water.rotation.x = -Math.PI / 2; scene.add(water);
    const below = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), glowMat(THREE, C.violet, C.indigo, 0.5)); below.position.set(0, -2.2, -1.5); scene.add(below);
    const up = el.querySelector('[data-anchor="up"]'), dn = el.querySelector('[data-anchor="down"]');
    const place = (tag, p) => { if (!tag) return; const q = p.clone().project(camera); tag.style.left = ((q.x + 1) / 2 * st.w) + 'px'; tag.style.top = ((1 - q.y) / 2 * st.h) + 'px'; };
    run(st, (t) => {
      st.px += (st.tx - st.px) * 0.05;
      ice.position.y = -0.9 + Math.sin(t * 0.6) * 0.08; ice.rotation.y = t * 0.12 + st.px * 0.8; ice.rotation.z = Math.sin(t * 0.4) * 0.03;
      water.material.uniforms.t.value = t;
      place(up, new THREE.Vector3(0, 1.75, 0)); place(dn, new THREE.Vector3(0, -3.3, 0));
    });
  },

  /* ---------- Audit card: the leaking funnel ---------- */
  funnel(THREE, el) {
    const st = stage(THREE, el, 34, 9.5); if (!st) return;
    const { scene, camera } = st;
    camera.position.set(0, 1.1, 9.5); camera.lookAt(0, 0, 0);
    const R = (y) => (y > -0.5 ? 0.28 + (y + 0.5) * 0.62 : 0.28);
    const prof = []; for (let i = 0; i <= 40; i++) { const y = -1.9 + i * (3.8 / 40); prof.push(new THREE.Vector2(R(y), y)); }
    const g = new THREE.Group(); scene.add(g);
    g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 96), new THREE.MeshPhysicalMaterial({ color: C.cream, transparent: true, opacity: 0.18, roughness: 0.1, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false })));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.LatheGeometry(prof, 24), 20), new THREE.LineBasicMaterial({ color: C.lilac, transparent: true, opacity: 0.35 })));
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(R(1.9), 0.035, 16, 128), new THREE.MeshPhysicalMaterial({ color: C.amber, metalness: 1, roughness: 0.3 }));
    rimRing.rotation.x = Math.PI / 2; rimRing.position.y = 1.9; g.add(rimRing);
    const cracks = [[0.9, 0.6], [2.6, 0.15], [4.4, 0.95]].map(([a, y]) => {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), glowMat(THREE, C.violet, C.lilac, 1.1));
      const r = R(y) + 0.02; c.position.set(Math.cos(a) * r, y, Math.sin(a) * r); c.lookAt(c.position.x * 3, y, c.position.z * 3);
      c.userData = { a, y }; g.add(c); return c;
    });
    const N = 220;
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.036, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), N);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage); g.add(dots);
    const spawn = (p, init) => Object.assign(p, { a: Math.random() * Math.PI * 2, k: 0.25 + Math.random() * 0.65, y: init ? 1.9 + Math.random() * 5 : 2.4 + Math.random() * 1.5, vy: 0, leak: Math.random() < 0.38, out: false, crack: cracks[Math.floor(Math.random() * 3)] });
    const P = Array.from({ length: N }, () => spawn({}, true));
    const m = new THREE.Matrix4(), cA = new THREE.Color(C.amber), cV = new THREE.Color(C.violet);
    const stateEl = el.querySelector('[data-state]');
    let last = 0;
    run(st, (t) => {
      const dt = reduce ? 0 : Math.min(0.05, t - last); last = t;
      const cyc = reduce ? 10 : t % 14, leak = cyc < 7, seal = leak ? 0 : Math.min(1, (cyc - 7) / 1.2);
      if (stateEl) stateEl.textContent = leak ? 'Leaking' : 'Sealed';
      cracks.forEach((c) => (c.material.uniforms.s.value = 1.1 * (1 - seal)));
      st.px += (st.tx - st.px) * 0.05; g.rotation.y = st.px * 0.6;
      for (let i = 0; i < N; i++) {
        const p = P[i];
        if (!p.out) {
          p.vy = Math.max(p.vy - 3.2 * dt, -2.2); p.y += p.vy * dt;
          p.a += dt * (0.6 + (1.9 - Math.min(1.9, p.y)) * 0.9);
          const r = (p.y < 1.9 ? R(p.y) : R(1.9) * 1.1) * p.k; p.x = Math.cos(p.a) * r; p.z = Math.sin(p.a) * r;
          if (p.leak && leak && Math.abs(p.y - p.crack.userData.y) < 0.06) {
            const a = p.crack.userData.a; p.out = true; p.x = Math.cos(a) * R(p.y); p.z = Math.sin(a) * R(p.y);
            p.vx = Math.cos(a) * (1 + Math.random()); p.vz = Math.sin(a) * (1 + Math.random()); p.vy = 0.4;
          }
          if (p.y < -2.6) spawn(p);
        } else { p.vy -= 4 * dt; p.x += p.vx * dt; p.z += p.vz * dt; p.y += p.vy * dt; if (p.y < -4) spawn(p); }
        m.makeTranslation(p.x, p.y, p.z); dots.setMatrixAt(i, m); dots.setColorAt(i, p.out ? cV : cA);
      }
      dots.instanceMatrix.needsUpdate = true; if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
    });
  }
};
