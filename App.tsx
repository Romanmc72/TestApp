import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { styles } from './lib/stylesheet';

type score = {
  name: string,
  score: number
}

const Stack = createNativeStackNavigator();

export default function App() {
  // Read up here for navigation between screens
  // https://reactnative.dev/docs/navigation
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Bitch"
          component={DumbBitchScreen}
          options={{ title: "Who Dat Bitch?" }}
        />
        <Stack.Screen
          name="Other"
          component={InOtherNewsScreen}
          options={{ title: "What else." }}
        />
        <Stack.Screen
          name="Scores"
          component={scoreBoardScreen}
          options={{ title: "Scoreboard" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function scoreBoardScreen() {
  const emptyScoreBoard: score[] = [];
  const [scoreBoard, setScoreBoard] = useState(emptyScoreBoard);

  async function getScoreBoard() {
    const game_code = 'test-app';
    let people: score[] = [];
    const scores = await axios({
        url: "/api/scoreboard/" + game_code,
        baseURL: 'https://scoreboard.r0m4n.com',
        method: 'get'
      })
      .then((response) => {return response.data;})
      .catch(function (error) {
        console.log("Error !!!:");
        console.log(error);
      });
    setScoreBoard(scores);
  }

  const interval: {current: NodeJS.Timeout | null} = useRef(null);

  useEffect(() => {
    interval.current = setInterval(getScoreBoard, 5000);
    return () => {
      clearInterval(interval.current as NodeJS.Timeout);
      interval.current = null;
    }
  });

  function getRows() {
    const gridRows: JSX.Element[] = [];
    scoreBoard.forEach((item: score, index: number) => {
      gridRows.push(
        <Row key={ index } style={ styles.row }>
          <Col style={ styles.column }><Text style={ styles.rowNameText }>{ item.name }</Text></Col>
          <Col style={ styles.column }><Text style={ styles.rowScoreText }>{ item.score }</Text></Col>
        </Row>
      );
    });
    return gridRows;
  }
  function scoresTable() {
    return (
      <View style={ styles.table }>
        <Grid>
            <Row key="header" style={ styles.header }>
              <Col style={ styles.column }><Text style={ styles.headerText }>Name</Text></Col>
              <Col style={ styles.column }><Text style={ styles.headerText }>Score</Text></Col>
            </Row>
            { getRows() }
        </Grid>
      </View>
    );
  }

  getScoreBoard();
  return (
    <View>
      <Text>Scoreboard for 'test-app'</Text>
      { scoresTable() }
      <Button title="Refresh Score" onPress={getScoreBoard}/>
    </View>
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
      <Button onPress={() => navigation.navigate('Scores')} title="Check Scoreboard."/>
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

