// SI-assisted data: compiled with Claude (Anthropic) from the NASA/NSSDCA sources listed in each entry.
// Every fact must be checked by a person against its sources before submission.
// Coordinates: degrees, lat N+ / S-, lon E+ / W-. `story` and `video` are filled in by the team.

// Solar system layout. Sizes and distances are NOT to scale (real distances would make planets invisible dots).
// Planet radii keep the real Moon : Earth : Mars ratio (1 : 3.67 : 1.95). `dist`/`angle` place planets around the Sun.
export const planets = [
  { id: 'mercury', name: 'Mercury', radius: 0.9,  dist: 24,  angle: 200, texture: 'assets/textures/mercury.jpg' },
  { id: 'venus',   name: 'Venus',   radius: 2.2,  dist: 34,  angle: 140, texture: 'assets/textures/venus.jpg' },
  { id: 'earth',   name: 'Earth',   radius: 3.67, dist: 48,  angle: 0,   texture: 'assets/textures/earth.jpg' },
  { id: 'mars',    name: 'Mars',    radius: 1.95, dist: 66,  angle: 28,  texture: 'assets/textures/mars.jpg' },
  { id: 'jupiter', name: 'Jupiter', radius: 8,    dist: 105, angle: 230, texture: 'assets/textures/jupiter.jpg' },
  { id: 'saturn',  name: 'Saturn',  radius: 7,    dist: 140, angle: 300, texture: 'assets/textures/saturn.jpg', ring: 'assets/textures/saturn_ring.png' },
  { id: 'uranus',  name: 'Uranus',  radius: 4,    dist: 170, angle: 100, texture: 'assets/textures/uranus.jpg' },
  { id: 'neptune', name: 'Neptune', radius: 4,    dist: 195, angle: 170, texture: 'assets/textures/neptune.jpg' },
];

// Worlds you can visit. The Moon orbits Earth; it sits on Earth's far side from the Sun (full Moon),
// so its near side faces both Earth and the Sun and is brightly lit.
export const worlds = {
  moon: { name: 'The Moon', icon: 'assets/icons/moon.jpg', radius: 1, parent: 'earth', offset: 9, texture: 'assets/textures/moon.jpg' },
  mars: { name: 'Mars', icon: 'assets/icons/mars.jpg', planet: 'mars' },
};

// Scroll story: one chapter per screen. `shot` picks the camera view:
// 'overview' | 'earth' | 'world:<moon|mars>' | 'artifact:<id>' | 'transit'.
// Connective text is a factual draft. The team can rewrite it in their own voice.
export const storyChapters = [
  { shot: 'overview', kind: 'intro', title: 'Abandoned but not Forgotten', text: 'Scroll to travel to the machines NASA left behind on the Moon and Mars.' },
  { shot: 'earth', title: 'It started here', text: 'Since the 1960s, NASA has sent robots and astronauts across the solar system. When their missions ended, much of their hardware stayed behind.' },
  { shot: 'world:moon', title: 'The Moon', text: 'About 384,000 km from Earth. Our first stop: three machines are waiting here.' },
  { shot: 'artifact:surveyor-3' },
  { shot: 'artifact:apollo-11-eagle' },
  { shot: 'artifact:apollo-15-lrv' },
  { shot: 'transit', title: 'Next stop: Mars', text: 'On average, Mars is about 225 million km from Earth, almost 600 times farther than the Moon.' },
  { shot: 'world:mars', title: 'Mars', text: 'Four machines, from 1976 to 2024. Each one taught us something new about the Red Planet.' },
  { shot: 'artifact:viking-1' },
  { shot: 'artifact:sojourner' },
  { shot: 'artifact:opportunity' },
  { shot: 'artifact:ingenuity' },
  { shot: 'overview', kind: 'outro', title: 'Silent, but not forgotten', text: 'These machines have gone quiet, but what they discovered still guides how we explore today.' },
];

export const credits = [
  'Mars map: NASA Viking MDIM 2.1 colorized mosaic, USGS (public domain)',
  'Moon map: NASA imagery via three.js examples',
  'Sun, planets, Saturn rings, star background: Solar System Scope (CC BY 4.0), via Wikimedia Commons',
  'Artifact photos: NASA / NASA-JPL (public domain), via Wikimedia Commons',
  'Button icons: NASA LRO Moon nearside and NASA Viking Mars mosaic (public domain), via Wikimedia Commons',
];

export const artifacts = [
  {
    id: 'surveyor-3', world: 'moon', name: 'Surveyor 3', type: 'Robotic lander',
    lat: -3.0161, lon: -23.4179, place: 'Oceanus Procellarum (Ocean of Storms)',
    launched: '17 Apr 1967', landed: '20 Apr 1967', lastContact: '4 May 1967', mass: '≈ 300 kg at landing',
    status: 'Silent. Some parts were taken home by Apollo 12.', statusKind: 'silent',
    builtTo: 'Prove that a spacecraft could land softly on the Moon, and dig into the soil with a robotic scoop to test whether the ground could hold up a crewed Apollo lander.',
    learned: 'The lunar soil was firm enough to land on. Surveyor 3 was the first spacecraft to dig a trench on the Moon, and its camera sent back thousands of pictures.',
    didYouKnow: 'In November 1969 the Apollo 12 crew landed close by, walked over to Surveyor 3, and cut off its camera and other parts to bring back to Earth. It is the only time humans have visited a robot on another world.',
    photo: 'assets/photos/surveyor-3.jpg', photoCaption: "Apollo 12's Pete Conrad visits Surveyor 3, November 1969. Photo: NASA",
    story: '', video: '',
    sources: [
      { label: 'NSSDCA: Surveyor 3', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A' },
      { label: 'NASA Science: Surveyor 3', url: 'https://science.nasa.gov/mission/surveyor-3/' },
    ],
  },
  {
    id: 'apollo-11-eagle', world: 'moon', name: 'Apollo 11 – Eagle descent stage', type: 'Crewed lander + experiments',
    lat: 0.6742, lon: 23.4731, place: 'Mare Tranquillitatis (Sea of Tranquility)',
    launched: '16 Jul 1969', landed: '20 Jul 1969', lastContact: 'Descent stage: none after liftoff. Laser mirror: still in use', mass: '≈ 2,000 kg descent stage (dry)',
    status: 'Descent stage silent. The laser mirror left beside it still works today.', statusKind: 'active',
    builtTo: 'Land Neil Armstrong and Buzz Aldrin on the Moon, then serve as the launch pad for the upper stage that carried them back to orbit.',
    learned: 'The crew brought back about 21.5 kg of Moon rock and soil. The laser retroreflector they set up lets observatories on Earth measure the distance to the Moon to within centimetres, which showed that the Moon is slowly drifting away from Earth (about 3.8 cm per year).',
    didYouKnow: 'A metal plaque on one of Eagle\'s legs is still there. It says the explorers "came in peace for all mankind."',
    photo: 'assets/photos/apollo-11-eagle.jpg', photoCaption: 'Eagle on the Moon while Buzz Aldrin unpacks experiments, July 1969. Photo: NASA',
    story: '', video: '',
    sources: [
      { label: 'NSSDCA: Apollo 11 Lunar Module', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C' },
      { label: 'NASA: Apollo 11', url: 'https://www.nasa.gov/mission/apollo-11/' },
    ],
  },
  {
    id: 'apollo-15-lrv', world: 'moon', name: 'Apollo 15 – Lunar Roving Vehicle', type: 'Crewed electric rover',
    lat: 26.1322, lon: 3.6339, place: 'Hadley–Apennine region',
    launched: '26 Jul 1971', landed: '30 Jul 1971', lastContact: 'Parked on 2 Aug 1971', mass: '≈ 210 kg (Earth weight)',
    status: 'Parked for good near the landing site.', statusKind: 'silent',
    builtTo: 'Let astronauts David Scott and James Irwin drive kilometres away from their lander and carry more tools and samples. It ran on batteries.',
    learned: 'The rover took the crew to the edge of Hadley Rille and the Apennine mountains, about 28 km of driving in total. There they found the "Genesis Rock", a piece of the Moon\'s ancient crust about 4 billion years old.',
    didYouKnow: 'The crew parked the rover with its TV camera pointing at the lander, so people on Earth could watch the astronauts lift off from the Moon.',
    photo: 'assets/photos/apollo-15-lrv.jpg', photoCaption: 'James Irwin with the lunar module and the rover, 1971. Photo: NASA',
    story: '', video: '',
    sources: [
      { label: 'NSSDCA: Apollo 15 Lunar Module / LRV', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C' },
      { label: 'NASA: Apollo 15', url: 'https://www.nasa.gov/mission/apollo-15/' },
    ],
  },
  {
    id: 'viking-1', world: 'mars', name: 'Viking 1 Lander', type: 'Robotic lander',
    lat: 22.27, lon: -47.95, place: 'Chryse Planitia',
    launched: '20 Aug 1975', landed: '20 Jul 1976', lastContact: 'Nov 1982', mass: '≈ 600 kg at landing',
    status: 'Silent since 1982.', statusKind: 'silent',
    builtTo: 'Become the first US spacecraft to work on the surface of Mars: take pictures, measure the weather, and run three biology experiments that searched the soil for signs of life.',
    learned: 'Viking 1 sent back the first colour pictures from the surface of Mars and recorded Martian weather for more than six years. Its life experiments gave puzzling results. Most scientists concluded the soil chemistry, not life, explained them.',
    didYouKnow: 'Viking 1 kept working for over six years, far beyond its planned 90 days.',
    photo: 'assets/photos/viking-1.jpg', photoCaption: 'A Viking lander test model on Earth. Photo: NASA',
    story: '', video: '',
    sources: [
      { label: 'NSSDCA: Viking 1 Lander', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-075C' },
      { label: 'NASA Science: Viking 1', url: 'https://science.nasa.gov/mission/viking-1/' },
    ],
  },
  {
    id: 'sojourner', world: 'mars', name: 'Sojourner Rover', type: 'Robotic rover',
    lat: 19.13, lon: -33.22, place: 'Ares Vallis',
    launched: '4 Dec 1996', landed: '4 Jul 1997', lastContact: '27 Sep 1997', mass: '10.6 kg',
    status: 'Silent, parked near the Pathfinder lander.', statusKind: 'silent',
    builtTo: 'Test whether a small wheeled robot could drive on Mars, and measure what nearby rocks were made of.',
    learned: 'Sojourner studied the chemistry of Martian rocks and helped show that this area had been shaped by ancient floods. It proved rovers could work on Mars, paving the way for every rover since.',
    didYouKnow: 'Sojourner is about the size of a microwave oven. It was planned to work for 7 days and kept going for about 12 weeks.',
    photo: 'assets/photos/sojourner.jpg', photoCaption: 'Sojourner next to a rock, seen from the Pathfinder lander, 1997. Photo: NASA/JPL',
    story: '', video: '',
    sources: [
      { label: 'NASA Science: Mars Pathfinder', url: 'https://science.nasa.gov/mission/mars-pathfinder/' },
      { label: 'NSSDCA: Mars Pathfinder', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A' },
    ],
  },
  {
    id: 'opportunity', world: 'mars', name: 'Opportunity Rover', type: 'Robotic rover',
    lat: -1.9462, lon: -5.5266, place: 'Meridiani Planum (landing site; it drove ≈ 45 km from here)',
    launched: '7 Jul 2003', landed: '25 Jan 2004', lastContact: '10 Jun 2018', mass: '≈ 185 kg',
    status: 'Silent since a planet-wide dust storm in 2018.', statusKind: 'silent',
    builtTo: 'Search rocks and soil for clues about whether liquid water was ever present on Mars.',
    learned: 'Opportunity found tiny round minerals nicknamed "blueberries" and rocks that could only have formed in water. That was strong evidence Meridiani Planum was once wet. It drove about 45 km, a record for a vehicle on another world at the time.',
    didYouKnow: 'Opportunity was planned to work for 90 Martian days. It lasted almost 15 years.',
    photo: 'assets/photos/opportunity.jpg', photoCaption: "Artist's illustration of a Mars Exploration Rover like Opportunity. Image: NASA/JPL",
    story: '', video: '',
    sources: [
      { label: 'NASA Science: Spirit & Opportunity', url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/' },
      { label: 'NSSDCA: Opportunity', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A' },
    ],
  },
  {
    id: 'ingenuity', world: 'mars', name: 'Ingenuity Helicopter', type: 'Robotic helicopter',
    lat: 18.4447, lon: 77.4508, place: 'Jezero Crater (near the Perseverance landing site)',
    launched: '30 Jul 2020', landed: '18 Feb 2021', lastContact: 'Mission ended 25 Jan 2024', mass: '1.8 kg',
    status: 'Grounded after rotor damage on its 72nd flight.', statusKind: 'silent',
    builtTo: 'Show that powered, controlled flight is possible in the very thin air of Mars, which is about 1% as thick as Earth\'s.',
    learned: 'Ingenuity made the first powered flight on another planet on 19 April 2021. It went on to fly 72 times and scout routes for the Perseverance rover, showing that future missions can use aircraft to explore Mars.',
    didYouKnow: 'Ingenuity was planned for just 5 test flights. It flew 72.',
    photo: 'assets/photos/ingenuity.jpg', photoCaption: 'Ingenuity on Mars, photographed by Perseverance, April 2021. Photo: NASA/JPL-Caltech',
    story: '', video: '',
    sources: [
      { label: 'NASA Science: Ingenuity Mars Helicopter', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/' },
      { label: 'NSSDCA: Mars 2020', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2020-052A' },
    ],
  },
];
