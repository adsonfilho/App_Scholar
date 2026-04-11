import { StyleSheet } from 'react-native';
import { COLORS } from './colors'; 

export const TitleStyle = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A', 
    textAlign: 'center',
    marginBottom: 40, 
    letterSpacing: 0.5,
  },
  highlight: {
    color: '#007AFF', 
  }
});