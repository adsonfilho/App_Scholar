import { StyleSheet, Platform } from 'react-native';

// Estilo Base para manter consistência
const HEADER_HEIGHT = 64;

export const StudentListStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  navHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    height: HEADER_HEIGHT,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  navBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', flex: 1, textAlign: 'center' },
  headerAddBtn: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', 
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({ ios: { shadowColor: '#007AFF', shadowOpacity: 0.3, shadowRadius: 4 }, android: { elevation: 3 } })
  },
  headerContent: { padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 12, height: 45 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  list: { padding: 20 },
  card: { 
    backgroundColor: '#FFF', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF15', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#007AFF', fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  details: { fontSize: 13, color: '#8E8E93' },
  actions: { flexDirection: 'row' },
  actionBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  editBtn: { backgroundColor: '#E8F2FF' },
  deleteBtn: { backgroundColor: '#FFEBEB' }
});

export const RegisterStudentStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    height: HEADER_HEIGHT,
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#F2F2F7' 
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', flex: 1, textAlign: 'center' },
  headerSpacer: { width: 44 }, // Compensação para o botão de voltar
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 11, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row' },
  saveBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
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
  marginBottom: 12,
},
selectButtonText: {
  fontSize: 15,
  color: '#1C1C1E',
  flex: 1,
},
placeholderText: {
  fontSize: 15,
  color: '#636366',
  fontWeight: '500',
  flex: 1,
},
selectDisabled: {
  backgroundColor: '#F2F2F7',
  borderColor: '#E5E5EA',
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
modalOption: {
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E5EA',
  alignItems: 'center',
},
modalOptionText: {
  fontSize: 16,
  color: '#007AFF',
  fontWeight: '600',
},
cancelOption: {
  marginTop: 10,
  backgroundColor: '#F2F2F7',
  borderRadius: 10,
  borderBottomWidth: 0,
},
cancelOptionText: {
  color: '#FF3B30',
},
});