import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Button,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { styles } from './lib/stylesheet';

type Score = {
  name: string;
  score: number;
}

const axiosBaseUrl = 'https://scoreboard.r0m4n.com';
const Stack = createNativeStackNavigator();

export default function App() {
  // Read up here for navigation between screens
  // https://reactnative.dev/docs/navigation
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={DumbBitchScreen}
          options={{ title: "Start Or Join A Scoreboard" }}
        />
        <Stack.Screen
          name="Other"
          component={InOtherNewsScreen}
          options={{ title: "What else." }}
        />
        <Stack.Screen
          name="Scores"
          component={scoreboardScreen}
          options={{ title: "Scoreboard" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type RootStackProps = {
  Home: undefined;
  Other: undefined;
  Score: { gameCode: string };
}

type scoreboardScreenProps = NativeStackScreenProps<RootStackProps, 'Score'>;

function scoreboardScreen({navigation, route}: scoreboardScreenProps) {
  const gameCode = route.params.gameCode;
  const scoreboardUrl = axiosBaseUrl + "/api/scoreboard/" + gameCode;
  navigation.setOptions({ title: gameCode });
  const emptyScoreBoard: Score[] = [];
  const [scoreboard, setScoreBoard] = useState(emptyScoreBoard);
  const [playerNameText, onSubmitPlayerName] = useState('');

  async function refreshScoreBoard() {
    const previousScore = scoreboard;
    const scores = await axios.get(scoreboardUrl)
    .then((response) => {return response.data;})
    .catch(function (error) {
      console.log("Error !!!:");
      console.log(error);
      return previousScore
    });
    setScoreBoard(scores);
  }

  async function clearScoreBoard() {
    await axios.put(scoreboardUrl)
      .then(() => {
        refreshScoreBoard();
      })
      .catch(function (error) {
        console.log("Error !!!:");
        console.log(error);
      });
  }

  async function destroyScoreBoard() {
    await axios.delete(scoreboardUrl)
      .then(() => {
        refreshScoreBoard();
      })
      .catch(function (error) {
        console.log("Error !!!:");
        console.log(error);
      });
  }

  async function setPlayerScore(name: string, amount: number, method: string) {
    await axios
      .put(
        scoreboardUrl + "/score/" + name,
        {
          'score': amount,
          'method': method
        }
      )
      .then(() => {
        refreshScoreBoard();
      }).catch(function (error) {
        console.log("Error !!!");
        console.log(error);
      });
  }

  async function addPlayer(name: string, amount: number) {
    await axios
      .put(
        scoreboardUrl + "/score/" + name,
        {
          'score': amount
        }
      )
      .then(() => {
        onSubmitPlayerName('');
        refreshScoreBoard();
      }).catch(function (error) {
        console.log("Error !!!");
        console.log(error);
      }); 
  }

  async function deletePlayer(name: string) {
    await axios
      .delete(scoreboardUrl + "/score/" + name)
      .then(() => {
        refreshScoreBoard();
      }).catch(function (error) {
        console.log("Error !!!");
        console.log(error);
      }); 
  }

  const interval: {current: NodeJS.Timeout | null} = useRef(null);

  useEffect(() => {
    interval.current = setInterval(refreshScoreBoard, 5000);
    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
      interval.current = null;
    }
  });

  function getRows() {
    const gridRows: JSX.Element[] = [];
    scoreboard.forEach((item: Score, index: number) => {
      gridRows.push(
        <Row key={ index } style={ styles.row }>
          <Col style={ styles.column }><Text style={ styles.rowNameText }>{ item.name }</Text></Col>
          <Col style={ styles.column }>
            <View style={ styles.pointsAndButtonWrapper }>
              <Button title="+" onPress={() => {console.log("plus");}}/>
              <Text style={ styles.rowScoreText }>{ item.score }</Text>
            </View>
          </Col>
        </Row>
      );
    });
    return gridRows;
  }
  function scoresTable() {
    return (
      <Grid style={ styles.table }>
        <View style={ styles.container }>
        <ScrollView stickyHeaderIndices={[0]}>
        <Row key="header" style={ styles.header }>
          <Col style={ styles.column }><Text style={ styles.headerText }>Name</Text></Col>
          <Col style={ styles.column }><Text style={ styles.headerText }>Score</Text></Col>
        </Row>
        { getRows() }
        <TextInput
          autoCapitalize='none'
          autoCorrect={ false }
          enablesReturnKeyAutomatically={ true }
          onChangeText={ onSubmitPlayerName }
          onSubmitEditing={ () => addPlayer(playerNameText, 0) }
          placeholder="add new player name"
          returnKeyType="done"
          style={ styles.playerNameInput }
          value={ playerNameText }
          />
        </ScrollView>
        </View>
      </Grid>
    );
  }

  refreshScoreBoard();
  return (
    <KeyboardAvoidingView 
      behavior='height'
      keyboardVerticalOffset={215} 
      style={ styles.container }
    >
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
        <View>
          <Button title="Clear ScoreBoard" onPress={clearScoreBoard}/>
          <Button title="Destroy ScoreBoard" onPress={destroyScoreBoard}/>
          { scoresTable() }
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function youIsABitch(bitchState: string) {
  if (bitchState == "") {
    return "You is a Bitch."
  } else {
    return ""
  }
}

function DumbBitchScreen({ navigation }: any) {
  const [bitch, setBitch] = useState("");

  return (
    <View style={styles.container}>
      <Text>Who is a big dumb bitch? {bitch}</Text>
      <Button onPress={() => setBitch(youIsABitch(bitch))} title="Find Out Now!"/>
      <StatusBar style="auto"/>
      <Button onPress={() => navigation.navigate('Other')} title="Find Other News."/>
      <Button onPress={() => navigation.navigate('Scores', { gameCode: 'test-app' })} title="Check Scoreboard."/>
    </View>
  );
}

function InOtherNewsScreen() {
  return (
    <View style={styles.container}>
      <Text>Know any other dumb bitches?</Text>
      <Text>Send them this app!</Text>
    </View>
  );
}

