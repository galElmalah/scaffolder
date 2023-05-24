import React from 'react';
import {StyleSheet, View, Image, Button, Text} from 'react-native';
import {asWixScreen} from '@wix/wix-react-native-ui-lib';

export type State = {
  wixImage: boolean;
};

export const MainScreen = asWixScreen(class extends React.Component<{}, State> {
  state = {wixImage: true};

  getImageSource = () => this.state.wixImage ? require('../assets/wixapp.png') : require('../assets/react_logo.png');

  renderText = () => this.state.wixImage ? 'Wix' : 'React';

  handlePress = () => this.setState((prevState) => ({wixImage: !prevState.wixImage}));

  render() {
    return (
      <View style={styles.container} testID='mainScreen'>
        <Image style={styles.image} source={this.getImageSource()}/>
        <Text testID="title">{this.renderText()}</Text>
        <Button testID="button" title="Press me!" onPress={this.handlePress}/>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 300,
    marginBottom: 50,
    height: 155,
    width: 160,
    resizeMode: 'stretch',
  },
});
