const path = require('path');
const rimraf = require('rimraf');
const config = require('../config');

function clean() {
  rimraf(path.resolve(config.serverCompiledDir), () => {
    console.log(`Cleaned ${config.serverCompiledDir}`);
  });
  rimraf(path.resolve(config.assetsDir), () => {
    console.log(`Cleaned ${config.assetsDir}`);
  });
}

clean();
