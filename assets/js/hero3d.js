/* StartBox Ventures — the open box, in 3D, in the home hero.
   The brand's open-box frame (no letters, the wordmark stays a file) with the amber square
   lifting out of it. Slow turn, leans toward the pointer. Renders only while visible, caps
   pixel ratio, one still frame for reduced motion, nothing when WebGL is unavailable. */
const host = document.querySelector('.box-stage');
if (host) init();

function init() {
  const canvas = host.querySelector('.box-canvas');
  let started = false;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      host.__visible = e.isIntersecting;
      if (e.isIntersecting && !started) { started = true; boot(canvas).catch(() => host.classList.add('no-gl')); }
    });
  }, { rootMargin: '50% 0px' });
  io.observe(host);
}

async function boot(canvas) {
  const THREE = await import('/assets/vendor/three/three.module.min.js');
  const { RoundedBoxGeometry } = await import('/assets/vendor/three/RoundedBoxGeometry.js');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { host.classList.add('no-gl'); return; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 13);

  scene.add(new THREE.HemisphereLight(0xf0d9b5, 0x2d2b55, 0.55));
  const key = new THREE.DirectionalLight(0xffe2b8, 1.6); key.position.set(4, 6, 8); scene.add(key);
  const rimV = new THREE.PointLight(0x6a5acd, 60, 30, 2); rimV.position.set(-6, -2, -3); scene.add(rimV);
  const warm = new THREE.PointLight(0xf4a62a, 40, 12, 2); scene.add(warm);

  // Brand geometry: path M42 4H4V60H60V22 with stroke 5, square at 51..63 x 1..13, in a 64 grid.
  const U = 0.09, T = 5 * U, D = 0.9; // unit, stroke thickness, depth
  const toX = (x) => (x - 32) * U, toY = (y) => (32 - y) * U;
  const frame = new THREE.Group();
  const cream = new THREE.MeshPhysicalMaterial({ color: 0xf0d9b5, roughness: 0.32, metalness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const bar = (x1, y1, x2, y2) => {
    const w = Math.abs(x2 - x1) * U + T, h = Math.abs(y2 - y1) * U + T;
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, D, 3, 0.06), cream);
    m.position.set(toX((x1 + x2) / 2), toY((y1 + y2) / 2), 0);
    frame.add(m);
  };
  bar(4, 4, 42, 4); bar(4, 4, 4, 60); bar(4, 60, 60, 60); bar(60, 22, 60, 60);
  scene.add(frame);

  const amber = new THREE.MeshPhysicalMaterial({ color: 0xf4a62a, emissive: 0xf4a62a, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.1, clearcoat: 1 });
  const cube = new THREE.Mesh(new RoundedBoxGeometry(12 * U, 12 * U, 12 * U, 3, 0.05), amber);
  const home = new THREE.Vector3(toX(57), toY(7), 0);
  scene.add(cube);

  // Soft glow behind the square, violet at the edge.
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 vU;void main(){float d=length(vU-.5)*2.;vec3 c=mix(vec3(.957,.651,.165),vec3(.416,.353,.804),smoothstep(.2,.9,d));float a=exp(-d*d*5.)*.5+exp(-d*3.)*.12;gl_FragColor=vec4(c*a,a);}'
  }));
  scene.add(glow);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let px = 0, py = 0, tx = 0, ty = 0;
  if (!reduce) addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); addEventListener('resize', size);

  const t0 = performance.now();
  function frameDraw(now) {
    const t = reduce ? 3.2 : (now - t0) / 1000;
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    const turn = Math.sin(t * 0.35) * 0.42 + px * 0.5;
    frame.rotation.set(-0.12 + py * 0.25, turn, Math.sin(t * 0.25) * 0.03);
    // The square lifts out of the open corner and settles back, slowly.
    const lift = (Math.sin(t * 0.6) * 0.5 + 0.5);
    const local = home.clone().add(new THREE.Vector3(0.35 * lift, 0.55 * lift, 0.4 * lift));
    local.applyEuler(frame.rotation);
    cube.position.copy(local);
    cube.rotation.set(t * 0.3, t * 0.45, t * 0.2);
    warm.position.copy(local).add(new THREE.Vector3(0, 0, 1.2));
    glow.position.copy(local).add(new THREE.Vector3(0, 0, -0.8));
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(loop);
  }
  function loop(now) {
    if (host.__visible === false || document.hidden) { setTimeout(() => requestAnimationFrame(loop), 300); return; }
    frameDraw(now);
  }
  requestAnimationFrame(frameDraw);
}
