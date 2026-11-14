# Abandoned but not Forgotten

NASA Space Apps Challenge 2026: [Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/)

An interactive 3D storytelling website for school-age space fans (ages 8–18). Fly through the solar system to the Moon and Mars, click the machines NASA left behind, and learn what each was built to do and what we discovered because of it.

## Features
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
docs/PLAN.md        challenge analysis, rules, plan
SI_LOG.md           record of Super Intelligence (AI) use
```

### Adding a story or video
In `data/artifacts.js`, fill in the artifact's `story` text, and set `video` to a YouTube link or a file path such as `videos/opportunity.mp4`.

## NASA data & resources
- [NASA Space Science Data Coordinated Archive (NSSDCA)](https://nssdc.gsfc.nasa.gov/): mission parameters and status
- NASA Science mission pages (linked per artifact in `data/artifacts.js`)
- NASA Viking MDIM 2.1 colorized Mars mosaic (USGS, public domain)

## Credits
- Mars map: NASA Viking MDIM 2.1 colorized mosaic, USGS (public domain)
- Moon map: NASA imagery via [three.js examples](https://github.com/mrdoob/three.js)
- Sun, planets, Saturn rings, star background: [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0), via Wikimedia Commons
- Button icons: NASA LRO Moon nearside and NASA Viking Mars mosaic (public domain), via Wikimedia Commons
- 3D engine: [three.js](https://threejs.org/) r160 (MIT)

Sizes and distances in the 3D view are not to scale.

## Use of Super Intelligence (SI)
Code and data were written with help from Claude (Anthropic). The project idea and the stories are the team's own. Every SI-assisted file says so in its header. See [SI_LOG.md](SI_LOG.md) for details. NASA logos and branding are not used in any generated content.
