import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const StatusStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 5,
  },
  content: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  success: { backgroundColor: COLORS.SUCCESS },
  error: { backgroundColor: COLORS.DANGER },
  warning: { backgroundColor: COLORS.WARNING },
  
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});