import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import dotenv from 'dotenv';
import md5 from 'md5';
import Promise from 'bluebird';

dotenv.config();
const ROOT = fs.realpathSync(process.cwd());
const SRC_DIR = path.resolve(ROOT, 'src');
const outputDir = process.env.CLIENT_OUTPUT;

function buildWebpackDlls() {
  console.log('Building Webpack vendor DLLs');
  const pkg = JSON.parse(fs.readFileSync(`${ROOT}/package.json`, 'utf8'));

  const dllConfig = require(path.resolve(SRC_DIR, 'vendor.js'));

  const devDLLDependencies = dllConfig.sort();

  // We calculate a hash of the package.json's dependencies, which we can use
  // to determine if dependencies have changed since the last time we built
  // the vendor dll.
  const currentDependenciesHash = md5(
    JSON.stringify(
      devDLLDependencies.map(dep => [dep, pkg.dependencies[dep], pkg.devDependencies[dep]]),
      // We do this to include any possible version numbers we may have for
      // a dependency. If these change then our hash should too, which will
      // result in a new dev dll build.
    ),
  );

  const vendorDLLHashFilePath = path.resolve(outputDir, '__vendor_dlls__hash');

  function webpackInstance() {
    return {
      target: 'web',
      // We only use this for development, so lets always include source maps.
      devtool: 'inline-source-map',
      entry: {
        // eslint-disable-next-line camelcase
        __vendor_dlls__: devDLLDependencies,
      },
      output: {
        path: path.resolve(outputDir),
        filename: '__vendor_dlls__.js',
        library: '__vendor_dlls__',
        publicPath: '/assets/',
      },
      resolve: {
        modules: ['node_modules', SRC_DIR, path.resolve(ROOT, 'node_modules')],
      },
      plugins: [
        new webpack.DllPlugin({
          path: path.resolve(outputDir, '__vendor_dlls__.json'),
          name: '__vendor_dlls__',
          context: ROOT,
        }),
      ],
    };
  }

  function buildVendorDLL() {
    return new Promise((resolve, reject) => {
      console.log('Vendor DLL build complete.');
      console.info(
        `The following dependencies have been
        included:\n\t-${devDLLDependencies.join('\n\t-')}\n`,
      );

      const webpackConfig = webpackInstance();
      const vendorDLLCompiler = webpack(webpackConfig);
      vendorDLLCompiler.run(err => {
        if (err) {
          reject(err);
          return;
        }
        // Update the dependency hash
        fs.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash);

        resolve();
      });
    });
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(vendorDLLHashFilePath)) {
      // builddll
      console.log('Generating a new Vendor DLL.');
      buildVendorDLL()
        .then(resolve)
        .catch(reject);
    } else {
      // first check if the md5 hashes match
      const dependenciesHash = fs.readFileSync(vendorDLLHashFilePath, 'utf8');
      const dependenciesChanged = dependenciesHash !== currentDependenciesHash;

      if (dependenciesChanged) {
        console.log('New vendor dependencies detected.');
        console.log('Regenerating the vendor dll...');
        buildVendorDLL()
          .then(resolve)
          .catch(reject);
      } else {
        console.log('Dependencies did not change. Using existing vendor dll.');
        resolve();
      }
    }
  });
}

export default buildWebpackDlls;
