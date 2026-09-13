const React = require('react');
const { View } = require('react-native');

module.exports = new Proxy(
  { default: View },
  {
    get: (target, property) => target[property] || View,
  },
);
