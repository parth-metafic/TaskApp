import react, {PureComponent, ReactPropTypes} from 'react';
import {View, ScrollView, Text, Dimensions, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

interface State {}
type RawJSONScreenNavigationProp = NativeStackNavigationProp<{
  ['Home']: any;
  ['Details']: any;
}>;
type RawJSONScreenRoutes = RouteProp<{
  ['Home']: any;
  ['Details']: any;
}>;

interface Props extends ReactPropTypes {
  navigation: RawJSONScreenNavigationProp;
  route: RawJSONScreenRoutes;
}

class Details extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#CCC'}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              padding: 20,
            }}>
            <Text style={{color: 'black', fontSize: 18}}>
              {JSON.stringify(this.props.route?.params?.data)}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Details;
