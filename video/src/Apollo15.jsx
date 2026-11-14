// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Apollo 15 rover artifact video: public-domain NASA images, narration in ../../videos/apollo-15-lrv.txt.
import { Story, durationFor } from './Story';
import timings from '../public/apollo-15-timings.json';

export const apollo15Duration = durationFor(timings);

const shots = [
  { line: 0, src: 'moon.jpg',       zoom: [1.0, 1.25], from: [50, 50], to: [51, 35.5] }, // Moon map, easing toward Hadley-Apennine
  { line: 1, src: 'lrv-irwin.jpg',  zoom: [1.0, 1.15], from: [50, 60], to: [45, 65] },
  { line: 2, src: 'lrv-irwin.jpg',  zoom: [1.1, 1.35], from: [50, 40], to: [60, 15] },   // tilt up to Mount Hadley
  { line: 3, src: 'lrv-parked.jpg', zoom: [1.0, 1.2],  from: [50, 55], to: [20, 35] },   // the rover's last parking spot, toward its TV camera
];

export const Apollo15 = () => (
  <Story timings={timings} voice="apollo-15-voice.mp3" shots={shots}
    title={{ title: 'Apollo 15 · Lunar Rover', sub: 'Hadley–Apennine · 30 July 1971' }}
    end={{ title: 'Beyond the Void', sub: 'Photos: NASA (public domain) · Voice: AI text-to-speech' }} />
);
