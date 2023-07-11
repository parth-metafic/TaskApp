import react, {PureComponent, ReactPropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type SearchScreenNavigationProp = NativeStackNavigationProp<{
  ['Home']: any;
  ['Details']: any;
}>;

interface State {
  page: number;
  data: Array<any>;
  search: string;
}

interface Props extends ReactPropTypes {
  navigation: SearchScreenNavigationProp;
}

class Home extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      data: [],
      search: '',
    };
  }

  private interval: any = 0;

  componentDidMount(): void {
    this.initialData();
    this.interval = setInterval(this.getData, 10000);
  }
  initialData = async () => {
    await this.getData();
    this.setState({data: [...this.state.data]});
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData = async () => {
    try {
      const response = await axios(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${this.state.page}`,
      );
      if (response.status === 200) {
        this.setState({
          data: [...this.state.data, ...response?.data?.hits],
          page: this.state.page + 1,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  renderItem = ({item}: any) => {
    const {author, url, title, created_at, _tags} = item;
    return (
      <Pressable
        testID="ItemContainer"
        onPress={() => {
          this.props.navigation.navigate('Details', {data: item});
        }}
        style={styles.itemContainer}>
        <Text testID="Title" style={styles.titleText}>
          {title}
        </Text>
        <Text testID="Author" style={styles.authorText}>
          {author}
        </Text>
        {url && (
          <View testID="Url" style={styles.rowData}>
            <Text
              testID="ItemURL"
              onPress={() => {
                Linking.openURL(url);
              }}
              style={styles.urlText}>
              {url}
            </Text>
          </View>
        )}
        <Text testID="CreatedAt" style={styles.createdAtText}>
          {moment(created_at).format('MMMM Do YYYY, h:mm:ss a')}
        </Text>
        <View testID="TagList" style={styles.rowData}>
          <FlatList
            data={_tags}
            renderItem={({item}: {item: string}) => {
              return <Text style={styles.tagText}>{`${item}, `}</Text>;
            }}
            style={styles.tagListContainer}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Pressable>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.centerView}>
          <TextInput
            testID="Search"
            value={this.state.search}
            placeholder="Search by Title or Author"
            placeholderTextColor={'#777'}
            onChangeText={(text: string) => {
              this.setState({search: text});
            }}
            style={styles.searchInput}
          />
        </View>
        {this.state.data.length !== 0 && (
          <FlatList
            testID="FlatList"
            data={
              !this.state.search
                ? this.state.data
                : this.state.data.filter(
                    item =>
                      item.title
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase()) ||
                      item.author
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase()),
                  )
            }
            renderItem={this.renderItem}
            style={styles.flatlist}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCC',
  },
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    width: '95%',
    paddingLeft: 10,
    marginTop: 10,
    color: 'black',
    fontSize: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 7,
    overflow: 'hidden',
  },
  itemContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: 'Black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  rowData: {
    flexDirection: 'row',
  },
  tagListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  authorText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  createdAtText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    marginBottom: 10,
  },
  tagText: {
    color: 'black',
    fontSize: 14,
    fontStyle: 'italic',
  },
  urlText: {
    width: '95%',
    color: '#0000EEAE',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  listContentContainer: {
    marginBottom: 10,
  },
  loading: {
    position: 'relative',
    top: 0,
  },
  searchContainer: {
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: 'white',
    width: '95%',
  },
  flatlist: {
    marginTop: 10,
  },
});

export default Home;
