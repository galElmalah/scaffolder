import React from 'react';
import {NavigationComponent} from 'react-native-navigation';
import {View, Text, asWixScreen} from '@wix/wix-react-native-ui-lib';
import {FlatList, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {Navigation} from 'react-native-navigation';

const UI_DEMO_ITEMS: DemoItem[] = [
  {
    testID: 'demo.DEMO_APP',
    label: 'Open Main Screen',
    onPress: () => {
      Navigation.showModal({
        stack: {
          id: undefined,
          children: [{
            component: {
              name: 'template.MainScreen',
              passProps: {
                sessionId: 'MOCK_SESSION_ID',
              },
            },
          }],
        },
      });
    },
  },
];

export type DemoItem = {
  testID: string;
  label: string;
  onPress: () => void;
};

export const DemoTab = asWixScreen(class extends NavigationComponent {
  static options(): any {
    return {
      topBar: {
        title: {
          text: 'Demo',
        },
      },
    };
  }

  renderGridItem = ({item}: {item: DemoItem}) => {
    const {label, testID, onPress} = item;
    return (
      <TouchableOpacity
        style={styles.gridItemView}
        testID={testID}
        onPress={() => onPress()}
      >
        <Text bodySmallBold>{label}</Text>
      </TouchableOpacity>
    );
  };

  keyExtractor = (item: DemoItem) => item.testID;

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text bodyBold center margin-10 style={styles.gridTitle}>UI</Text>
        <FlatList
          data={UI_DEMO_ITEMS}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderGridItem}
        />
      </View>
    );
  }
});
