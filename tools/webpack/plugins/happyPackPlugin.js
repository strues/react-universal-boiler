/* eslint-disable babel/new-cap */
const os = require('os');
const path = require('path');
const HappyPack = require('happypack');

/**
 * Creates a new HappyPack loader instance
 * @see https://github.com/amireh/happypack
 * @param  {String} id      identifies the loader
 * @param  {Array} loaders  Webpack loaders used by this instance
 * @return {function}         a HappyPack plugin
 */
module.exports = function happyPackPlugin({ name, loaders }) {
  // ThreadPools are worker threads shared amongst all HappyPack loaders
  const compilerThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length,
  });
  return new HappyPack({
    id: name,
    verbose: false,
    threadPool: compilerThreadPool,
    loaders,
  });
};
