import { StyleSheet, Platform } from 'react-native';

export const RegisterInvitationStyle = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  wrapper: { 
    flex: 1, 
    paddingHorizontal: 20, 
    justifyContent: 'center', 
    width: '100%', 
    maxWidth: 500, 
    alignSelf: 'center' 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1C1C1E', 
    marginBottom: 8, 
    marginTop: 15, 
    marginLeft: 4 
  },
  selectorContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#E5E5EA', 
    borderRadius: 10, 
    padding: 3, 
    marginBottom: 10 
  },
  selectorButton: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  selectorActive: { 
    backgroundColor: '#FFF', 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1 },
      android: { elevation: 2 },
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }
    })
  },
  selectorText: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#8E8E93' 
  },
  selectorTextActive: { 
    color: '#1C1C1E', 
    fontWeight: '700' 
  },

  customSelectButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#1C1C1E', 
  },
  placeholderText: {
    fontSize: 16,
    color: '#636366', 
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  courseOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  courseOptionText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  cancelOption: {
    marginTop: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
  cancelOptionText: {
    color: '#FF3B30',
  },

  buttonContainer: { marginTop: 20, height: 45, justifyContent: 'center' },
  backButton: { marginTop: 25, alignItems: 'center' },
  backButtonText: { color: '#007AFF', fontSize: 15, fontWeight: '500' }
});