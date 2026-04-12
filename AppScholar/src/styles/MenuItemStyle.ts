import { StyleSheet, Platform } from 'react-native';

export const MenuItemStyle = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
      web: { cursor: 'pointer', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }
    })
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  content: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
  description: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  arrow: { fontSize: 22, color: '#C7C7CC', fontWeight: '300', marginLeft: 10 },
});