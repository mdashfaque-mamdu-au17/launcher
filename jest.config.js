module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^react-native-linear-gradient$': '<rootDir>/__mocks__/react-native-linear-gradient.js',
    '^lucide-react-native$': '<rootDir>/__mocks__/native-view.js',
    '^@react-native-community/blur$': '<rootDir>/__mocks__/native-view.js',
  },
};
