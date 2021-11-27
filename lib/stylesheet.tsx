import { StyleSheet, Dimensions } from 'react-native';

let screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  addPointsButton: {
    textAlign: 'left',
  },
  column: {
    borderColor: '#000000',
    borderWidth: 2,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#ff7700',
    borderWidth: 2,
    height: 50,
    width: screenWidth,
  },
  headerText: {
    color: '#000000',
    fontSize: 32,
    padding: 5,
    textAlign: 'center',
  },
  playerNameInput: {
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    margin: 12,
    padding: 10,
  },
  pointsAndButtonWrapper: {
    flexDirection: 'row',
  },
  row: {
    backgroundColor: '#F7F8FA',
    borderColor: '#000000',
    borderTopWidth: 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    height: 40,
    width: screenWidth
  },
  rowNameText: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    paddingLeft: 20
  },
  rowScoreText: {
    color: '#000000',
    fontSize: 18,
    padding: 5,
    paddingRight: 20,
    textAlign: 'right',
  },
  table: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderRadius: 10,
    flex: 9,
    justifyContent: 'center',
    textAlignVertical: 'top',
    width: screenWidth,
  },
});
  