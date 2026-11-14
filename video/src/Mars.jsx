// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
// Mars artifact videos: public-domain NASA images, narration in ../../videos/<id>.txt.
import { Story, durationFor } from './Story';
import viking from '../public/viking-1-timings.json';
import sojourner from '../public/sojourner-timings.json';
import opportunity from '../public/opportunity-timings.json';
import ingenuity from '../public/ingenuity-timings.json';

const end = { title: 'Beyond the Void', sub: 'Photos: NASA / JPL (public domain) · Voice: AI text-to-speech' };
// mars.jpg is an equirectangular map: x = 50 + lon/3.6, y = 50 - lat/1.8 (percent)
const toSite = (lon, lat) => ({ line: 0, src: 'mars.jpg', zoom: [1.0, 1.3], from: [50, 50], to: [50 + lon / 3.6, 50 - lat / 1.8] });

export const videos = [
  { id: 'Viking1', timings: viking, voice: 'viking-1-voice.mp3', title: { title: 'Viking 1', sub: 'Chryse Planitia · 20 July 1976' }, shots: [
    toSite(-47.95, 22.27),
    { line: 1, src: 'viking-pano.png',    zoom: [1.0, 1.15], from: [30, 50], to: [45, 55] },  // sampling arm and trenches
    { line: 2, src: 'viking-sunset.jpg',  zoom: [1.0, 1.2],  from: [50, 40], to: [45, 60] },
    { line: 3, src: 'orbit-viking-1.jpg', zoom: [1.0, 1.8],  from: [50, 50], to: [50, 52] },  // HiRISE: the lander is the bright dot
  ] },
  { id: 'Sojourner', timings: sojourner, voice: 'sojourner-voice.mp3', title: { title: 'Sojourner', sub: 'Ares Vallis · 4 July 1997' }, shots: [
    toSite(-33.22, 19.13),
    { line: 1, src: 'sojourner-yogi.jpg',       zoom: [1.0, 1.4],  from: [50, 50], to: [85, 45] }, // in on the rover beside Yogi rock
    { line: 2, src: 'sojourner-pathfinder.jpg', zoom: [1.1, 1.35], from: [50, 50], to: [60, 55] },
    { line: 3, src: 'sojourner-yogi.jpg',       zoom: [1.5, 1.0],  from: [85, 45], to: [50, 50] }, // pull back out
  ] },
  { id: 'Opportunity', timings: opportunity, voice: 'opportunity-voice.mp3', title: { title: 'Opportunity', sub: 'Meridiani Planum · 25 January 2004' }, shots: [
    toSite(-5.53, -1.95),
    { line: 1, src: 'opportunity-self.jpg',   zoom: [1.0, 1.2],  from: [50, 50], to: [50, 45] },
    { line: 2, src: 'opportunity-pano.jpg',   zoom: [1.2, 1.2],  from: [10, 50], to: [90, 50] }, // pan across the Greeley panorama
    { line: 3, src: 'opportunity-shadow.jpg', zoom: [1.0, 1.25], from: [50, 60], to: [50, 40] },
  ] },
  { id: 'Ingenuity', timings: ingenuity, voice: 'ingenuity-voice.mp3', title: { title: 'Ingenuity', sub: 'Jezero Crater · 18 February 2021' }, shots: [
    toSite(77.45, 18.44),
    { line: 1, src: 'ingenuity-quad.png',  zoom: [1.0, 1.1], from: [50, 60], to: [50, 70] },
    { line: 2, src: 'ingenuity-photo.jpg', zoom: [1.0, 1.3], from: [50, 50], to: [48, 45] },
    { line: 3, src: 'orbit-ingenuity.jpg', zoom: [1.0, 1.4], from: [50, 50], to: [42, 62] }, // HiRISE: red circle
  ] },
].map(v => ({ ...v, duration: durationFor(v.timings), component: () => <Story {...v} end={end} /> }));
