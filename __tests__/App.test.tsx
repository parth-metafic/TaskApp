import {render, fireEvent} from '@testing-library/react-native';
import axios from 'axios';
import {FlatList, View, Text} from 'react-native';
import moment from 'moment';

import Home from '../Screens/Home';

jest.mock('axios');

describe('Home component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get proper Data in FlatList', async () => {
    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    axios.mockResolvedValueOnce({data: {hits}, status: 200});

    const {getByTestId} = render(<Home />);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(getByTestId('FlatList').props.data).toEqual(hits);
  });

  it('Should execute renderItem properly in FlatList', async () => {
    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    const {getByTestId} = render(
      <FlatList
        data={hits}
        renderItem={({item}) => {
          const {author, url, title, created_at, _tags} = item;
          return (
            <>
              <Text testID="Title">{title}</Text>
              <Text testID="Author">{author}</Text>
              {url && (
                <View testID="Url">
                  <Text testID="ItemURL">{url}</Text>
                </View>
              )}
              <Text testID="CreatedAt">
                {moment(created_at).format('MMMM Do YYYY, h:mm:ss a')}
              </Text>
              <View testID="TagList">
                <FlatList
                  data={_tags}
                  renderItem={({item}: {item: string}) => {
                    return <Text>{`${item}, `}</Text>;
                  }}
                />
              </View>
            </>
          );
        }}
      />,
    );

    hits.forEach(item => {
      expect(getByTestId(`Title`)).toBeTruthy();
      expect(getByTestId(`Author`)).toBeTruthy();
      expect(getByTestId(`Url`)).toBeTruthy();
      expect(getByTestId(`CreatedAt`)).toBeTruthy();
      expect(getByTestId(`TagList`)).toBeTruthy();
    });
  });

  it('Should show all cards properly', async () => {
    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    axios.mockResolvedValueOnce({data: {hits}, status: 200});

    const {getByTestId} = render(<Home />);

    await new Promise(resolve => setTimeout(resolve, 100));

    for (const hit of hits) {
      expect(getByTestId(`Title`)).toBeDefined();
      expect(getByTestId(`Author`)).toBeDefined();
      expect(getByTestId(`Url`)).toBeDefined();
      expect(getByTestId(`CreatedAt`)).toBeDefined();
      expect(getByTestId(`TagList`)).toBeDefined();
    }
  });

  it('Should change text of Search TextInput', () => {
    const {getByPlaceholderText} = render(<Home />);
    const searchInput = getByPlaceholderText('Search by Title or Author');

    fireEvent.changeText(searchInput, 'example');

    expect(searchInput.props.value).toBe('example');
  });

  it('Should change data list of Search by Author', async () => {
    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    axios.mockResolvedValueOnce({data: {hits}, status: 200});

    const {getByTestId} = render(<Home />);

    const searchInput = getByTestId('Search');

    await new Promise(resolve => setTimeout(resolve, 100));

    fireEvent.changeText(searchInput, 'Peter');

    const flatList = getByTestId('FlatList');

    flatList.props.data.forEach(data => {
      expect(data.author).toContain('Peter');
    });
  });

  it('Should change data list of Search by Title', async () => {
    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    axios.mockResolvedValueOnce({data: {hits}, status: 200});

    const {getByTestId} = render(<Home />);

    const searchInput = getByTestId('Search');

    await new Promise(resolve => setTimeout(resolve, 100));

    fireEvent.changeText(searchInput, 'Jest');

    const flatList = getByTestId('FlatList');

    flatList.props.data.forEach(data => {
      expect(data.title).toContain('Jest');
    });
  });

  it('Should navigate to the Details Screen', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const hits = [
      {
        title: 'Title Text',
        author: 'Peter Parker',
        url: 'https://abc.com',
        created_at: '2023-01-01T07:00:00.000Z',
        _tags: ['tag1', 'tag2'],
      },
    ];

    axios.mockResolvedValueOnce({data: {hits}, status: 200});

    const {getAllByTestId} = render(<Home navigation={navigation} />);

    await new Promise(resolve => setTimeout(resolve, 100));

    const itemPressElements = getAllByTestId('ItemContainer');
    expect(itemPressElements.length).toBe(hits.length);

    for (let i = 0; i < hits.length; i++) {
      fireEvent.press(itemPressElements[i]);
      expect(navigation.navigate).toHaveBeenCalledWith('Details', {
        data: hits[i],
      });
    }
  });
});
