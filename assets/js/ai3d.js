/* StartBox Ventures — "AI in your business" 3D chapter.
   A live Three.js scene (self-hosted in /assets/vendor/three) driven by scroll progress.
   site.js pins the section and writes progress (0..1) to window.__ai.p.
   Beats: scattered parts -> a scan finds the breaks -> AI connects them -> one running system.
   Loads only when the section is near the screen; renders one still frame for reduced motion;
   falls back to a CSS glow when WebGL is unavailable. */
const section = document.querySelector('.ai-chapter');
if (section) init();

function init() {
  const canvas = section.querySelector('.ai-canvas');
  const labelsEl = section.querySelector('.ai-labels');
  let started = false;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      section.__visible = e.isIntersecting;
      if (e.isIntersecting && !started) { started = true; boot(canvas, labelsEl).catch(() => section.classList.add('no-gl')); }
    });
  }, { rootMargin: '100% 0px' });
  io.observe(section);
}

async function boot(canvas, labelsEl) {
  const THREE = await import('/assets/vendor/three/three.module.min.js');
  const { RoundedBoxGeometry } = await import('/assets/vendor/three/RoundedBoxGeometry.js');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { section.classList.add('no-gl'); return; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const GOLD = new THREE.Color('#C4992A'), IVORY = new THREE.Color('#F4F1EA'), STONE = new THREE.Color('#A8A49C');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0a0a, 14, 30);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.6, 15);

  scene.add(new THREE.AmbientLight(0xf4f1ea, 0.45));
  const key = new THREE.DirectionalLight(0xc4992a, 2.6); key.position.set(6, 7, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xf4f1ea, 0.7); fill.position.set(-8, 2, 4); scene.add(fill);
  const coreLight = new THREE.PointLight(0xc4992a, 0, 12, 1.6); scene.add(coreLight);

  const world = new THREE.Group(); scene.add(world);

  /* The business parts */
  const NAMES = ['Website', 'Ads', 'WhatsApp', 'Sales', 'Data', 'Team'];
  const N = NAMES.length;
  const rand = mulberry32(7);
  const geo = new RoundedBoxGeometry(1.7, 1.05, 0.34, 4, 0.12);
  const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.72, 1.07, 0.36));
  const blocks = NAMES.map((name, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.5, roughness: 0.36, emissive: 0xc4992a, emissiveIntensity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: STONE.clone(), transparent: true, opacity: 0.35 }));
    mesh.add(edges);
    world.add(mesh);
    const a = (i / N) * Math.PI * 2 + Math.PI / 2;
    const ring = new THREE.Vector3(Math.cos(a) * 3.5, Math.sin(a) * 2.5, 0);
    const scatter = new THREE.Vector3(-1.6 + rand() * 7.4, (rand() - 0.5) * 6, (rand() - 0.5) * 5 - 1); // stays right of the text
    const rot0 = new THREE.Euler((rand() - 0.5) * 2.2, (rand() - 0.5) * 2.6, (rand() - 0.5) * 1.6);
    const label = document.createElement('span'); label.textContent = name; labelsEl.appendChild(label);
    return { mesh, mat, edges, ring, scatter, rot0, label, phase: rand() * Math.PI * 2 };
  });

  /* The AI core */
  const core = new THREE.Group(); world.add(core);
  const coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1), new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.9 }));
  const coreInner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 2), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: GOLD, emissiveIntensity: 0.8, metalness: 0.2, roughness: 0.4 }));
  core.add(coreWire, coreInner);

  /* Links: core -> each part (spokes) and part -> next part (ring). Rebuilt from live positions every frame. */
  const spokeGeo = new THREE.BufferGeometry(); spokeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3));
  const spokes = new THREE.LineSegments(spokeGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
  world.add(spokes);
  const ringGeo = new THREE.BufferGeometry(); ringGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3));
  const ringSolid = new THREE.LineSegments(ringGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
  const ringBroken = new THREE.LineSegments(ringGeo, new THREE.LineDashedMaterial({ color: IVORY, dashSize: 0.18, gapSize: 0.22, transparent: true, opacity: 0 }));
  world.add(ringSolid, ringBroken);

  /* Data pulses travelling along the spokes */
  const PULSES = N * 3;
  const pulseGeo = new THREE.BufferGeometry(); pulseGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
  const pulses = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ color: GOLD, size: 0.14, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  world.add(pulses);

  /* The scan: a thin gold plane that sweeps across while we diagnose */
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 9), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  const scanGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 9), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  scan.add(scanGlow); scene.add(scan);

  /* Depth: a quiet field of dust */
  const DUST = 260, dPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { dPos[i * 3] = (rand() - 0.5) * 30; dPos[i * 3 + 1] = (rand() - 0.5) * 16; dPos[i * 3 + 2] = (rand() - 0.5) * 14 - 4; }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: STONE, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(dust);

  /* Layout: scene sits right of the text on wide screens, above it on phones */
  let narrow = false;
  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    narrow = w < 861;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    world.scale.setScalar(narrow ? 0.58 : 1);
    if (!animating) frame(performance.now());
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const live = () => document.documentElement.classList.contains('motion') && !reduce;
  window.__ai = window.__ai || { p: 0 };
  let p = live() ? (window.__ai.p || 0) : 1;
  let animating = false, last = performance.now();

  const v = new THREE.Vector3(), q = new THREE.Quaternion(), qZero = new THREE.Quaternion(), tmp = new THREE.Vector3();
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    const target = live() ? (window.__ai.p || 0) : 1;
    p += (target - p) * (live() ? Math.min(1, dt * 6) : 1);

    const gather = sstep(0.42, 0.70, p);          // parts move from scattered to the ring
    const broken = sstep(0.22, 0.30, p) * (1 - sstep(0.46, 0.54, p));
    const coreOn = sstep(0.46, 0.66, p);
    const linked = sstep(0.56, 0.74, p);
    const run = sstep(0.72, 1, p);
    const idle = live() ? 1 : 0;

    // phones: scene above the text, centred once the parts gather
    world.position.set(narrow ? -0.8 * (1 - gather) : 3.4, narrow ? 2.6 : 0, 0);
    // camera eases back as the system starts running
    camera.position.z = 15 + run * 2.2;
    camera.position.y = 0.6 + run * 0.8;
    camera.lookAt(world.position.x * 0.35, world.position.y * 0.5, 0);
    world.rotation.y = (-0.35 + 0.35 * gather) + run * 0.5 + (idle ? Math.sin(t * 0.15) * 0.06 * run : 0);
    world.rotation.x = 0.08 * gather;

    blocks.forEach((b, i) => {
      const drift = (1 - gather) * 0.35 * idle;
      v.copy(b.scatter).lerp(b.ring, gather);
      v.x += Math.sin(t * 0.5 + b.phase) * drift;
      v.y += Math.cos(t * 0.4 + b.phase) * drift;
      b.mesh.position.copy(v);
      q.setFromEuler(new THREE.Euler(b.rot0.x + Math.sin(t * 0.3 + b.phase) * 0.15 * idle * (1 - gather), b.rot0.y, b.rot0.z));
      b.mesh.quaternion.copy(q).slerp(qZero, gather);
      // a part glows while the scan reads it, then turns gold once connected
      b.mat.emissiveIntensity = 0.1 + broken * 0.14 + linked * 0.22;
      b.edges.material.color.copy(STONE).lerp(GOLD, Math.max(linked, broken * 0.5));
      b.edges.material.opacity = 0.5 + 0.4 * Math.max(linked, broken);
    });

    // core
    const cs = 0.001 + coreOn;
    core.scale.setScalar(cs);
    coreWire.rotation.y = t * 0.35 * idle + 0.6; coreWire.rotation.x = t * 0.18 * idle + 0.3;
    coreInner.material.emissiveIntensity = 0.5 + 0.6 * linked + (idle ? 0.15 * Math.sin(t * 2.2) * linked : 0);
    coreLight.intensity = 6 * coreOn;
    coreLight.position.copy(world.position);

    // links
    const sp = spokeGeo.attributes.position.array, rp = ringGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const a = blocks[i].mesh.position, b2 = blocks[(i + 1) % N].mesh.position;
      sp.set([0, 0, 0, a.x, a.y, a.z], i * 6);
      rp.set([a.x, a.y, a.z, b2.x, b2.y, b2.z], i * 6);
    }
    spokeGeo.attributes.position.needsUpdate = true; ringGeo.attributes.position.needsUpdate = true;
    ringBroken.computeLineDistances();
    spokes.material.opacity = 0.55 * linked;
    ringSolid.material.opacity = 0.35 * linked;
    ringBroken.material.opacity = 0.5 * broken * (idle ? 0.7 + 0.3 * Math.sin(t * 9) : 1);

    // pulses run from the core out to each part
    const pp = pulseGeo.attributes.position.array;
    for (let k = 0; k < PULSES; k++) {
      const i = k % N, a = blocks[i].mesh.position;
      const f = ((idle ? t * 0.45 : 0) + k / PULSES * 3) % 1;
      tmp.copy(a).multiplyScalar(f);
      pp[k * 3] = tmp.x; pp[k * 3 + 1] = tmp.y; pp[k * 3 + 2] = tmp.z;
    }
    pulseGeo.attributes.position.needsUpdate = true;
    pulses.material.opacity = linked;

    // the scan sweeps once, left to right, during the diagnosis beat
    const sweep = sstep(0.22, 0.48, p);
    scan.position.set(world.position.x + (-6 + 12 * sweep) * world.scale.x, world.position.y, 1.5);
    scan.scale.y = world.scale.x;
    const scanOn = sstep(0.2, 0.26, p) * (1 - sstep(0.46, 0.5, p));
    scan.material.opacity = 0.9 * scanOn; scanGlow.material.opacity = 0.12 * scanOn;

    dust.rotation.y = idle ? t * 0.01 : 0;

    renderer.render(scene, camera);

    // labels follow their parts on screen
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const labelOn = 1 - sstep(0.8, 0.9, p);
    blocks.forEach((b) => {
      b.mesh.getWorldPosition(tmp); tmp.y += 0.85 * world.scale.x; tmp.project(camera);
      b.label.style.transform = `translate(${((tmp.x + 1) / 2) * w}px, ${((1 - tmp.y) / 2) * h}px) translate(-50%, -50%)`;
      b.label.style.opacity = String(labelOn * (tmp.z < 1 ? 1 : 0));
    });
  }

  function loop(now) {
    if (!section.__visible || document.hidden || !live()) { animating = false; return; }
    animating = true;
    frame(now);
    requestAnimationFrame(loop);
  }
  const kick = () => { if (!animating && section.__visible && live()) { last = performance.now(); requestAnimationFrame(loop); } };

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', kick);
  new IntersectionObserver((es) => { es.forEach((e) => { section.__visible = e.isIntersecting; }); kick(); }).observe(section);
  resize();
  frame(performance.now());
  kick();
}

function mulberry32(a) {
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
