// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
import { registerRoot, Composition } from 'remotion';
import { FPS } from './Story';
import { Apollo11, apollo11Duration } from './Apollo11';
import { Demo, demoDuration } from './Demo';
import { Surveyor3, surveyor3Duration } from './Surveyor3';
import { Apollo15, apollo15Duration } from './Apollo15';

const Root = () => (
  <>
    <Composition id="Apollo11" component={Apollo11} durationInFrames={apollo11Duration} fps={FPS} width={1280} height={720} />
    <Composition id="Surveyor3" component={Surveyor3} durationInFrames={surveyor3Duration} fps={FPS} width={1280} height={720} />
    <Composition id="Apollo15" component={Apollo15} durationInFrames={apollo15Duration} fps={FPS} width={1280} height={720} />
    <Composition id="Demo" component={Demo} durationInFrames={demoDuration} fps={FPS} width={1280} height={720} />
  </>
);

registerRoot(Root);
