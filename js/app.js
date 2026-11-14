// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { planets, worlds, artifacts, credits } from '../data/artifacts.js';

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
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.05, 5000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = !reducedMotion;
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

// ---------- camera flights ----------
let flight = null;
const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

// Around one body: slerp so we never pass through it. Between bodies: straight line rising above the solar system.
function fly({ toPos, toTarget, center = null, lift = 0, duration = 1800 }, done) {
  const f = { t0: performance.now(), duration: reducedMotion ? 1 : duration, fromPos: camera.position.clone(), toPos, fromTarget: controls.target.clone(), toTarget, lift, done };
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
  if (k === 1) { flight = null; controls.enabled = true; f.done?.(); }
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

function goToWorld(key, instant = false) {
  if (key === current || flight) return;
  closePanel();
  const first = current === null;
  if (current) labelOf[current].visible = true;
  current = key;
  labelOf[key].visible = false;
  document.querySelectorAll('.worlds button').forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.world === key));
  $('list-title').textContent = worlds[key].name;
  renderList();
  const { target, pos } = homeView(key);
  controls.minDistance = 0;
  if (instant || first) { camera.position.copy(pos); controls.target.copy(target); setLimits(key); return; }
  $('flying').hidden = false;
  fly({ toPos: pos, toTarget: target, lift: 30, duration: 3200 }, () => { $('flying').hidden = true; setLimits(key); });
}

function focusArtifact(a) {
  if (flight) return;
  if (a.world !== current) { goToWorld(a.world); return; }
  const b = bodies[a.world], center = b.mesh.position.clone();
  const dir = a.marker.getWorldPosition(new THREE.Vector3()).sub(center).normalize();
  controls.autoRotate = false;
  fly({ toPos: center.clone().addScaledVector(dir, b.radius * 2.4), toTarget: center, center, duration: 1400 });
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
function openPanel(a) {
  selected = a;
  document.querySelectorAll('#artifact-list button').forEach(b => b.setAttribute('aria-current', b.dataset.id === a.id));
  const lat = `${Math.abs(a.lat).toFixed(2)}°${a.lat >= 0 ? 'N' : 'S'}`, lon = `${Math.abs(a.lon).toFixed(2)}°${a.lon >= 0 ? 'E' : 'W'}`;
  showPanel(`<div class="type">${worlds[a.world].name} · ${a.type}</div><h2>${a.name}</h2>`, `
    <span class="badge ${a.statusKind === 'active' ? 'active' : ''}">${a.status}</span>
    <div class="video">${videoHtml(a.video)}</div>
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
    <h3>Sources</h3>
    <ul class="sources">${a.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join('')}</ul>`);
}

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
document.querySelectorAll('.worlds button').forEach(btn => {
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
  ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.intersectObjects(bodies[current].markers)[0]?.object.userData.artifact;
};
let down = null;
renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; controls.autoRotate = false; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const a = pick(e);
  a ? focusArtifact(a) : closePanel();
});
renderer.domElement.addEventListener('pointermove', e => { renderer.domElement.style.cursor = pick(e) ? 'pointer' : ''; });

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
});

// ---------- loop ----------
const clock = new THREE.Clock();
renderer.setAnimationLoop(now => {
  const t = clock.getElapsedTime();
  if (!reducedMotion) {
    sun.rotation.y += 0.0005;
    for (const m of spinning) m.rotation.y += 0.002;
  }
  for (const b of Object.values(bodies)) {
    for (const m of b.markers) m.scale.setScalar(m.userData.base * (m.userData.artifact === selected ? 1.8 : 1 + 0.35 * Math.sin(t * 3)));
  }
  if (flight) stepFlight(now); else controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

goToWorld('moon', true);