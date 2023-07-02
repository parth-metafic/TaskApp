jest.mock('axios');

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    NavigationContainer: jest.fn(({children}) =>
      React.createElement(View, {}, children),
    ),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    createNativeStackNavigator: jest.fn(() => ({
      Navigator: ({children}) => React.createElement(View, {}, children),
      Screen: ({children}) => React.createElement(View, {}, children),
    })),
  };
});
