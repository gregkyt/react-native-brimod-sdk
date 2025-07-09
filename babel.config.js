module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@root': './',
          '@src': './src',
        },
      },
    ],
    'react-native-reanimated/plugin',
    'nativewind/babel',
  ],
};
