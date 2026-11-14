// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Apollo 11 artifact video: public-domain NASA images, narration in ../../videos/apollo-11-eagle.txt.
import { Story, durationFor } from './Story';
import timings from '../public/timings.json';

export const apollo11Duration = durationFor(timings);

// line = narration line the shot starts on; zoom and pan go from -> to
const shots = [
  { line: 0, src: 'moon.jpg',  zoom: [1.0, 1.25], from: [50, 50], to: [56.5, 50] }, // Moon map, easing toward Tranquility
  { line: 1, src: 'eagle.jpg', zoom: [1.0, 1.12], from: [50, 20], to: [50, 55] },
  { line: 2, src: 'eagle.jpg', zoom: [1.15, 1.45], from: [50, 55], to: [45, 72] },
  { line: 3, src: 'moon.jpg',  zoom: [1.25, 1.9], from: [56.5, 50], to: [56.5, 50] },
];

export const Apollo11 = () => (
  <Story timings={timings} voice="voice.mp3" shots={shots}
    title={{ title: 'Apollo 11 · Eagle', sub: 'Sea of Tranquility · 20 July 1969' }}
    end={{ title: 'Abandoned but not Forgotten', sub: 'Photos: NASA (public domain) · Voice: AI text-to-speech' }} />
);
