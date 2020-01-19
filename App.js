import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Header, ThemeProvider, Button, Card, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogLevel, HubConnectionBuilder } from '@aspnet/signalr';
const imageUrl = 'https://storageaccounttry9fc6.blob.core.windows.net/outcontainer/8856730-fruit-and-vegetables-in-the-fridge.jpg'

const list = [
  {
    name: 'Apple',
    subtitle: 'Available'
  },
  {
    name: 'Orange',
    subtitle: '1 Available'
  },
  {
    name: 'Orange',
    subtitle: '1 Available'
  },
  {
    name: 'Orange',
    subtitle: '1 Available'
  },
  {
    name: 'Orange',
    subtitle: '1 Available'
  },
  {
    name: 'Orange',
    subtitle: '1 Available'
  },
]

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      response: '',
      imageUrl: imageUrl
    }
  }
  fetchTriggerApi = () => {
    return fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentDidMount() {
    let connection = new HubConnectionBuilder()
    .withUrl("https://testsig.azurewebsites.net/api")
    .configureLogging(LogLevel.Information)
    .build();
 
connection.on("newMessage", ({text}) => {
  const {response, imageUrl} = JSON.parse(text)
    this.setState({response, imageUrl})
});
 
connection.start()
    .then(() => connection.invoke("send", "Hello"));

    this.fetchTriggerApi();

  }
  render() {
  return (
      <ThemeProvider>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      <View style={{flex: 1}}>
        <View style={{marginTop:20,width: "40%", alignSelf: 'center'}}>
          <Button
            icon={
              <Icon
                name="camera"
                size={30}
                color="white"
              />
            }
            title=" Capture"
          />
        </View>
        <Card>
          <Image
          source={{uri: this.state.imageUrl}} style={{width: 350, height: 250}}/>
        </Card>
        <View style={{margin: 20}}>
          <Text style={{fontSize: 20}}>Available Items</Text>
        </View>
        <View height={200}>
        <ScrollView style={{ marginLeft: 10, marginRight: 10}}>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                subtitle={l.subtitle}
                rightIcon={{ icon: 'buy', color: 'orange' }}
                bottomDivider
                checkBox={{checked: false}}
              />
            ))
          }
          </ScrollView>
        </View>
          <View style={{margin: 10}}>
              
          <View style={{width: "40%", alignSelf: 'center'}}>
          <Button
          size={20}
          icon={
            <Icon
              name="opencart"
              size={30}
              color="white"
            />
          }
          title=" Buy"
        />
          </View>
          </View>
      </View>
      </ThemeProvider>
  );
        }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
