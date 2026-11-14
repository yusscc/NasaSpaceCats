# Beyond the Void

NASA Space Apps Challenge 2026: [Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/)

An interactive 3D storytelling website for school-age space fans (ages 8–18). Fly through the solar system to the Moon and Mars, click the machines NASA left behind, and learn what each was built to do and what we discovered because of it.

## Features
- **Cinematic scroll story:** scrolling moves the camera like a film, from the solar system to Earth, then the Moon's three landing sites, the flight to Mars, and Mars' four machines. Each chapter card links to the full file.
- **Explore freely mode** at the end (or via the top-right button): drag, zoom and click your own way through.
- 3D solar system (Sun, 8 planets, the Moon). The Sun is the light source, so every world has a real day and night side.
- Animated camera flight between the Moon and Mars.
- 7 artifacts placed at their real landing coordinates:
  - Moon: Surveyor 3, Apollo 11 *Eagle*, Apollo 15 Lunar Roving Vehicle
  - Mars: Viking 1, Sojourner, Opportunity, Ingenuity
- Foldable detail window for each artifact: video slot, story, facts, "built to → what we learned", "did you know", NASA sources.
- Keyboard accessible, mobile layout, respects reduced-motion settings.

## Run locally
A plain static site with no build step. ES modules need a local server:

```bash
python -m http.server 5500
```

Then open http://localhost:5500.

## Project structure
```
index.html          page shell
css/style.css       styles
js/app.js           3D scene (three.js), camera flights, UI
data/artifacts.js   artifacts, planets, credits  ← edit content here
assets/textures/    planet, Sun and star textures
assets/icons/       Moon / Mars button icons
assets/models/      NASA 3D models (GLB) shown in close-ups
assets/orbit/       orbiter photos for the landing-vs-orbit slider
videos/             artifact videos (+ narration scripts)
video/              Remotion project that renders the videos
docs/PLAN.md        challenge analysis, rules, plan
SI_LOG.md           record of Super Intelligence (AI) use
```

### Adding a story or video
Story chapter texts (intro, Earth, Moon, Mars, ending) are in `storyChapters` in `data/artifacts.js`. Rewrite them in your own voice. An artifact's `story` text replaces its default chapter text when filled in. For artifacts, fill in the `story` text, and set `video` to a YouTube link or a file path such as `videos/opportunity.mp4`.

### Making an artifact video
Videos are built with [Remotion](https://www.remotion.dev/) in `video/`. The narration text lives in `videos/<id>.txt`; the AI voice (`video/public/voice.mp3`) and word timings (`video/public/timings.json`) come from Microsoft Edge neural text-to-speech via `edge-tts`.
```
cd video
npm install
npm run studio    # preview and edit
npm run render    # writes out/apollo-11-eagle.mp4; copy it to ../videos/
```

### Submission demo video (≤ 30 s)
`videos/demo.mp4` is the Space Apps demo. To rebuild it after the site changes (site served on http://localhost:5500):
```
cd video
npm run capture                              # screenshots of the live site -> public/demo/
python tts.py ../videos/demo.txt public/demo # AI voice + word timings from the script
npm run render:demo                          # writes out/demo.mp4; copy it to ../videos/
```

## NASA data & resources
- [NASA Space Science Data Coordinated Archive (NSSDCA)](https://nssdc.gsfc.nasa.gov/): mission parameters and status
- NASA Science mission pages (linked per artifact in `data/artifacts.js`)
- NASA Viking MDIM 2.1 colorized Mars mosaic (USGS, public domain)
- Orbiter photos of each landing site: NASA Lunar Reconnaissance Orbiter (NASA/GSFC/Arizona State University) and Mars Reconnaissance Orbiter HiRISE (NASA/JPL/University of Arizona), public domain
- [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources): Apollo Lunar Module, Viking Lander, Opportunity rover and Ingenuity helicopter models

## Credits
- Mars map: NASA Viking MDIM 2.1 colorized mosaic, USGS (public domain)
- Moon map: NASA imagery via [three.js examples](https://github.com/mrdoob/three.js)
- Sun, planets, Saturn rings, star background: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0), via Wikimedia Commons
- Button icons: NASA LRO Moon nearside and NASA Viking Mars mosaic (public domain), via Wikimedia Commons
- 3D models: [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) (free to use; shown much larger than real scale)
- Video narration: AI text-to-speech (Microsoft Edge neural voice `en-US-AriaNeural`)
- 3D engine: [three.js](https://threejs.org/) r160 (MIT); videos: [Remotion](https://www.remotion.dev/)

Sizes and distances in the 3D view are not to scale.

## License
© 2026 yusscc and the NasaSpaceCats team. **All rights reserved.** See [LICENSE](LICENSE). Third-party assets keep their own licenses.

## Use of Super Intelligence (SI)
Code and data were written with help from Claude (Anthropic). The project idea and the stories are the team's own. Every SI-assisted file says so in its header. See [SI_LOG.md](SI_LOG.md) for details. NASA logos and branding are not used in any generated content.
