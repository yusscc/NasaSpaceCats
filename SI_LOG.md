# Super Intelligence (SI) Usage Log

Required by NASA Space Apps 2026: every project must describe how SI tools were used. AI images and videos need a visible watermark. AI audio, code and data need disclosure in text and metadata. This log is the source for the submission form's "Use of SI" field.

| Date | Tool | What it did | Where | Human review |
|---|---|---|---|---|
| 2026-11-14 | Claude (Anthropic) | Analysed the challenge statement, rules and judging criteria; drafted the build plan | `docs/PLAN.md` | Team chose the idea, audience and scope |
| 2026-11-14 | Claude (Anthropic) | Wrote the website code (3D scene, flights, UI) | `index.html`, `css/`, `js/` (header comment in each file, `generator` meta tag) | Team reviewed in browser |
| 2026-11-14 | Claude (Anthropic) | Compiled artifact facts from NASA/NSSDCA pages, with a source link per artifact | `data/artifacts.js` | **TODO: team fact-checks every entry** |
| 2026-11-14 | Claude (Anthropic) | Built the cinematic scroll-story mode (team chose this style from 4 examples) and drafted factual connective chapter text | `js/app.js`, `data/artifacts.js` (`storyChapters`) | **TODO: team rewrites chapter text in own voice** |
| 2026-11-14 | Claude (Anthropic) + Windows text-to-speech (Microsoft Zira) | Example artifact video: Claude drafted the factual narration and wrote the render script; the voice is AI text-to-speech; footage is real NASA photos (public domain) | `videos/apollo-11-eagle.*`, `tools/make_video.py` (watermark on every frame, note under the player, MP4 `comment` metadata) | **TODO: team rewrites narration in own words; swap in the team's chosen AI voice** |
| 2026-11-14 | Claude (Anthropic) | Searched for and selected public-domain / CC BY textures and icons | `assets/` (credits in README and the site's "Image credits") | Team approved |

## Not SI-generated
- The project idea and narrative concept (team)
- Story text for each artifact (team, still to be written)

## Planned
- Narration audio: AI text-to-speech voice. Must be disclosed next to the player, on the credits page, and in each audio file's metadata.
