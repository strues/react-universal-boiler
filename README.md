# React Universal Boiler
[![Code Climate](https://codeclimate.com/github/strues/react-universal-boiler/badges/gpa.svg)](https://codeclimate.com/github/strues/react-universal-boiler)  [![Build Status](https://travis-ci.org/strues/react-universal-boiler.svg?branch=master)](https://travis-ci.org/strues/react-universal-boiler) [![Coverage Status](https://coveralls.io/repos/github/strues/react-universal-boiler/badge.svg?branch=master)](https://coveralls.io/github/strues/react-universal-boiler?branch=master)

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

`git clone git@github.com:strues/react-universal-boiler.git`

`cd react-universal-boiler`

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

#### Where are the Babel transforms?
Inspired by Create React App, a custom Babel preset was created containing some common Babel plugins and presets. **Why?** Typically I find myself using the exact same Babel plugins, and rather than installing 5+ different packages, a single command takes care of it.

**babel-preset-boldr contains:**
- `babel-plugin-transform-class-properties`
- `babel-plugin-transform-decorators-legacy`
- `babel-plugin-transform-function-bind`
- `babel-plugin-transform-object-rest-spread`
- `babel-plugin-transform-react-constant-elements`
- `babel-plugin-transform-react-jsx-self`
- `babel-plugin-transform-react-jsx-source`
- `babel-plugin-transform-regenerator`
- `babel-plugin-transform-runtime`
- `babel-preset-latest`
- `babel-preset-react`
- `babel-runtime`

## Resources
- [`React Redux Links`](https://github.com/markerikson/react-redux-links)


## Alternatives
- [`ReactGo`](https://github.com/reactGo/reactGo)
Your One-Stop solution for a full-stack app with ES6/ES2015 React.js featuring universal Redux, React Router, React Router Redux Hot reloading, CSS modules, Express 4.x, and multiple ORMs.

- [`React Redux Universal Hot - Fork`](https://github.com/bertho-zero/react-redux-universal-hot-example)
This is a fork of the very popular, but no longer maintained project from Erikas.

- [`React Cool Starter`](https://github.com/wellyshen/react-cool-starter)
A simple but feature rich starter boilerplate for you to build an universal web app with the best development experience and a focus on performance and best practices.

## Contributing
Pull requests are welcome and encouraged. If I made a mistake, raise an issue and/or fix it and submit a PR. Have a question? I'll do what I can to answer it for you.

## Dependencies
