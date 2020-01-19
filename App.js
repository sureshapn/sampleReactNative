import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import { Header, ThemeProvider, Button, Card, ListItem } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogLevel, HubConnectionBuilder } from '@aspnet/signalr';
const imageUrl = 'https://storageaccounttry9fc6.blob.core.windows.net/outcontainer/8856730-fruit-and-vegetables-in-the-fridge.jpg'
import { Overlay } from 'react-native-elements';

const list = [
  'Apple', 'Orange', 'Apple', 'Orange'
]

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      response: list,
      imageUrl: imageUrl,
      triggerUrl: '',
      loading: false,
    }
  }
  fetchTriggerApi = async() => {
    try {
    const response = await fetch('https://www.subhu.xyz/env.json')
    const {endPoint} = await response.json()
      this.setState({triggerUrl: endPoint })
    } catch(error) {
      console.error(error);
    };
  }
  componentDidMount() {
    let connection = new HubConnectionBuilder()
    .withUrl("https://testsig.azurewebsites.net/api")
    .configureLogging(LogLevel.Information)
    .build();
 
connection.on("newMessage", ({text}) => {
  const {response, imageUrl} = JSON.parse(text)
  const responseData = JSON.parse(response);
    this.setState({response: responseData.description.tags, imageUrl, loading: false})
});
 
connection.start()
    .then(() => connection.invoke("send", "Hello"));

    this.fetchTriggerApi();

  }
  triggerCapture = async() => {
    this.setState({loading: true})
    console.log(this.state.triggerUrl)
    try {

    await fetch(this.state.triggerUrl)
    } catch(e) {
      this.setState({loading: false})
      console.log(e)
    }
    
  }

  alertMsg = () => {
    Alert.alert("Order placed..")
  }

  render() {
  return (
      <ThemeProvider>
        <Overlay isVisible={this.state.loading} width="auto"
  height="auto">
          <Text>Please wait!</Text>
          <Text>Connecting to  device...</Text>
        </Overlay>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'SMART THING', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      <View style={{flex: 1}}>
        
        <View style={{marginTop:20,width: "40%", alignSelf: 'center'}}>
          <Button
          onPress={this.triggerCapture}
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
            this.state.response.map((l, i) => (
              <ListItem
                key={i}
                title={l}
                subtitle='Available'
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
          onPress={this.alertMsg}
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
