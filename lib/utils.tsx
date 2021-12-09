import React from 'react';
import {
  StyleProp,
  ViewStyle,
  Text,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

const minGameCodeSize = 4;
const maxGameCodeSize = 12;

type betterButtonProps = {
  style: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  title: string;
  onPress: () => void;
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
