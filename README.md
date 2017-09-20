# React Universal Boiler
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/strues/react-universal-boiler.svg?branch=master)](https://travis-ci.org/strues/react-universal-boiler) [![codecov](https://codecov.io/gh/strues/react-universal-boiler/branch/master/graph/badge.svg)](https://codecov.io/gh/strues/react-universal-boiler)



## Features
- React 16
- A pleasant 😍 developer experience with 🔥 fast bundling, so you can get shit done. This starter takes advantage of tools like, [HappyPack](https://github.com/amireh/happypack) and the [DLL capabilities](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) within Webpack itself. Your rebuilds happen fast because, nobody enjoys waiting around like a  🐢  while assets recompile.
- [React-Router 4](https://github.com/ReactTraining/react-router): configured with async data loading.
- [React-Hot-Loader](https://github.com/gaearon/react-hot-loader): Build your React components with less full page reloads thanks to hot module replacement and React Hot Loader.
- Code Splitting: Give your visitors the best experience possible by allowing their browsers to only download what's necessary.
- [React-Universal-Component](https://github.com/faceyspacey/react-universal-component): The final answer to a React Universal Component: simultaneous SSR + Code Splitting 
- [Webpack Flush Chunks](https://github.com/faceyspacey/webpack-flush-chunks): flushes an array of rendered moduleIds or chunkNames.

### Demo

[https://boiler.strues.io](https://boiler.strues.io)   

## Usage

### Development
Getting up and running for development is easy.

`git clone git@github.com:strues/react-universal-boiler.git`

`cd react-universal-boiler`

Install the dependencies `npm install`.   
    
Copy the env file `cp .env.example .env`.  

Start development `npm run dev` and your universal React application is running on port 3000.   

### Production
Running the two commands below will compile your application and serve the production ready build.

**Build:** `npm run build`

**Run:** `npm run start`

### Notes
> Configuring the development DLLs and production vendor assets bundle requires adding your dependencies
for the browser to the `vendor.js` array located in `src/`.


## Resources
- [`React Redux Links`](https://github.com/markerikson/react-redux-links)


## Alternatives
- [`React, Universally`](https://github.com/ctrlplusb/react-universally)
A starter kit giving you the minimum requirements for a modern universal React application. I contribute to React Universally frequently.

- [`ReactGo`](https://github.com/reactGo/reactGo)
Your One-Stop solution for a full-stack app with ES6/ES2015 React.js featuring universal Redux, React Router, React Router Redux Hot reloading, CSS modules, Express 4.x, and multiple ORMs.

- [`React Cool Starter`](https://github.com/wellyshen/react-cool-starter)
A simple but feature rich starter boilerplate for you to build an universal web app with the best development experience and a focus on performance and best practices.

## Contributing
Pull requests are welcome and encouraged. If I made a mistake, raise an issue and/or fix it and submit a PR. Have a question? I'll do what I can to answer it for you.

## Dependencies
