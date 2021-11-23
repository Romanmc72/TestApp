import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  column: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  header: { 
    backgroundColor: '#ABABAB',
    borderWidth: 2,
    height: 50,
  },
  headerText: {
    color: '#000000',
    fontSize: 32,
    padding: 5,
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#F7F8FA',
    borderColor: '#000000',
    borderTopWidth: 0,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    height: 40,
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
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderRadius: 10,
    height: 300,
    padding: 16,
    paddingTop: 100,
    width: '100%',
  },
});
  