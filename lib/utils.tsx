import axios from 'axios';
import React from 'react';
import {
  StatusBar,
  StyleProp,
  ViewStyle,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

export const baseUrl = 'https://scoreboard.r0m4n.com/';
export const axiosBaseUrl = baseUrl + 'api/scoreboard/';
const minGameCodeSize = 4;
const maxGameCodeSize = 12;

type betterButtonProps = {
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  title: string;
  onPress: () => void;
}

/**
 * A class that provides one single status bar for the whole app, so changes
 * to here apply everywhere
 */
export class StandardStatusBar extends React.Component {
  /**
   * Renders the status bar
   * @return {JSX.Element} - The rendered status bar
   */
  render = (): JSX.Element => {
    return (
      <StatusBar
        barStyle='dark-content'
        hidden={ false }
        backgroundColor='#b8b8b8'
      />
    );
  };
}

/**
 * This is a better button than the default react button
 */
export class BetterButton extends React.Component<betterButtonProps, {}> {
  /**
   * Constructs an instance of a better button component
   * @param {betterButtonProps} props - The props rendering the better button
   */
  constructor(props: betterButtonProps) {
    super(props);
  }
  /**
   * Renders the better button
   * @return {JSX.Element} - Rendered Better Button
   */
  render = (): JSX.Element => {
    return (
      <TouchableOpacity
        style={ this.props.style }
        onPress={ this.props.onPress }
      >
        <Text style={ this.props.textStyle }>{ this.props.title }</Text>
      </TouchableOpacity>
    );
  };
}

/**
 * Get the scoreboard and execute a callback function on the results
 * @param {string} gameCode - The game code to see get the scoreboard for
 * @param {Function} callback - The callback to be executed on api the response
 * @return {Promise<void>} - A promise that returns nothing
 */
export async function getScoreboard(
    gameCode: string, callback: Function,
): Promise<void> {
  const url = axiosBaseUrl + gameCode;
  await axios.get(url)
      .then((response) => callback(response))
      .catch(function(error) {
        console.log('Error !!!:');
        console.log(error);
      });
}

/**
 * Validates a given game code
 * @param {string} gameCode - The game code you wish to validate
 * @return {boolean} - Whether or not the input game code is valid
 */
export function validateGameCode(gameCode: string): boolean {
  const validGameCodeRegex = new RegExp(
      `^[a-z\-]{${minGameCodeSize},${maxGameCodeSize}}$`,
  );
  return validGameCodeRegex.test(gameCode);
}

/**
 * Returns a 4-12 character string composed of lowercase letters and hyphens
 * @return {string} A random gameCode
 */
export function generateRandomGameCode(): string {
  let result = '';
  const choices = 'abcdefghijklmnopqrstuvwxyz-';
  const choicesLength = choices.length;
  const resultLength = Math.floor(
      Math.random() * (maxGameCodeSize - minGameCodeSize),
  ) + minGameCodeSize;
  for ( let i = 0; i < resultLength; i++ ) {
    result += choices.charAt(Math.floor(Math.random() * choicesLength));
  }
  if ( validateGameCode(result) ) {
    return result;
  } else {
    return generateRandomGameCode();
  }
}
