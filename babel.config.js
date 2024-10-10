module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['proposal-dynamic-import']
      }
    ]
  ]
};
