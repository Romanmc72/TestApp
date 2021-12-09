import React from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {NavigationInjectedProps, withNavigation} from 'react-navigation';
import {styles} from './stylesheet';
import {
  BetterButton,
  generateRandomGameCode,
  validateGameCode,
} from './utils';

const defaultGameCode = '';

enum Warning {
  default = '',
  invalidGameCode = '(Game Code must be between 4-12 characters, and be ' +
                    'lowercase or hyphens only)',
}

type HomeScreenProps = {
  gameCode: string;
  warning: Warning;
}

/**
 * The class declaring the 'Home' screen
 * @constructor
 * @param {NavigationInjectedProps} props - props to render with navigation
 */
class HomeScreen extends React.Component<
  NavigationInjectedProps, HomeScreenProps
> {
  /**
   * Class constructor
   * @param {NavigationInjectedProps} props - The properties for navigating to
   * other screens using this screen for the home page
   */
  constructor(props: NavigationInjectedProps) {
    super(props);
    this.state = {
      gameCode: defaultGameCode,
      warning: Warning.default,
    };
  }

  /**
   * Execute the navigation function to change pages to the value held in the
   * gameCode state variable
   * @param {string} gameCode - The game code you would like to navigate to
   */
  goToGameCode = (gameCode: string) => {
    if ( validateGameCode(gameCode) ) {
      this.props.navigation.setParams({title: gameCode});
      this.props.navigation.navigate(
          'Scores',
          {
            gameCode: gameCode,
            title: gameCode,
          },
      );
    } else {
      this.setState(() => {
        return {
          gameCode: gameCode,
          warning: Warning.invalidGameCode,
        };
      });
    }
  };

  /**
   * Renders the home screen
   * @return {JSX.Element} - The Home Screen app, rendered
   */
  render(): JSX.Element {
    return (
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
        <View style={ styles.homePage }>
          <Text style={ styles.headerText }>
            Type in a Scoreboard Game Code to go to, or get a new random one!
          </Text>
          <Text style={ styles.homeTextWarning }>
            { this.state.warning }
          </Text>
          <TextInput
            autoCapitalize='none'
            autoCorrect={ false }
            enablesReturnKeyAutomatically={ true }
            onChangeText={ (text: string) => {
              this.setState(() => {
                return {
                  gameCode: text,
                  warning: Warning.default,
                };
              });
            } }
            placeholder="scoreboard game code"
            returnKeyType="done"
            style={ styles.homeGameCodeInput }
            value={ this.state.gameCode }
          />
          <BetterButton
            onPress={ () => {
              const randomGameCode = generateRandomGameCode();
              this.goToGameCode(randomGameCode);
            } }
            style={ styles.button }
            textStyle={ styles.buttonTextHome }
            title="New Random Scoreboard!"
          />
          <BetterButton
            onPress={ () => {
              this.goToGameCode(this.state.gameCode);
            } }
            style={ styles.button }
            textStyle={ styles.buttonTextHome }
            title={ `Go To "${this.state.gameCode}" Scoreboard.` }
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(HomeScreen);
