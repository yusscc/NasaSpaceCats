# SI-generated code: written with Claude (Anthropic). Disclosed per NASA Space Apps 2026 SI rules.
# AI narration: Microsoft Edge neural text-to-speech (edge-tts) + per-word timings for captions.
# Usage: python tts.py ../videos/demo.txt public/demo   ->  public/demo-voice.mp3, public/demo-timings.json
import asyncio, json, sys
import edge_tts

VOICE = 'en-US-AriaNeural'
src, prefix = sys.argv[1], sys.argv[2]
lines = [l.strip() for l in open(src, encoding='utf-8') if l.strip()]

async def main():
    tts = edge_tts.Communicate(' '.join(lines), VOICE, rate='-5%', boundary='WordBoundary')
    words = []
    with open(f'{prefix}-voice.mp3', 'wb') as f:
        async for ch in tts.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary': words.append({'t': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'w': ch['text']})
    # group spoken words back into script lines; show the script's own spelling and punctuation
    out, i = [], 0
    for line in lines:
        toks, need, ws = line.split(), len(line.split()), []
        while need > 0:
            w = words[i]; n = len(w['w'].split()); i += 1
            ws.append({**w, 'w': ' '.join(toks[len(toks) - need:len(toks) - need + n])}); need -= n
        assert need == 0, line
        out.append({'text': line, 'start': ws[0]['t'], 'end': ws[-1]['t'] + ws[-1]['d'], 'words': ws})
    json.dump({'voice': VOICE, 'lines': out, 'end': out[-1]['end']}, open(f'{prefix}-timings.json', 'w'), indent=1)
    print(f'{prefix}: {out[-1]["end"]:.1f}s', [(round(o['start'], 1), round(o['end'], 1)) for o in out])

asyncio.run(main())
