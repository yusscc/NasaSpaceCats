// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { planets, worlds, artifacts, credits, storyChapters } from '../data/artifacts.js';

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const UP = new THREE.Vector3(0, 1, 0);

// ---------- renderer, camera, controls ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
document.body.prepend(renderer.domElement);

const labels = new CSS2DRenderer();
labels.setSize(innerWidth, innerHeight);
labels.domElement.className = 'labels';
document.body.prepend(labels.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.001, 5000);
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = !reducedMotion;
// OrbitControls reads camera.up only when created, so rebuild it after "up" changes (close-ups stand on a tilted surface)
function rebuildControls() {
  const old = controls;
  controls = new OrbitControls(camera, renderer.domElement);
  for (const k of ['enableDamping', 'enablePan', 'enabled', 'minDistance', 'maxDistance']) controls[k] = old[k];
  controls.target.copy(old.target);
  old.dispose();
}
controls.autoRotateSpeed = 0.4;

const loader = new THREE.TextureLoader();
const tex = url => { const t = loader.load(url); t.colorSpace = THREE.SRGBColorSpace; return t; };

// ---------- Sun: the only light source, so each body's sunward side is bright ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.06)); // faint, so night sides stay just visible
scene.add(new THREE.PointLight(0xffffff, 3.2, 0, 0));
const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshBasicMaterial({ map: tex('assets/textures/sun.jpg') }));
scene.add(sun);
const glowCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
const g = glowCanvas.getContext('2d'), grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
grad.addColorStop(0, 'rgba(255,220,150,1)'); grad.addColorStop(0.25, 'rgba(255,170,60,.45)'); grad.addColorStop(1, 'rgba(255,140,0,0)');
g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), blending: THREE.AdditiveBlending, depthWrite: false }));
glow.scale.setScalar(70);
sun.add(glow);

// star background
scene.add(new THREE.Mesh(new THREE.SphereGeometry(2000, 64, 64), new THREE.MeshBasicMaterial({ map: tex('assets/textures/stars.jpg'), side: THREE.BackSide })));

// ---------- planets ----------
function label(text, obj, radius) {
  const el = Object.assign(document.createElement('div'), { className: 'label', textContent: text });
  const l = new CSS2DObject(el);
  l.position.set(0, radius * 1.35, 0);
  obj.add(l);
  return l;
}
function orbit(center, radius) {
  const pts = Array.from({ length: 257 }, (_, i) => { const a = i / 256 * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius).add(center); });
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x4a5a88, transparent: true, opacity: 0.35 })));
}
const sphere = (radius, map) => new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 96), new THREE.MeshStandardMaterial({ map: tex(map), roughness: 1 }));

const planetMeshes = {}, spinning = [], labelOf = {};
label('Sun', sun, 10);
for (const p of planets) {
  const a = THREE.MathUtils.degToRad(p.angle);
  const mesh = sphere(p.radius, p.texture);
  mesh.position.set(Math.cos(a) * p.dist, 0, Math.sin(a) * p.dist);
  scene.add(mesh);
  orbit(new THREE.Vector3(), p.dist);
  labelOf[p.id] = label(p.name, mesh, p.radius);
  planetMeshes[p.id] = mesh;
  if (p.ring) {
    const inner = p.radius * 1.25, outer = p.radius * 2.3;
    const rg = new THREE.RingGeometry(inner, outer, 128);
    const pos = rg.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); rg.attributes.uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5); }
    const ring = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map: tex(p.ring), transparent: true, side: THREE.DoubleSide, roughness: 1 }));
    ring.rotation.x = -Math.PI / 2 + 0.47; // Saturn's tilt ≈ 27°
    mesh.add(ring);
  }
  if (!worlds[p.id]) spinning.push(mesh);
}

// ---------- visitable worlds (Moon and Mars) ----------
// lat/lon -> local point on a sphere, matching three.js equirectangular UVs
function latLonToVec(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180, theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const bodies = {};
for (const [key, w] of Object.entries(worlds)) {
  let mesh, radius, faceDir, viewDir, lift;
  if (w.planet) {
    mesh = planetMeshes[w.planet];
    radius = planets.find(p => p.id === w.planet).radius;
    faceDir = viewDir = mesh.position.clone().negate().normalize().applyAxisAngle(UP, 0.5); // mostly sunlit view
    lift = 1.1;
  } else {
    const parent = planetMeshes[w.parent];
    radius = w.radius;
    mesh = sphere(radius, w.texture);
    mesh.position.copy(parent.position).addScaledVector(parent.position.clone().normalize(), w.offset);
    scene.add(mesh);
    orbit(parent.position, w.offset);
    labelOf[key] = label(w.name, mesh, radius);
    faceDir = parent.position.clone().sub(mesh.position).normalize(); // tidally locked: near side faces Earth
    // camera looks from ~44° off the Earth line (sideways + above), so zooming out clears Earth
    viewDir = faceDir.clone().applyAxisAngle(UP, 0.6);
    lift = 2;
  }
  mesh.rotation.y = Math.atan2(-faceDir.z, faceDir.x); // turn longitude 0 toward faceDir
  bodies[key] = { mesh, radius, viewDir, lift, markers: [] };
}

const markerGeo = new THREE.SphereGeometry(1, 16, 16);
for (const a of artifacts) {
  const b = bodies[a.world];
  const m = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xffb347 }));
  m.position.copy(latLonToVec(a.lat, a.lon, b.radius * 1.004));
  m.userData = { base: b.radius * 0.022, artifact: a };
  b.mesh.add(m);
  b.markers.push(m);
  a.marker = m;
}

// ---------- NASA 3D models, standing on the surface (much larger than real scale) ----------
const MODEL_SIZE = 0.02; // model height as a fraction of the world radius
const gltf = new GLTFLoader();
// NASA's GLB files are Draco-compressed
gltf.setDRACOLoader(new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/'));
for (const a of artifacts.filter(x => x.model)) {
  gltf.load(a.model, ({ scene: obj }) => {
    obj.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(obj);
    if (a.modelKeepBelow) { // e.g. Apollo LM: only the descent stage stayed on the Moon
      const cutY = box.min.y + (box.max.y - box.min.y) * a.modelKeepBelow;
      obj.traverse(o => { if (o.isMesh && new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3()).y > cutY) o.visible = false; });
      box = new THREE.Box3();
      obj.traverse(o => { if (o.isMesh && o.visible) box.expandByObject(o); });
    }
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const r = bodies[a.world].radius, k = (r * MODEL_SIZE) / Math.max(size.x, size.y, size.z);
    obj.position.set(-c.x * k, -box.min.y * k, -c.z * k); // feet on the ground, centred
    obj.scale.setScalar(k);
    const holder = new THREE.Group();
    holder.add(obj);
    holder.position.copy(a.marker.position).setLength(r); // local to the world mesh
    holder.quaternion.setFromUnitVectors(UP, a.marker.position.clone().normalize()); // stand up along the surface normal
    bodies[a.world].mesh.add(holder);
    a.modelObj = holder;
  }, undefined, err => console.warn('model failed', a.model, err));
}

// close-up camera next to the artifact, on its sunlit side
function closeShot(a) {
  const b = bodies[a.world], h = b.radius * MODEL_SIZE;
  const n = a.marker.getWorldPosition(new THREE.Vector3()).sub(b.mesh.position).normalize();
  const ground = b.mesh.position.clone().addScaledVector(n, b.radius);
  let side = ground.clone().negate().normalize(); // toward the Sun (at the origin)
  side.addScaledVector(n, -side.dot(n));
  if (side.lengthSq() < 1e-6) side = new THREE.Vector3(0, 1, 0).addScaledVector(n, -n.y);
  side.normalize();
  return { pos: ground.clone().addScaledVector(side, h * 3.2).addScaledVector(n, h * 1.6), target: ground.clone().addScaledVector(n, h * 0.45), h, up: n };
}

// soft fill light that travels with the camera; its short range only reaches nearby models
const fill = new THREE.PointLight(0xffffff, 0.8, 0.4, 0);
camera.add(fill);
scene.add(camera);

// ---------- camera flights ----------
let flight = null;
const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// Around one body: slerp so we never pass through it. Between bodies: straight line rising above the solar system.
function fly({ toPos, toTarget, center = null, lift = 0, duration = 1800, up = UP }, done) {
  const f = { t0: performance.now(), duration: reducedMotion ? 1 : duration, fromPos: camera.position.clone(), toPos, fromTarget: controls.target.clone(), toTarget, lift, done,
    fromUp: camera.up.clone(), toUp: up.clone() };
  if (center) {
    f.center = center;
    f.a = f.fromPos.clone().sub(center);
    f.b = toPos.clone().sub(center);
    f.q = new THREE.Quaternion().setFromUnitVectors(f.a.clone().normalize(), f.b.clone().normalize());
  }
  flight = f;
  controls.enabled = false;
}

function stepFlight(now) {
  const f = flight, k = Math.min(1, (now - f.t0) / f.duration), e = ease(k);
  controls.target.lerpVectors(f.fromTarget, f.toTarget, e);
  if (f.center) {
    const dir = f.a.clone().normalize().applyQuaternion(new THREE.Quaternion().slerp(f.q, e));
    camera.position.copy(f.center).addScaledVector(dir, THREE.MathUtils.lerp(f.a.length(), f.b.length(), e));
  } else {
    camera.position.lerpVectors(f.fromPos, f.toPos, e);
    camera.position.y += Math.sin(Math.PI * e) * f.lift;
  }
  const u = f.fromUp.clone().lerp(f.toUp, e);
  if (u.lengthSq() > 1e-6) camera.up.copy(u.normalize());
  camera.lookAt(controls.target);
  if (k === 1) { flight = null; camera.up.copy(f.toUp); rebuildControls(); controls.enabled = true; f.done?.(); }
}

// ---------- worlds ----------
let current = null;
function homeView(key) {
  const b = bodies[key];
  const target = b.mesh.position.clone();
  return { target, pos: target.clone().addScaledVector(b.viewDir, b.radius * 3.4).addScaledVector(UP, b.radius * b.lift) };
}
function setLimits(key) {
  controls.minDistance = bodies[key].radius * 1.3;
  controls.maxDistance = 450; // scroll out to see the whole solar system
}

function setWorld(key) {
  if (current) labelOf[current].visible = true;
  current = key;
  if (key) labelOf[key].visible = false;
}

function goToWorld(key, instant = false) {
  if (key === current || flight) return;
  closePanel();
  setWorld(key);
  document.querySelectorAll('.worlds button[data-world]').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.world === key));
  $('list-title').textContent = worlds[key].name;
  renderList();
  const { target, pos } = homeView(key);
  controls.minDistance = 0;
  if (instant) { camera.position.copy(pos); controls.target.copy(target); setLimits(key); return; }
  $('flying').hidden = false;
  fly({ toPos: pos, toTarget: target, lift: 30, duration: 3200 }, () => { $('flying').hidden = true; setLimits(key); });
}

function focusArtifact(a) {
  if (flight) return;
  if (a.world !== current) { goToWorld(a.world); return; }
  const b = bodies[a.world], center = b.mesh.position.clone();
  const dir = a.marker.getWorldPosition(new THREE.Vector3()).sub(center).normalize();
  controls.autoRotate = false;
  controls.minDistance = 0;
  if (a.model) { // fly down to the 3D model and orbit around it
    const s = closeShot(a);
    fly({ toPos: s.pos, toTarget: s.target, center, duration: 2000, up: s.up }, () => { controls.minDistance = s.h * 1.2; });
  } else {
    fly({ toPos: center.clone().addScaledVector(dir, b.radius * 2.4), toTarget: center, center, duration: 1400 }, () => setLimits(a.world));
  }
  openPanel(a);
}

// ---------- UI ----------
function renderList() {
  const ul = $('artifact-list');
  ul.innerHTML = '';
  for (const a of artifacts.filter(x => x.world === current)) {
    const btn = document.createElement('button');
    btn.dataset.id = a.id;
    btn.innerHTML = `${a.name}<small>${a.landed.slice(-4)} · ${a.type}</small>`;
    btn.onclick = () => focusArtifact(a);
    const li = document.createElement('li');
    li.append(btn);
    ul.append(li);
  }
}

function videoHtml(src) {
  if (!src) return '<div>🎬 Video coming soon</div>';
  const yt = src.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="Video" allowfullscreen></iframe>`;
  return `<video src="${src}" controls preload="metadata"></video>`;
}

let selected = null;
// ---------- explorer progress, quiz and badge (kept in this browser only) ----------
const N = artifacts.length;
let prog = { seen: [], quiz: [], awarded: false };
try { prog = { ...prog, ...JSON.parse(localStorage.getItem('abf-progress')) }; } catch {}
const saveProg = () => { try { localStorage.setItem('abf-progress', JSON.stringify(prog)); } catch {} };
const year = a => +a.landed.slice(-4);

function updateScore() {
  $('score').textContent = `🏅 Found ${prog.seen.length}/${N} · Quiz ${prog.quiz.length}/${N}`;
  if (!prog.awarded && prog.seen.length === N && prog.quiz.length === N) { prog.awarded = true; saveProg(); showAward(); }
}
function markSeen(a) {
  if (!a || prog.seen.includes(a.id)) return;
  prog.seen.push(a.id); saveProg(); updateScore();
}

// one question per machine, built from the data so the answer is always right
function quizHtml(a) {
  if (prog.quiz.includes(a.id)) return `<p class="quiz-done">✓ You know it: ${a.name} landed in ${year(a)}.</p>`;
  const others = [...new Set(artifacts.map(year))].filter(y => y !== year(a)).sort((x, y) => Math.abs(x - year(a)) - Math.abs(y - year(a)));
  const options = [year(a), ...others.slice(0, 2)].sort((x, y) => x - y);
  return `<div class="quiz" data-id="${a.id}"><p>In which year did <b>${a.name}</b> land on ${worlds[a.world].name === 'Mars' ? 'Mars' : 'the Moon'}?</p>
    <div class="quiz-options">${options.map(y => `<button class="pill" data-year="${y}">${y}</button>`).join('')}</div>
    <p class="quiz-feedback" aria-live="polite"></p></div>`;
}
$('panel-body').addEventListener('click', e => {
  const b = e.target.closest('.quiz button');
  if (!b) return;
  const quiz = b.closest('.quiz'), a = artifacts.find(x => x.id === quiz.dataset.id), right = +b.dataset.year === year(a);
  b.classList.add(right ? 'right' : 'wrong');
  quiz.querySelector('.quiz-feedback').textContent = right ? `Correct! ${a.landed}.` : 'Not quite. Try again!';
  if (right) {
    quiz.querySelectorAll('button').forEach(x => (x.disabled = true));
    if (!prog.quiz.includes(a.id)) { prog.quiz.push(a.id); saveProg(); updateScore(); }
  }
});

function showAward() {
  const done = prog.seen.length === N && prog.quiz.length === N;
  $('award-body').innerHTML = `<div class="award-icon" aria-hidden="true">${done ? '🏅' : '🛰️'}</div>
    <h2 id="award-title">${done ? 'Mission Archivist!' : 'Your mission log'}</h2>
    <p>${done ? `You found all ${N} machines and answered every quiz. They are abandoned, but thanks to you, not forgotten.` : `Find all ${N} machines and answer each quiz to earn the Mission Archivist badge.`}</p>
    <ul class="log">${artifacts.map(a => `<li><span>${a.name}</span><span>${prog.seen.includes(a.id) ? '✓ found' : '— not yet'}${prog.quiz.includes(a.id) ? ' · ✓ quiz' : ''}</span></li>`).join('')}</ul>`;
  $('award').showModal();
}
$('score').onclick = showAward;
$('award-close').onclick = () => $('award').close();
updateScore();

function openPanel(a) {
  selected = a;
  markSeen(a);
  document.querySelectorAll('#artifact-list button').forEach(b => b.setAttribute('aria-current', b.dataset.id === a.id));
  const lat = `${Math.abs(a.lat).toFixed(2)}°${a.lat >= 0 ? 'N' : 'S'}`, lon = `${Math.abs(a.lon).toFixed(2)}°${a.lon >= 0 ? 'E' : 'W'}`;
  showPanel(`<div class="type">${worlds[a.world].name} · ${a.type}</div><h2>${a.name}</h2>`, `
    <span class="badge ${a.statusKind === 'active' ? 'active' : ''}">${a.status}</span>
    ${a.orbit ? `<figure class="compare">
      <div class="compare-box" style="--pos:50%">
        <img src="${a.photo}" alt="${a.photoCaption}">
        <img class="after" src="${a.orbit.src}" alt="${a.orbit.caption}">
        <span class="tag">Landing</span><span class="tag right">From orbit</span>
        <input type="range" min="0" max="100" value="50" aria-label="Slide between the landing photo and the view from orbit">
      </div>
      <figcaption>${a.photoCaption}<br>${a.orbit.caption}</figcaption>
    </figure>` : `<figure class="photo"><img src="${a.photo}" alt="${a.photoCaption}"><figcaption>${a.photoCaption}</figcaption></figure>`}
    <div class="video">${videoHtml(a.video)}</div>${a.video && !/youtu/.test(a.video) ? '<p class="si-note">Narration: AI text-to-speech voice · video assembled with SI-written code</p>' : ''}
    <h3>Story</h3>
    <p class="story ${a.story ? '' : 'empty'}">${a.story || 'Story and narration coming soon.'}</p>
    <dl class="facts">
      <div><dt>Launched</dt><dd>${a.launched}</dd></div>
      <div><dt>Landed</dt><dd>${a.landed}</dd></div>
      <div><dt>Last contact</dt><dd>${a.lastContact}</dd></div>
      <div><dt>Mass</dt><dd>${a.mass}</dd></div>
      <div class="wide"><dt>Location</dt><dd>${a.place}<br>${lat}, ${lon}</dd></div>
    </dl>
    <h3>From engineering to discovery</h3>
    <div class="journey">
      <div><b>It was built to…</b>${a.builtTo}</div>
      <div><b>What we learned</b>${a.learned}</div>
    </div>
    <h3>Did you know?</h3>
    <p class="dyk">${a.didYouKnow}</p>
    <h3>Quick quiz</h3>
    ${quizHtml(a)}
    <h3>Sources</h3>
    <ul class="sources">${a.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join('')}</ul>`);
}

// then-vs-now slider: the range input moves the wipe line
$('panel-body').addEventListener('input', e => {
  if (e.target.matches('.compare input')) e.target.parentElement.style.setProperty('--pos', `${e.target.value}%`);
});

function showPanel(titleHtml, bodyHtml) {
  $('panel-title').innerHTML = titleHtml;
  $('panel-body').innerHTML = bodyHtml;
  setPanelFolded(false);
  if (matchMedia('(max-width: 760px)').matches) setFolded(true); // phones: tuck the list away so they don't stack
  $('panel').hidden = false;
  $('panel').scrollTop = 0;
  $('close').focus({ preventScroll: true });
}

// foldable detail window: folded = only the title bar stays visible
function setPanelFolded(folded) {
  $('panel').classList.toggle('folded', folded);
  $('fold').setAttribute('aria-expanded', !folded);
  $('fold').setAttribute('aria-label', folded ? 'Unfold details' : 'Fold details');
}
$('fold').onclick = e => { e.stopPropagation(); setPanelFolded(!$('panel').classList.contains('folded')); };
document.querySelector('.panel-head').onclick = e => { if ($('panel').classList.contains('folded') && !e.target.closest('button')) setPanelFolded(false); };

function closePanel() {
  selected = null;
  $('panel').hidden = true;
  document.querySelectorAll('#artifact-list button').forEach(b => b.setAttribute('aria-current', false));
}

// foldable artifact list (starts folded on small screens so the globe stays visible)
const listToggle = $('list-toggle');
const setFolded = folded => { $('list').classList.toggle('folded', folded); listToggle.setAttribute('aria-expanded', !folded); };
listToggle.onclick = () => setFolded(listToggle.getAttribute('aria-expanded') === 'true');
setFolded(matchMedia('(max-width: 760px)').matches);

$('close').onclick = closePanel;
addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
document.querySelectorAll('.worlds button[data-world]').forEach(btn => {
  btn.querySelector('img').src = worlds[btn.dataset.world].icon;
  btn.onclick = () => goToWorld(btn.dataset.world);
});
$('credits-btn').onclick = () => {
  closePanel();
  showPanel('<div class="type">About</div><h2>Image credits</h2>', `<ul class="sources">${credits.map(c => `<li>${c}</li>`).join('')}</ul>
    <h3>About this site</h3><p>Sizes and distances in the 3D view are not to scale. Code and data were written with help from Claude (Anthropic), an SI tool, and checked against the NASA sources listed for each artifact.</p>`);
};

// click (not drag) on a marker
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pick = e => {
  if (!current) return; // story chapters between worlds have nothing to click
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(bodies[current].markers)[0]?.object.userData.artifact;
};
let down = null;
renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; controls.autoRotate = false; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const a = pick(e);
  if (mode === 'story') { if (a) openPanel(a); return; } // in the story the scroll drives the camera
  a ? focusArtifact(a) : closePanel();
});
renderer.domElement.addEventListener('pointermove', e => { renderer.domElement.style.cursor = pick(e) ? 'pointer' : ''; });

// portrait phones get a wider lens so globes aren't cropped at the sides
const fitLens = () => {
  camera.aspect = innerWidth / innerHeight;
  camera.fov = camera.aspect < 1 ? Math.min(75, 45 / camera.aspect * 0.75) : 45;
  camera.updateProjectionMatrix();
};
fitLens();
addEventListener('resize', () => {
  fitLens();
  renderer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
});

// ---------- loop ----------
const clock = new THREE.Clock();
const tmpV = new THREE.Vector3();
renderer.setAnimationLoop(now => {
  const t = clock.getElapsedTime();
  if (!reducedMotion) {
    sun.rotation.y += 0.0005;
    for (const m of spinning) m.rotation.y += 0.002;
  }
  for (const b of Object.values(bodies)) {
    for (const m of b.markers) {
      m.scale.setScalar(m.userData.base * (m.userData.artifact === selected ? 1.8 : 1 + 0.35 * Math.sin(t * 3)));
      // the glowing dot gives way to the 3D model when the camera is close
      const mo = m.userData.artifact.modelObj;
      m.visible = !(mo && camera.position.distanceTo(mo.getWorldPosition(tmpV)) < b.radius * 0.4);
    }
  }
  if (mode === 'story') updateStoryCamera();
  else if (flight) stepFlight(now);
  else controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

// ---------- scroll story ----------
let mode = 'story';
const byId = Object.fromEntries(artifacts.map(a => [a.id, a]));

function shotFor(spec) {
  const [kind, arg] = spec.split(':');
  if (kind === 'overview') return { pos: new THREE.Vector3(150, 150, 210), target: new THREE.Vector3(85, 0, 20) }; // Sun off to the side, behind the title
  if (kind === 'earth') {
    const e = planetMeshes.earth.position, dir = e.clone().negate().normalize().applyAxisAngle(UP, 0.7);
    return { pos: e.clone().addScaledVector(dir, 16).addScaledVector(UP, 5), target: e.clone() };
  }
  if (kind === 'world') { const v = homeView(arg); return { ...v, center: v.target, world: arg }; }
  if (kind === 'transit') {
    const m = bodies.moon.mesh.position, r = bodies.mars.mesh.position;
    return { pos: m.clone().lerp(r, 0.4).addScaledVector(UP, 26), target: r.clone() };
  }
  const a = byId[arg], b = bodies[a.world], center = b.mesh.position.clone();
  const dir = a.marker.getWorldPosition(new THREE.Vector3()).sub(center).normalize();
  if (a.model) return { ...closeShot(a), center, world: a.world, artifact: a };
  const dist = b.radius * 2.3;
  return { pos: center.clone().addScaledVector(dir, dist), target: center, center, world: a.world, artifact: a };
}

const chapters = storyChapters.map(c => ({ ...c, a: c.shot.startsWith('artifact:') ? byId[c.shot.split(':')[1]] : null }));
const pad = n => String(n).padStart(2, '0');
const years = artifacts.map(a => +a.landed.slice(-4));
function cardHtml(c, i) {
  const num = `<span class="num">${pad(i + 1)} / ${pad(chapters.length)}</span>`;
  if (c.a) {
    const a = c.a, live = a.statusKind === 'active';
    return `<figure class="photo"><img src="${a.photo}" alt="${a.photoCaption}" loading="lazy"><figcaption>${a.photoCaption}</figcaption></figure>
      <div class="meta">${num}<span class="chip">${worlds[a.world].name}</span><span class="chip">${a.landed.slice(-4)}</span>
        <span class="chip ${live ? 'live' : 'silent'}">${live ? 'Still working' : 'Silent'}</span></div>
      <h2>${a.name}</h2><p class="lead">${a.story || a.learned}</p>
      <div class="dyk"><b>Did you know?</b>${a.didYouKnow}</div>
      <div class="actions"><button class="pill primary" data-open="${a.id}">Read the full file →</button></div>`;
  }
  if (c.kind === 'intro') return `<div class="kicker">NASA Space Apps Challenge 2026</div><h2>${c.title}</h2><p class="lead">${c.text}</p>
      <ul class="stats"><li><b>${artifacts.length}</b>machines</li><li><b>${Object.keys(worlds).length}</b>worlds</li><li><b>${Math.min(...years)}–${Math.max(...years)}</b>landings</li></ul>
      <div class="scroll-cue" aria-hidden="true"><span></span>Scroll to begin</div>`;
  if (c.kind === 'outro') return `<h2>${c.title}</h2><p class="lead">${c.text}</p>
      <div class="actions"><button class="pill primary" data-explore>Explore freely</button><button class="pill" data-top>Back to the start</button></div>`;
  return `<div class="meta">${num}</div><h2>${c.title}</h2><p class="lead">${c.text}</p>`;
}
$('story').innerHTML = chapters.map((c, i) => `<section class="chapter ${c.kind || ''} ${c.a ? 'artifact' : ''}"><div class="card">${cardHtml(c, i)}</div></section>`).join('');

// chapter dots: jump anywhere in the story
$('dots').innerHTML = chapters.map((c, i) => `<li><button data-i="${i}" aria-label="Chapter ${i + 1}: ${c.a ? c.a.name : c.title}"><span>${c.a ? c.a.name : c.title}</span></button></li>`).join('');
$('dots').onclick = e => { const b = e.target.closest('button'); if (b) scrollTo({ top: b.dataset.i * innerHeight, behavior: reducedMotion ? 'auto' : 'smooth' }); };
$('story').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.open) openPanel(byId[b.dataset.open]);
  if ('explore' in b.dataset) enterExplore();
  if ('top' in b.dataset) scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

let shots = [];
const camGoal = new THREE.Vector3(), targetGoal = new THREE.Vector3();
let activeChapter = -1;
const viewOff = { x: 0, y: 0 };
const sections = () => document.querySelectorAll('.chapter');

function updateStoryCamera() {
  if (!shots.length) shots = chapters.map(c => shotFor(c.shot)); // after markers have world positions
  const p = THREE.MathUtils.clamp(scrollY / innerHeight, 0, shots.length - 1);
  const i = Math.min(Math.floor(p), shots.length - 2);
  const t = ease(THREE.MathUtils.smoothstep(p - i, 0.25, 0.85)); // hold each shot while its card is on screen
  const a = shots[i], b = shots[i + 1];
  targetGoal.lerpVectors(a.target, b.target, t);
  if (a.center && b.center && a.center.equals(b.center)) { // same world: swing around it, never through it
    const va = a.pos.clone().sub(a.center), vb = b.pos.clone().sub(a.center);
    const q = new THREE.Quaternion().setFromUnitVectors(va.clone().normalize(), vb.clone().normalize());
    const hop = Math.sin(Math.PI * t) * va.angleTo(vb) * a.pos.distanceTo(a.center) * 0.8;
    camGoal.copy(a.center).addScaledVector(va.normalize().applyQuaternion(new THREE.Quaternion().slerp(q, t)), THREE.MathUtils.lerp(a.pos.distanceTo(a.center), b.pos.distanceTo(a.center), t) + hop);
  } else {
    camGoal.lerpVectors(a.pos, b.pos, t).addScaledVector(UP, Math.sin(Math.PI * t) * a.pos.distanceTo(b.pos) * 0.25);
  }
  const k = reducedMotion ? 1 : 0.08; // smoothing gives the "film camera" feel
  camera.position.lerp(camGoal, k);
  controls.target.lerp(targetGoal, k);
  const upGoal = (a.up || UP).clone().lerp(b.up || UP, t);
  if (upGoal.lengthSq() > 1e-6) camera.up.lerp(upGoal.normalize(), k).normalize();
  camera.lookAt(controls.target);

  // slide the 3D picture away from the card: card on the left -> world shifts right (phones: cards at bottom -> world shifts up)
  const n = Math.round(p), c = chapters[n], phone = innerWidth <= 760;
  const gx = phone || c.kind ? 0 : (n % 2 === 0 ? -0.17 : 0.17) * innerWidth;
  const gy = phone && !c.kind ? 0.18 * innerHeight : 0;
  viewOff.x += (gx - viewOff.x) * k;
  viewOff.y += (gy - viewOff.y) * k;
  camera.setViewOffset(innerWidth, innerHeight, viewOff.x, viewOff.y, innerWidth, innerHeight);

  if (n !== activeChapter) {
    activeChapter = n;
    sections().forEach((s, j) => s.classList.toggle('in', j === n));
    document.querySelectorAll('#dots button').forEach((d, j) => d.toggleAttribute('aria-current', j === n));
    const c = shots[n];
    setWorld(c.world || null);
    selected = c.artifact || null;
    markSeen(c.artifact);
  }
  $('progress-bar').style.width = `${(p / (shots.length - 1)) * 100}%`;
}

function enterExplore() {
  mode = 'explore';
  camera.clearViewOffset();
  document.body.classList.replace('story-mode', 'explore-mode');
  renderer.domElement.style.touchAction = 'none';
  controls.enabled = true;
  selected = null;
  closePanel();
  const from = current || 'moon';
  setWorld(null);
  goToWorld(from);
}

function enterStory() {
  mode = 'story';
  flight = null;
  $('flying').hidden = true;
  closePanel();
  document.body.classList.replace('explore-mode', 'story-mode');
  renderer.domElement.style.touchAction = 'pan-y'; // let phones scroll the page over the canvas
  controls.enabled = false;
  controls.autoRotate = false;
  activeChapter = -1;
  scrollTo({ top: 0 });
}

$('skip').onclick = enterExplore;
$('back-to-story').onclick = enterStory;
enterStory();