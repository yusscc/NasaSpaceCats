// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Space Apps submission demo (30 s max): screenshots of the site from capture.mjs, narration in ../../videos/demo.txt.
import { Story, durationFor } from './Story';
import timings from '../public/demo-timings.json';

export const demoDuration = durationFor(timings);

const s = (line, name, zoom = [1, 1.08], from = [50, 50], to = [50, 50]) => ({ line, src: `demo/${name}.png`, zoom, from, to });
const shots = [
  s(0, '01-intro'),
  s(0, '02-story-eagle', [1, 1.08], [30, 50], [40, 50]),
  s(1, '03-eagle-model', [1.05, 1.2], [60, 60], [62, 62]),
  s(1, '05-ingenuity-model', [1.05, 1.2], [50, 60], [50, 62]),
  s(2, '04-orbit-slider', [1.1, 1.45], [90, 45], [90, 45]),
  s(3, '06-quiz', [1.05, 1.25], [60, 70], [60, 72]),
  s(3, '07-badge', [1.05, 1.3], [50, 45], [50, 45]),
];

export const Demo = () => (
  <Story timings={timings} voice="demo-voice.mp3" shots={shots} titleUntil={2.4}
    title={{ title: 'Beyond the Void', sub: 'A 3D story of NASA hardware on the Moon and Mars' }}
    end={{ title: 'Explore it yourself', sub: 'Photos & 3D models: NASA · Voice: AI text-to-speech · SI-assisted' }} />
);
