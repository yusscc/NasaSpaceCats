# Abandoned but not Forgotten — Project Plan

NASA Space Apps Challenge 2026 · Event: Nov 14–15, 2026
**Hard deadline: Sunday Nov 15, 11:59 p.m. (your Local Event's time zone).** Click "Submit for Judging" before then.

Challenge page: https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/

---

## 1. What the challenge actually asks

**Task:** Tell the story of NASA hardware left on the Moon, Mars and in deep space, for **school-age kids and casual space fans**.

What the judges will look for, taken from the challenge text:

| They say | What it means for us |
|---|---|
| "translate complex historical and scientific data into an engaging narrative" | Story first. Fact sheets alone won't do. |
| "showing your audience how these missions operated rather than listing facts" | Show, don't tell: interactions, a viewpoint, small scenes. |
| "clear, exciting connection between the engineering of the hardware and the scientific knowledge" | Every artifact needs a link from **what it was built to do** to **what we learned because of it**. |
| "personal connection to these forgotten robotic explorers" | The emotional hook. |
| "**Accuracy is important throughout!**" | Every fact needs a source link. AI-written facts must be checked by a person. |
| Optional questions: age group, accessibility, specific vs. broad, perspective | Answer all four in the project description. That's easy points. |

Their own examples: a Moon map with clickable "ghost rovers", a graphic novel told by a dormant Mars lander, a podcast. **A website is a good fit.**

### Official NASA data (from the challenge's Resources tab)
Main source: **NSSDCA** (https://nssdc.gsfc.nasa.gov/), NASA's catalog of every spacecraft, with its final location and status.

| Where | Artifacts NASA lists |
|---|---|
| Moon | Apollo LM descent stages, Lunar Roving Vehicles (3), ALSEP packages (seismometers, retroreflectors), Surveyor landers |
| Mars | Sojourner, Spirit & Opportunity, Viking 1 & 2, Phoenix, InSight, Ingenuity |
| Elsewhere | Dawn (orbiting Ceres), NEAR Shoemaker (on asteroid Eros), Pioneer 10 & 11 (leaving the solar system), Kepler (drifting behind Earth) |

You need at least one NASA data source to be eligible for a Global Award. NSSDCA plus science.nasa.gov mission pages covers that.

### Judging (each scored 1–5)
1. **Impact**: inspires a broad audience (kids, teachers).
2. **Creativity**: a fresh angle, not another fact list.
3. **Validity**: accurate, works, easy to use, accessible.
4. **Relevance**: NASA data is the core of the project, not decoration. Real coordinates, dates and status taken from NSSDCA.
5. **Presentation**: the demo plus how clear the project page is.

---

## 2. AI ("Super Intelligence" / SI) rules: what we must follow

The 2026 rules call AI "Super Intelligence (SI)", after a U.S. Executive Order. Sources: Participant FAQ and the Project Submission Guide.

**Allowed:** using SI tools (LLMs, chatbots, code generation, image/video generation) to "accelerate innovation, streamline development, and enhance creativity."

**Rules:**
1. **SI must not come up with your idea for solving the challenge.** The core concept and creative angle must be **your team's**. I can build, research, check facts and suggest how to implement things. The story concept is your call (see §3, decisions D1–D3).
2. **Generated content may not use, contain or modify NASA branding**: no NASA logos (meatball/worm), flags, mission patches or "mission identifiers" in anything AI-generated. Real NASA photos are fine as references, but don't put NASA logos in our UI.
3. **Label everything AI produced:**
   - **Images/videos:** a *visible watermark* (e.g. "SI-generated" in a corner).
   - **Audio:** say so in descriptive text **and** in the file metadata.
   - **Code and data:** say so in descriptive text **and** metadata. We'll add a header comment in each file plus an "SI usage" section in the README.
4. **The submission form has a required "Use of Super Intelligence (SI)" field.** Judges don't see it, but they *do* see the watermarks and labels inside the project and judge "originality, intent, and execution" from them.
5. **References field:** list *every* external resource (code libraries, images, text), even open-source ones. No copyrighted music or images without permission. NASA imagery is generally public domain. Credit it anyway.

**Practical takeaway:** keep a running `SI_LOG.md` from minute one. Pasting it into the form at the end then takes 2 minutes.

---

## 3. Decisions you make (the idea must be yours)

- **D1, Narrative angle:** whose voice tells the story? Some options: each machine speaks in first person; a narrator/explorer character; a "museum of the solar system" guide; something else of yours.
- **D2, Age group:** e.g. 8–12 or 12–16. This sets reading level and tone.
- **D3, Scope:** all ~15 artifacts lightly, or ~6–8 in depth? (Recommended: 8 in depth. Accuracy beats coverage.)
- **D4, Name of the project.**

### Decided (Nov 14)
- **D1:** _pending, the team decides_
- **D2:** all ages, written mainly for 8–18 (aim for a reading level of about 10–12 years old so the youngest readers can follow).
- **D3:** 8 artifacts, spread across 3 worlds and 6 decades:

| # | Artifact | World | Era | Why it's in |
|---|---|---|---|---|
| 1 | Surveyor 3 lander | Moon | 1967 | Robot proves soft landing is possible; Apollo 12 astronauts later walked over and brought parts back home |
| 2 | Apollo 11 *Eagle* descent stage + laser retroreflector | Moon | 1969 | First human landing; the retroreflector is **still used for science today** |
| 3 | Apollo 15 Lunar Roving Vehicle | Moon | 1971 | First car driven on another world; parked there for good |
| 4 | Viking 1 lander | Mars | 1976 | First US landing on Mars; searched for life |
| 5 | Sojourner rover | Mars | 1997 | First rover on Mars, tiny (about the size of a microwave oven) |
| 6 | Opportunity rover | Mars | 2004–2018 | Planned to last 90 days, lasted almost 15 years; found evidence of past water |
| 7 | Ingenuity helicopter | Mars | 2021–2024 | First powered flight on another planet |
| 8 | Pioneer 10 | Deep space | 1972→ | First probe to Jupiter, now leaving the solar system, carries a plaque for whoever finds it |

Left out for now (could be stretch goals): InSight, Phoenix, Spirit, Viking 2, Dawn, NEAR Shoemaker, Kepler, Pioneer 11.
- **D4:** blank for now.

Everything below is the build structure that holds whatever story you choose.

---

## 4. What we build (smallest version that scores on all 5 criteria)

**Static website**: plain HTML/CSS/JS, no framework, no backend. Fast to build, works on any device, free hosting on GitHub Pages or Vercel.

Core features (MVP, must ship):
1. **Landing / intro.** One screen that sets up the story (from D1).
2. **Three worlds: Moon · Mars · Deep Space.** A real NASA map image (Moon: LRO mosaic, Mars: MOLA/Viking mosaic, public domain) with **clickable markers at the real landing coordinates** from NSSDCA. Deep Space: a simple solar-system diagram.
3. **Story card per artifact**: the narrative text (in your voice), plus a fact box (launch date, landing date, location, last contact, current status) and *"What it was built to do → What we learned"*, a photo, and source links.
4. **Timeline strip**: when each machine fell silent (1960s → 2020s). Shows how long these explorers have been out there.
5. **Accessibility**: keyboard navigation, alt text, readable font size, good contrast, and a **"Read aloud" button** using the browser's built-in speech (no extra library).
6. **Sources/credits page**: every fact source plus the SI disclosure.

Stretch (only if MVP is done by Sunday noon):
- Small "check your knowledge" quiz at the end (good for teachers = Impact).
- Mobile polish and small animations.

Skipped on purpose: 3D globes, game engines, accounts, backend, i18n. Each costs hours and adds little to the score.

### Data model
One file, `data/artifacts.json`. Each entry: `id, name, world, mission, launched, landed, lat, lon, lastContact, status, builtTo, learned, story, image, imageCredit, sources[]`.
Every fact must trace to a `sources` URL.

---

## 5. Timeline (≈36 hours)

| When | What | Who |
|---|---|---|
| **Sat Nov 14, now → +2h** | Decide D1–D4. Register team, all members in the same Local Event. Start `SI_LOG.md`. | Team |
| +2h → +6h | Research and write `artifacts.json` from NSSDCA and mission pages. Pick images. | Team (Claude assists with lookup and fact-checking) |
| +4h → +10h | Site skeleton: layout, 3 worlds, map markers, story card, timeline. | Claude builds, you review |
| Sat evening | Write the stories in your voice (D1). Plug them in. | **Team writes** |
| **Sun Nov 15 morning** | Accessibility pass, read-aloud, sources page, mobile check. Deploy. | Claude + team |
| Sun noon | **Feature freeze.** Fact-check every artifact against its source. | Team |
| Sun afternoon | Demo: **30-sec video (English subtitles if spoken in another language)** or **≤7 slides**. Exceeding either limit = disqualified from Global Judging. | Team |
| Sun evening | Fill the submission form (see §6). **Submit hours before 23:59.** | Team |

---

## 6. Submission checklist

- [ ] All teammates registered, same Local Event, not waitlisted, on the team's Members tab (max 6).
- [ ] Project name
- [ ] High-level summary: what, how it answers the challenge, why it matters
- [ ] Demo link (public, no login): video ≤ 30 s **or** ≤ 7 slides incl. title
- [ ] Final project link (public): deployed site + GitHub repo
- [ ] Detailed description: what it does, how it works, tools/languages; answer the 4 "considerations" (age, accessibility, focus, perspective)
- [ ] **Use of SI** field, from `SI_LOG.md`
- [ ] NASA data used: NSSDCA plus each mission page
- [ ] References: every library, image and text source
- [ ] Everything in English
- [ ] Both checkboxes (terms; original work + references listed)
- [ ] Click **Submit for Judging** before Sun Nov 15, 23:59 local

---

## 7. Risks

- **Wrong facts.** Accuracy is explicitly judged, and AI can invent things. Mitigation: every fact has a source, and a person checks each one.
- **Disqualification on demo length.** 30 s / 7 slides are hard limits.
- **NASA logo in AI images.** Don't generate images with logos. Watermark every AI image.
- **Running out of time.** Feature freeze at Sunday noon, no exceptions.
