import { spawnSync } from 'node:child_process';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const imageDir = path.join(root, 'public', 'assets', 'images');
const widths = [480, 768, 1440];
const sources = ['instafetch-live', 'recruitos-ai-live', 'frost-flowers-live'];
const manifest = [];

await mkdir(imageDir, { recursive: true });

for (const name of sources) {
  const input = path.join(imageDir, `${name}.jpg`);
  const inputStats = await stat(input);
  const variants = [];

  for (const width of widths) {
    const file = `${name}-${width}.webp`;
    const output = path.join(imageDir, file);
    const result = spawnSync('ffmpeg', [
      '-y', '-hide_banner', '-loglevel', 'error', '-i', input,
      '-vf', `scale=${width}:-2:flags=lanczos`,
      '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6', '-preset', 'picture', output
    ], { encoding: 'utf8' });

    if (result.error || result.status !== 0) {
      throw new Error(`Could not create ${file}. Install FFmpeg with libwebp support, then rerun media:optimize. ${result.error?.message ?? result.stderr}`);
    }

    const outputStats = await stat(output);
    variants.push({ file, width, height: Math.round(width * 900 / 1440), bytes: outputStats.size });
  }

  manifest.push({ source: `${name}.jpg`, sourceWidth: 1440, sourceHeight: 900, sourceBytes: inputStats.size, codec: 'WebP', quality: 84, variants });
}

const manifestPath = path.join(root, 'artifacts', 'qa', 'media-optimization-manifest.json');
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), encoder: 'FFmpeg libwebp', manifest }, null, 2));
console.log(JSON.stringify(manifest, null, 2));
