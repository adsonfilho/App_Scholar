import { StyleSheet, Platform } from 'react-native';

const HEADER_HEIGHT = 64;

export const CourseStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  navHeader: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 16, height: HEADER_HEIGHT, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F2F2F7',
  },
  navBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', flex: 1, textAlign: 'center' },
  headerAddBtn: { 
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#5856D6', // Roxo
    justifyContent: 'center', alignItems: 'center', elevation: 3
  },
  headerSpacer: { width: 44 },
  headerContent: { padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', borderRadius: 12, paddingHorizontal: 12, height: 45 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  list: { padding: 20 },
  card: { 
    backgroundColor: '#FFF', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#5856D615', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#5856D6', fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  details: { fontSize: 13, color: '#8E8E93' },
  badge: { backgroundColor: '#F2F2F7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start', marginTop: 4 },
  badgeText: { fontSize: 11, color: '#5856D6', fontWeight: '700' },
  actions: { flexDirection: 'row' },
  actionBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  editBtn: { backgroundColor: '#E8F2FF' },
  deleteBtn: { backgroundColor: '#FFEBEB' },
  scroll: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase' },
  formCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 11, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  saveBtn: { backgroundColor: '#5856D6', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  // Adicione esses seletores logo abaixo do seu 'row' ou 'saveBtnText' dentro do StyleSheet.create:

  customSelect: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#5856D6', 
    fontWeight: '700',
  },
  modalCancel: {
    marginTop: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    borderBottomWidth: 0,
  }
});