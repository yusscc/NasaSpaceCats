// SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
import { registerRoot, Composition } from 'remotion';
import { Apollo11, FPS, durationInFrames } from './Apollo11';

const Root = () => (
  <Composition id="Apollo11" component={Apollo11} durationInFrames={durationInFrames}
    fps={FPS} width={1280} height={720} />
);

registerRoot(Root);
