import { resolve as pathResolve } from 'path';
import rimraf from 'rimraf';
import config from '../config/config';
import paths from '../config/paths';

function clean() {
  rimraf(pathResolve(paths.serverCompiledDir), () => {
    console.log(`Cleaned ${paths.serverCompiledDir}`);
  });
  rimraf(pathResolve(paths.assetsDir), () => {
    console.log(`Cleaned ${paths.assetsDir}`);
  });
}

clean();
