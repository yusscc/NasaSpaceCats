// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Surveyor 3 artifact video: public-domain NASA images, narration in ../../videos/surveyor-3.txt.
import { Story, durationFor } from './Story';
import timings from '../public/surveyor-3-timings.json';

export const surveyor3Duration = durationFor(timings);

const shots = [
  { line: 0, src: 'moon.jpg',             zoom: [1.0, 1.25], from: [50, 50], to: [43.5, 51.7] }, // Moon map, easing toward the Ocean of Storms
  { line: 1, src: 'surveyor-3.jpg',       zoom: [1.0, 1.15], from: [25, 60], to: [30, 50] },
  { line: 2, src: 'orbit-surveyor-3.jpg', zoom: [1.0, 1.3],  from: [50, 50], to: [75, 58] }, // LRO: pan to Surveyor 3 on the crater rim
  { line: 3, src: 'surveyor-3.jpg',       zoom: [1.2, 1.45], from: [40, 45], to: [48, 40] },
];

export const Surveyor3 = () => (
  <Story timings={timings} voice="surveyor-3-voice.mp3" shots={shots}
    title={{ title: 'Surveyor 3', sub: 'Ocean of Storms · 20 April 1967' }}
    end={{ title: 'Beyond the Void', sub: 'Photos: NASA (public domain) · Voice: AI text-to-speech' }} />
);
