# Super Intelligence (SI) Usage Log

Required by NASA Space Apps 2026: every project must describe how SI tools were used. AI images and videos need a visible watermark. AI audio, code and data need disclosure in text and metadata. This log is the source for the submission form's "Use of SI" field.

| Date | Tool | What it did | Where | Human review |
|---|---|---|---|---|
| 2026-11-14 | Claude (Anthropic) | Analysed the challenge statement, rules and judging criteria; drafted the build plan | `docs/PLAN.md` | Team chose the idea, audience and scope |
| 2026-11-14 | Claude (Anthropic) | Wrote the website code (3D scene, flights, UI) | `index.html`, `css/`, `js/` (header comment in each file, `generator` meta tag) | Team reviewed in browser |
| 2026-11-14 | Claude (Anthropic) | Compiled artifact facts from NASA/NSSDCA pages, with a source link per artifact | `data/artifacts.js` | Cross-checked by Claude on 2026-11-14 (2 fixes: Pathfinder orbit-photo date, Ingenuity's final location). **TODO: team does a final read** |
| 2026-11-14 | Claude (Anthropic) | Built the cinematic scroll-story mode (team chose this style from 4 examples) and drafted factual connective chapter text | `js/app.js`, `data/artifacts.js` (`storyChapters`) | **TODO: team rewrites chapter text in own voice** |
| 2026-11-14 | Claude (Anthropic) + Microsoft Edge neural text-to-speech (`en-US-AriaNeural`, via `edge-tts`) | Example artifact video: Claude drafted the factual narration and wrote the Remotion video code; the voice is AI text-to-speech; images are real NASA photos (public domain) | `videos/apollo-11-eagle.*`, `video/` (watermark on every frame, note under the player, MP4 `comment` metadata) | **TODO: team rewrites narration in own words; swap in the team's chosen AI voice** |
| 2026-11-14 | Claude (Anthropic) + Microsoft Edge neural text-to-speech (`en-US-AriaNeural`, via `edge-tts`) | Surveyor 3 and Apollo 15 rover videos: Claude drafted the factual narration from the data file and wrote the Remotion compositions; voice is AI text-to-speech; images are real NASA photos (public domain, via Wikimedia Commons) | `videos/surveyor-3.*`, `videos/apollo-15-lrv.*`, `video/src/Surveyor3.jsx`, `video/src/Apollo15.jsx` (watermark on every frame, MP4 `comment` metadata) | **TODO: team rewrites narration in own words** |
| 2026-11-14 | Claude (Anthropic) + Microsoft Edge neural text-to-speech (`en-US-AriaNeural`, via `edge-tts`) | Viking 1, Sojourner, Opportunity and Ingenuity videos: Claude drafted the factual narration from the data file and wrote the Remotion code; voice is AI text-to-speech; images are real NASA/JPL photos (public domain, via Wikimedia Commons) | `videos/{viking-1,sojourner,opportunity,ingenuity}.*`, `video/src/Mars.jsx` (watermark on every frame, MP4 `comment` metadata) | **TODO: team rewrites narration in own words** |
| 2026-11-14 | Claude (Anthropic) + Microsoft Edge neural text-to-speech (`en-US-AriaNeural`) | Submission demo video: Claude drafted the narration, wrote the screenshot script and the shared Remotion video template; voice is AI text-to-speech; pictures are screenshots of our site | `videos/demo.*`, `video/` (watermark on every frame, MP4 `comment` metadata) | **TODO: team rewrites narration in own words** |
| 2026-11-14 | Claude (Anthropic) | Upgrades: shareable link per machine (`#id`), "How big is it?" to-scale drawing next to an adult (sizes from NASA/JPL press kits, NASA fact sheets and NASM; rounded), timeline play button, "Watch the video" button on story cards, themed scrollbars; the empty Story section is hidden until the team writes it | `js/app.js`, `css/style.css`, `index.html`, `data/artifacts.js` (`size`) | **TODO: team checks the size figures** |
| 2026-11-14 | Claude (Anthropic) | Built explorer progress, a one-question quiz per machine (generated from the landing years in the data) and the Mission Archivist badge | `index.html`, `js/app.js`, `css/style.css` | Team reviews in browser |
| 2026-11-14 | Claude (Anthropic) | Built the 1967 → 2021 timeline scrubber (explore mode shows only machines that had landed by the chosen year); cross-checked artifact facts against NASA/NSSDCA/JPL/HiRISE pages and fixed two (Pathfinder orbit-photo date, Ingenuity final airfield) | `index.html`, `js/app.js`, `css/style.css`, `data/artifacts.js` | Team does a final fact read |
| 2026-11-14 | Claude (Anthropic) | Found NASA orbiter photos (LRO, HiRISE) of each landing site, wrote their captions and built the landing-vs-orbit slider | `assets/orbit/`, `data/artifacts.js` (`orbit`), `js/app.js`, `css/style.css` | Captions cross-checked against HiRISE/LROC pages by Claude. **TODO: team does a final read** |
| 2026-11-14 | Claude (Anthropic) | Found NASA's own 3D models (NASA 3D Resources) and wrote the code that stands them on the surface in close-ups | `assets/models/`, `js/app.js` | Team reviews in browser |
| 2026-11-14 | Claude (Anthropic) | Searched for and selected public-domain / CC BY textures and icons | `assets/` (credits in README and the site's "Image credits") | Team approved |

## Not SI-generated
- The project idea and narrative concept (team)
- Story text for each artifact (team, still to be written)

## Planned
- Narration audio: AI text-to-speech voice. Must be disclosed next to the player, on the credits page, and in each audio file's metadata.
