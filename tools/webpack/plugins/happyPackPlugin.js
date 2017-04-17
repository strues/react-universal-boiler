/* eslint-disable babel/new-cap */
import path from 'path';
import os from 'os';
import HappyPack from 'happypack';
import paths from '../../config/paths';

/**
 * Creates a new HappyPack loader instance
 * @see https://github.com/amireh/happypack
 * @param  {String} id      identifies the loader
 * @param  {Array} loaders  Webpack loaders used by this instance
 * @return {function}         a HappyPack plugin
 */
export default function happyPackPlugin(id, loaders) {
  // ThreadPools are worker threads shared amongst all HappyPack loaders
  const compilerThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length,
  });
  return new HappyPack({
    id,
    tempDir: paths.happyPackDir,
    verbose: false,
    threadPool: compilerThreadPool,
    loaders,
  });
};
