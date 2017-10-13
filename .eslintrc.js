module.exports = {
  root: true,
  extends: ['boldr', 'boldr/react', 'boldr/jsx-a11y', 'boldr/import', 'boldr/flowtype'],
  globals: {
    __DEV__: true,
    __PUB_PATH__: true,
    __SERVER__: true,
    __CLIENT__: true,
  },
};
