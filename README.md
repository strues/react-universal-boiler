# Boldr Universal React Starter  
[![Code Climate](https://codeclimate.com/github/strues/boldr-universal-react/badges/gpa.svg)](https://codeclimate.com/github/strues/boldr-universal-react)  [![Build Status](https://travis-ci.org/strues/boldr-universal-react.svg?branch=master)](https://travis-ci.org/strues/boldr-universal-react)

A **bold** way to begin your next great universal React application.

## Features
- A pleasant 😍 developer experience with 🔥 fast bundling, so you can get shit done. This starter takes advantage of tools like, [HappyPack](https://github.com/amireh/happypack) and the [DLL capabilities](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) within Webpack itself. Your rebuilds happen fast because, nobody enjoys waiting around like a  🐢  while assets recompile.
- [React-Hot-Loader](https://github.com/gaearon/react-hot-loader): Build your React components with less full page reloads thanks to hot module replacement and React Hot Loader.
- Code Splitting: Give your visitors the best experience possible by allowing their browsers to only download what's necessary.

## Demo

Check it out in action here: https://starter.boldr.io/

## Usage

### Development
Getting up and running for development is easy.

`git clone git@github.com:strues/boldr-universal-react.git`

`cd boldr-universal-react`

Install the dependencies `npm install`

Start the development process with `npm run dev`

### Production
Running the two commands below will compile your application and serve the production ready build.

**Build:** `npm run build`

**Run:** `npm run start:prod`

## Notes
#### Using DLLs
Taking advantage of Webpack's DLLs is pretty easy in this project. The command is `npm run build:dlls`. It creates a `vendor.json` tfile in the webpack directory and places the DLL bundle in `static/assets/dlls`. When you add new dependencies to your project, all you need to do is add the name to the on-going list within `webpack/dll.config.js`. As a side note, rather than using DLLs in production (which you shouldnt, by the way), you'll want to add the package into the list of vendor dependencies inside `webpack/webpack.config.client.js`.

If you don't feel like using DLLs, set WEBPACK_DLLS to 0 in the `package.json`

## Resources


## Alternatives
- [`ReactGo`]https://github.com/reactGo/reactGo)
Your One-Stop solution for a full-stack app with ES6/ES2015 React.js featuring universal Redux, React Router, React Router Redux Hot reloading, CSS modules, Express 4.x, and multiple ORMs.



## Contributing
Pull requests are welcome and encouraged. If I made a mistake, raise an issue and/or fix it and submit a PR. Have a question? I'll do what I can to answer it for you.

## Dependencies
