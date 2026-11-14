// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Apollo 11 artifact video: Ken Burns on public-domain NASA images, word-synced captions, AI voice.
import { AbsoluteFill, Audio, Img, Sequence, interpolate, Easing, staticFile, useCurrentFrame } from 'remotion';
import { loadFont as loadDisplay } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadBody } from '@remotion/google-fonts/Inter';
import timings from '../public/timings.json';

const { fontFamily: DISPLAY } = loadDisplay('normal', { weights: ['500', '700'] });
const { fontFamily: BODY } = loadBody('normal', { weights: ['400', '600'] });

export const FPS = 30;
const ACCENT = '#ffb347';
const LEAD = 0.5;                       // seconds of picture before the voice starts
const TAIL = 2.6;                       // end card after the voice stops
const L = timings.lines.map(l => ({ ...l, start: l.start + LEAD, end: l.end + LEAD }));
const TOTAL = timings.end + LEAD + TAIL;
export const durationInFrames = Math.ceil(TOTAL * FPS);
const f = s => Math.round(s * FPS);
const FADE = 15;                        // crossfade length in frames

// Shot boundaries follow the narration lines.
const cut = [0, f(L[1].start - 0.3), f(L[2].start - 0.3), f(L[3].start - 0.3), durationInFrames];
const SHOTS = [
  // img, [zoom from, to], [x%, y%] from, to  (object-position for the pan)
  { src: 'moon.jpg',  zoom: [1.0, 1.25], from: [50, 50], to: [56.5, 50] },
  { src: 'eagle.jpg', zoom: [1.0, 1.12], from: [50, 20], to: [50, 55] },
  { src: 'eagle.jpg', zoom: [1.15, 1.45], from: [50, 55], to: [45, 72] },
  { src: 'moon.jpg',  zoom: [1.25, 1.9], from: [56.5, 50], to: [56.5, 50] },
];

const ease = Easing.inOut(Easing.cubic);
const lerp = (a, b, t) => a + (b - a) * t;

const Shot = ({ shot, from, to }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const opacity = interpolate(frame, [from, from + FADE], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const z = lerp(shot.zoom[0], shot.zoom[1], t);
  const x = lerp(shot.from[0], shot.to[0], t), y = lerp(shot.from[1], shot.to[1], t);
  return (
    <AbsoluteFill style={{ opacity: from === 0 ? 1 : opacity }}>
      <Img src={staticFile(shot.src)} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${x}% ${y}%`,
        transform: `scale(${z})`, transformOrigin: `${x}% ${y}%`,
      }} />
    </AbsoluteFill>
  );
};

const Card = ({ title, sub, inAt, outAt }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [inAt, inAt + 15, outAt - 15, outAt], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rise = interpolate(frame, [inAt, inAt + 25], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(5,7,15,${0.55 * o})`, justifyContent: 'center', alignItems: 'center', opacity: o }}>
      <div style={{ transform: `translateY(${rise}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, color: '#fff', letterSpacing: -1, textShadow: '0 4px 24px rgba(0,0,0,.6)' }}>{title}</div>
        <div style={{ width: 80, height: 3, background: ACCENT, margin: '18px auto' }} />
        <div style={{ fontFamily: BODY, fontSize: 28, color: '#dfe6f3' }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// Shows the current narration line; each word lights up as it is spoken.
const Captions = ({ hideUntil, hideFrom }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (frame < hideUntil || frame >= hideFrom) return null;
  const line = [...L].reverse().find(l => t >= l.start - 0.15);
  if (!line || t > line.end + 0.7) return null;
  const o = interpolate(frame, [hideUntil, hideUntil + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56, opacity: o }}>
      <div style={{ maxWidth: 1040, textAlign: 'center', fontFamily: BODY, fontWeight: 600, fontSize: 36, lineHeight: 1.35,
        padding: '14px 26px', borderRadius: 14, background: 'rgba(5,7,15,.55)' }}>
        {line.words.map((w, i) => {
          const s = w.t + LEAD;
          const active = t >= s && t < s + w.d + 0.05;
          return <span key={i} style={{ color: active ? ACCENT : t >= s ? '#fff' : 'rgba(255,255,255,.45)' }}>{w.w} </span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Apollo11 = () => {
  const titleOut = f(3.6);
  const endIn = f(L[3].end + 0.4);
  return (
    <AbsoluteFill style={{ background: '#05070f' }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={0} durationInFrames={i === SHOTS.length - 1 ? durationInFrames : cut[i + 1] + FADE}>
          <Shot shot={s} from={cut[i]} to={i === SHOTS.length - 1 ? durationInFrames : cut[i + 1] + FADE} />
        </Sequence>
      ))}
      {/* vignette */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)' }} />
      <Sequence from={f(LEAD)}><Audio src={staticFile('voice.mp3')} /></Sequence>
      <Captions hideUntil={titleOut - 5} hideFrom={endIn} />
      <Card title="Apollo 11 · Eagle" sub="Sea of Tranquility · 20 July 1969" inAt={0} outAt={titleOut} />
      <Card title="Abandoned but not Forgotten" sub="Photos: NASA (public domain) · Voice: AI text-to-speech" inAt={endIn} outAt={durationInFrames + 15} />
      {/* visible SI watermark on every frame (Space Apps 2026 rule) */}
      <div style={{ position: 'absolute', top: 18, right: 22, fontFamily: BODY, fontSize: 16, color: ACCENT,
        background: 'rgba(0,0,0,.6)', padding: '6px 12px', borderRadius: 8 }}>
        SI-assisted video · AI narration (text-to-speech)
      </div>
    </AbsoluteFill>
  );
};
