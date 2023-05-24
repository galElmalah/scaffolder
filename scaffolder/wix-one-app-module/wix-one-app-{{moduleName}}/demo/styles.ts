import {Colors} from '@wix/wix-react-native-ui-lib';
import {StyleSheet} from 'react-native';

const ITEM_HEIGHT = 50;
const ITEM_MARGIN = 5;

export const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 5,
  },
  gridTitle: {
    color: Colors.primary,
  },
  gridItemView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: ITEM_HEIGHT,
    margin: ITEM_MARGIN,
    backgroundColor: Colors.primary,
  },
  gridItemText: {
    color: Colors.white,
    padding: 5,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
