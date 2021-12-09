import {Picker} from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {NavigationParams} from 'react-navigation';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {styles} from './stylesheet';
import {BetterButton} from './utils';

const defaultPlayerName = '';
const baseUrl = 'https://scoreboard.r0m4n.com/';
const axiosBaseUrl = baseUrl + 'api/scoreboard/';
const defaultPoints = 0;

enum ModalType {
  score = 'score',
  player = 'player',
}

enum SetPlayerScoreMethod {
  add = 'add',
  replace = 'replace',
}

type Score = {
  name: string;
  score: number;
}

type MinusSign = '-';
type SingedNumericInput = number | MinusSign;

type EditScoreModalProps = {
  inputPoints: number | MinusSign;
  isVisible: boolean | undefined;
  modalType: ModalType;
  name: string;
  score: number;
}

type ScoreBoardScreenState = {
  modalProps: EditScoreModalProps;
  scoreboard: Score[];
}

/**
 * The abstract class from which the actual scoreboard will inherit
 * its property and state definitions
 */
abstract class ScoreboardScreenClass extends React.Component<
  NavigationParams, ScoreBoardScreenState
> {
  gameCode: string;
  interval: NodeJS.Timeout | null;
  scoreboardUrl: string;
  /**
   * Abstract component constructor for a scoreboard screen
   * @param {NavigationParams} props - props with navigation
   */
  constructor(props: NavigationParams) {
    super(props);
    this.gameCode = '';
    this.interval = null;
    this.scoreboardUrl = axiosBaseUrl + this.gameCode;
  }
}

/**
 * The Scoreboard Screen (the class oriented way)
 */
export class ScoreboardScreen extends ScoreboardScreenClass {
  /**
   * Constructs the initial state and properties of the scoreboard
   * @param {NavigationParams} props - The properties for the screen
   * @param {ScoreBoardScreenState} state - The state of the screen
   */
  constructor(props: NavigationParams, state: ScoreBoardScreenState) {
    super(props);
    this.gameCode = props.route.params.gameCode;
    props.navigation.setOptions(
        {
          title: `Game Code: ${this.gameCode}`,
          // TODO: Get this to work
          headerRight: () => {
            <Button
              onPress={ () => {
                Clipboard.setString(baseUrl + 'scoreboard/' + this.gameCode);
              } }
              title='Copy Game Code'
            />;
          },
        },
    );
    this.scoreboardUrl = axiosBaseUrl + this.gameCode;
    this.state = {
      modalProps: {
        inputPoints: defaultPoints,
        isVisible: false,
        modalType: ModalType.score,
        name: defaultPlayerName,
        score: 0,
      },
      scoreboard: [],
    };
  }

  // Methods for interacting with the API and updating the state of the app

  /**
   * Iterates through the scoreboard to find the player name and returns their
   * score if they exist, if they do nto exist it returns 0
   * @param {string} name - The player name to find in the scoreboard
   * @param {Score[]} scoreboard - The scoreboard to search in
   * @return {number} - The score for this player in the scoreboard, or 0
   */
  lookupPlayerScore = (name: string, scoreboard: Score[]): number => {
    scoreboard.forEach((item: Score, index: number) => {
      if (item.name == name) {
        return item.score;
      }
    });
    return defaultPoints;
  };

  /**
   * Refreshes the scoreboard data from the API, and triggers the state change
   * if the API returned scoreboard is different than the current
   */
  refreshScoreBoard = async () => {
    await axios.get(this.scoreboardUrl)
        .then((response) => {
          if (
            JSON.stringify(this.state.scoreboard) ==
            JSON.stringify(response.data)
          ) {
            return null;
          } else {
            this.setState((state) => {
              return {
                scoreboard: response.data,
                modalProps: {
                  inputPoints: state.modalProps.inputPoints,
                  isVisible: state.modalProps.isVisible,
                  modalType: state.modalProps.modalType,
                  name: state.modalProps.name,
                  score: state.modalProps.name ==
                    defaultPlayerName ?
                    defaultPoints :
                    this.lookupPlayerScore(
                        state.modalProps.name,
                        response.data,
                    ),
                },
              };
            });
          }
        })
        .catch(function(this: ScoreboardScreen, error: any) {
          console.log('Error !!!:');
          console.log(error);
        });
  };

  /**
   * Resets all scores on the scoreboard to 0 via the API
   */
  clearScoreBoard = async () => {
    await axios.put(this.scoreboardUrl)
        .then(() => {
          this.refreshScoreBoard();
        })
        .catch(function(error) {
          console.log('Error !!!:');
          console.log(error);
        });
  };

  /**
   * Wipes the scoreboard of all scores and names
   */
  destroyScoreBoard = async () => {
    await axios.delete(this.scoreboardUrl)
        .then(() => {
          this.refreshScoreBoard();
        })
        .catch(function(error) {
          console.log('Error !!!:');
          console.log(error);
        });
  };

  /**
   * Either adds points to a player's score
   * or replaces their score with a new value
   * @param {string} name - The player name to modify
   * @param {SingedNumericInput} amount - The amount to change on the score
   * @param {SetPlayerScoreMethod} method - The method to use, add or replace
   */
  setPlayerScore = async (
      name: string, amount: SingedNumericInput, method: SetPlayerScoreMethod,
  ) => {
    if (amount == '-') {} else {
      await axios
          .put(
              this.scoreboardUrl + '/score/' + name,
              {
                'score': amount,
                'method': method,
              },
          )
          .then(() => {
            this.refreshScoreBoard();
          }).catch(function(error) {
            console.log('Error !!!');
            console.log(error);
          });
    }
  };

  /**
   * Adds a player to the scoreboard and optionally a score as well
   * @param {string} name - The name of the player
   * @param {number} amount - The amount to add along with the player
   * @param {ScoreBoardScreenState} state - The current state of the screen
   */
  addPlayer = async (name: string, amount: number) => {
    await axios
        .put(
            this.scoreboardUrl + '/score/' + name,
            {
              'score': amount,
            },
        )
        .then(() => {
          this.setState((state) => {
            return {
              modalProps: state.modalProps,
              playerName: defaultPlayerName,
              scoreboard: state.scoreboard,
            };
          });
          this.refreshScoreBoard();
        }).catch(function(error) {
          console.log('Error !!!');
          console.log(error);
        });
  };

  /**
   * Deletes a player from the scoreboard
   * @param {string} name - The name of the player
   */
  deletePlayer = async (name: string) => {
    await axios
        .delete(this.scoreboardUrl + '/score/' + name)
        .then(() => {
          this.refreshScoreBoard();
        }).catch(function(error) {
          console.log('Error !!!');
          console.log(error);
        });
  };

  // Methods for rendering components and subcomponents

  /**
   * Retrieves and renders the actual scoreboard rows for the view
   * @return {JSX.Element[]} The array of rows in the scoreboard rendered
   */
  getRows = (): JSX.Element[] => {
    const gridRows: JSX.Element[] = [];
    this.state.scoreboard.forEach((item: Score, index: number) => {
      gridRows.push(
          <Row key={ index } style={ styles.row }>
            <Col style={ styles.column }>
              <Text style={ styles.rowNameText }>{ item.name }</Text>
            </Col>
            <Col style={ styles.column }>
              <View style={ styles.pointsAndButtonWrapper }>
                <BetterButton
                  onPress={() => {
                    this.setState((state) => {
                      return {
                        modalProps: {
                          inputPoints: defaultPoints,
                          isVisible: !state.modalProps.isVisible,
                          modalType: ModalType.score,
                          name: item.name,
                          score: item.score,
                        },
                        scoreboard: state.scoreboard,
                      };
                    });
                  }}
                  style={ styles.button }
                  textStyle={ styles.buttonText }
                  title="+"
                />
                <Text style={ styles.rowScoreText }>{ item.score }</Text>
              </View>
            </Col>
          </Row>,
      );
    });
    return gridRows;
  };

  /**
   * Constructs the scoreboard table
   * @return {JSX.Element} The scores table, rendered
   */
  scoresTable = (): JSX.Element => {
    return (
      <Grid style={ styles.table }>
        <View style={ styles.container }>
          <ScrollView stickyHeaderIndices={[0]}>
            <Row key='header' style={ styles.header }>
              <Col style={ styles.column }>
                <Text style={ styles.headerText }>Name</Text>
              </Col>
              <Col style={ styles.column }>
                <Text style={ styles.headerText }>Score</Text>
              </Col>
            </Row>
            { this.getRows() }
          </ScrollView>
        </View>
      </Grid>
    );
  };

  /**
   * Fills the player picker with items to pick
   * @return {JSX.Element} - The individual items populating the picker
   */
  renderPlayerPickerItems = (): JSX.Element[] => {
    const alphabetizedNames: string[] = [];
    const pickerItems: JSX.Element[] = [];
    this.state.scoreboard.forEach((item: Score, index: number) => {
      alphabetizedNames.push(item.name);
    });
    alphabetizedNames.sort();
    alphabetizedNames.forEach((item: string, index: number) => {
      pickerItems.push(
          <Picker.Item label={ item } value={ item } key={ index }/>,
      );
    });
    return pickerItems;
  };

  /**
   * Renders the picker for picking an existing player to delete
   * @return {JSX.Element} The player picker component
   */
  renderPlayerPicker(): JSX.Element {
    return (
      <View style={ styles.container }>
        <Picker
          selectedValue={ this.state.modalProps.name }
          onValueChange={ (itemValue, itemIndex) => {
            this.setState((state) => {
              return {
                scoreboard: state.scoreboard,
                modalProps: {
                  inputPoints: state.modalProps.inputPoints,
                  isVisible: state.modalProps.isVisible,
                  modalType: state.modalProps.modalType,
                  name: itemValue,
                  score: state.modalProps.score,
                },
              };
            });
          } }
          style={ styles.picker }
        >
          { this.renderPlayerPickerItems() }
        </Picker>
      </View>
    );
  }

  /**
   * This function will render the appropriate modal depending on which modal
   * was requested by the user
   * @return {JSX.Element} - The Modal for the given situation
   */
  modalText = (): JSX.Element => {
    if ( this.state.modalProps.modalType == ModalType.score ) {
      return (
        <View style={ styles.modalView }>
          <Text style={ styles.headerText }>
            Player: { this.state.modalProps.name }
          </Text>
          <Text style={ styles.headerText }>
            Points: { this.state.modalProps.score }
          </Text>
          <View style={ styles.pointsAndButtonWrapper }>
            <BetterButton
              onPress={ () => {
                this.setPlayerScore(
                    this.state.modalProps.name,
                    this.state.modalProps.inputPoints,
                    SetPlayerScoreMethod.add,
                );
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Add'
            />
            <BetterButton
              onPress={ () => {
                this.setPlayerScore(
                    this.state.modalProps.name,
                    this.state.modalProps.inputPoints,
                    SetPlayerScoreMethod.replace,
                );
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Replace'
            />
            <BetterButton
              onPress={ () => {
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Cancel'
            />
          </View>
          <View style={ styles.playerScoreInputContainer }>
            <TextInput
              autoCorrect={ false }
              autoFocus={ true }
              enablesReturnKeyAutomatically={ true }

              // IOS does not have the capability to enter negative
              // values on the number pad, so you have to include all
              // of the other keyboard options too
              keyboardType={ Platform.OS ===
                'ios' ?
                'numbers-and-punctuation' :
                'number-pad'
              }

              onChangeText={ (text) => {
                this.setState((state) => {
                  return {
                    modalProps: {
                      inputPoints: text ==
                        '0-' ?
                        '-' :
                        parseInt(text) || 0,
                      isVisible: state.modalProps.isVisible,
                      modalType: state.modalProps.modalType,
                      name: state.modalProps.name,
                      score: state.modalProps.score,
                    },
                    scoreboard: state.scoreboard,
                  };
                });
              } }
              onSubmitEditing={ Keyboard.dismiss }
              placeholder='0'
              returnKeyType='done'
              style={ styles.playerScoreInput }
              value={ this.state.modalProps.inputPoints.toString() }
            />
          </View>
        </View>
      );
    } else if ( this.state.modalProps.modalType == ModalType.player ) {
      return (
        <View style={ styles.modalView }>
          <Text style={ styles.headerText }>
            Add Or Delete Players
          </Text>
          <View style={ styles.pointsAndButtonWrapper }>
            <BetterButton
              onPress={ () => {
                this.addPlayer(this.state.modalProps.name, 0);
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Add'
            />
            <BetterButton
              onPress={ () => {
                this.deletePlayer(
                    this.state.modalProps.name,
                );
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Delete'
            />
            <BetterButton
              onPress={ () => {
                this.resetModal();
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Cancel'
            />
          </View>
          <View style={ styles.playerScoreInputContainer }>
            <TextInput
              autoCapitalize='none'
              autoCorrect={ false }
              enablesReturnKeyAutomatically={ true }
              onChangeText={ (text) => {
                this.setState((state) => {
                  return {
                    modalProps: {
                      inputPoints: state.modalProps.inputPoints,
                      isVisible: state.modalProps.isVisible,
                      modalType: state.modalProps.modalType,
                      name: text,
                      score: state.modalProps.score,
                    },
                    scoreboard: state.scoreboard,
                  };
                });
              } }
              placeholder="add new player name"
              returnKeyType="done"
              style={ styles.playerNameInput }
              value={ this.state.modalProps.name }
            />
          </View>
        </View>
      );
    } else {
      return (<View></View>);
    }
  };

  /**
   * Renders the score editing popup
   * @return {JSX.Element} - The score editing popup, rendered
   */
  editScoreboardPopup = (): JSX.Element => {
    return (
      <Modal
        animationType="slide"
        transparent={ true }
        visible={ this.state.modalProps.isVisible }
        onRequestClose={ () => {
          Alert.alert('Modal has been closed.');
          this.resetModal();
        } }
      >
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
          <View style={ styles.centeredView }>
            { this.modalText() }
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  /**
   * This will reset the modal, disengaging its current state and putting the
   * modal props back to their defaults
   */
  resetModal = () => {
    this.setState((state) => {
      return {
        modalProps: {
          inputPoints: defaultPoints,
          isVisible: !state.modalProps.isVisible,
          modalType: state.modalProps.modalType,
          name: defaultPlayerName,
          score: defaultPoints,
        },
        scoreboard: state.scoreboard,
      };
    });
  };

  // Functions for rendering and updating the actual page itself

  /**
   * Runs when the screen is opening to start the auto-refresher
   */
  componentDidMount = () => {
    this.refreshScoreBoard();
    this.interval = setInterval(
        () => {
          this.refreshScoreBoard();
        },
        5000,
    );
  };

  /**
   * Runs when the screen is closing to remove the auto-refresher
   */
  componentWillUnmount = () => {
    clearInterval(this.interval as NodeJS.Timeout);
    this.interval = null;
  };

  /**
   * Renders the page for the scoreboard
   * @return {JSX.Element} The Scoreboard page
   */
  render = (): JSX.Element => {
    return (
      <KeyboardAvoidingView
        behavior='height'

        // I set this  because otherwise it was still covering
        // the text input with the keyboard
        keyboardVerticalOffset={ 200 }

        style={ styles.container }
      >
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
          <View>
            <View style={ styles.buttonContainer }>
              <BetterButton
                style={ styles.button }
                textStyle={ styles.buttonText }
                onPress={ this.clearScoreBoard }
                title="Clear ScoreBoard"
              />
              <BetterButton
                style={ styles.button }
                textStyle={ styles.buttonText }
                onPress={ this.destroyScoreBoard }
                title="Destroy ScoreBoard"
              />
            </View>
            { this.scoresTable() }
            { this.editScoreboardPopup() }
            <BetterButton
              onPress={ () => {
                this.setState((state) => {
                  return {
                    modalProps: {
                      inputPoints: state.modalProps.inputPoints,
                      isVisible: !state.modalProps.isVisible,
                      modalType: ModalType.player,
                      name: state.modalProps.name,
                      score: state.modalProps.score,
                    },
                    scoreboard: state.scoreboard,
                  };
                });
              } }
              style={ styles.button }
              textStyle={ styles.buttonText }
              title='Add / Delete Player'
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };
}
