const sharp = require('sharp');

// Extract black ink coverage from a pale paper background, retaining soft edges.
async function main() {
  const [source, destination] = process.argv.slice(2);
  if (!source || !destination) throw new Error('Provide source and destination PNG paths.');
  const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const light = (data[i * info.channels] + data[i * info.channels + 1] + data[i * info.channels + 2]) / 3;
    rgba[i * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, (245 - light) / 225)));
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(destination);
  const stats = await sharp(destination).stats();
  console.log(JSON.stringify({ width: info.width, height: info.height, alpha: stats.channels[3] }));
}
main().catch(error => { console.error(error); process.exit(1); });
