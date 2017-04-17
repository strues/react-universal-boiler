import fs from 'fs';
import path from 'path';
import logger from 'boldr-utils/es/logger';
import filesize from 'filesize';
import gzipSize from 'gzip-size';
import stripAnsi from 'strip-ansi';

module.exports = (stats, clientConfig) => {
  const assetPath = clientConfig.output.path;
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map((asset) => {
      const file = fs.readFileSync(path.resolve(assetPath, asset.name));
      const gzSize = gzipSize.sync(file);
      return {
        folder: path.join('public/assets', path.dirname(asset.name)),
        gzSize,
        gzSizeLabel: `(${filesize(gzSize)} gzip)`,
        name: path.basename(asset.name),
        size: asset.size,
        sizeLabel: filesize(asset.size),
      };
    });

  assets.sort((a, b) => b.size - a.size);

  const longestSizeLabelLength = Reflect.apply(Math.max, null,
    assets.map(a => stripAnsi(a.sizeLabel).length),
  );

  const longestGzSizeLabelLength = Reflect.apply(Math.max, null,
    assets.map(a => stripAnsi(a.gzSizeLabel).length),
  );

  const addLabelPadding = (label, longestLength) => {
    let padded = label;
    const length = stripAnsi(label).length; // eslint-disable-line
    if (length < longestLength) {
      const rightPadding = ' '.repeat(longestLength - length);
      padded += rightPadding;
    }
    return padded;
  };

  assets.forEach((asset) => {
    const sizeLabel = addLabelPadding(asset.sizeLabel, longestSizeLabelLength);
    const gzSizeLabel = addLabelPadding(asset.gzSizeLabel, longestGzSizeLabelLength); // eslint-disable-line
    logger.log(`    ${sizeLabel}    ${gzSizeLabel}    ${asset.folder + path.sep + asset.name}`); // eslint-disable-line
  });
};
