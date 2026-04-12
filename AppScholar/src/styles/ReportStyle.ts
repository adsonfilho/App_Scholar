import { StyleSheet } from 'react-native';

export const ReportStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  navHeader: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    paddingHorizontal: 16, height: 64, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F2F2F7',
  },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  scroll: { padding: 16 },
  studentCard: { 
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  studentLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '800', textTransform: 'uppercase' },
  studentName: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginTop: 4 },
  courseName: { fontSize: 14, color: '#5856D6', fontWeight: '600', marginTop: 2 },
  
  tableHeader: { 
    flexDirection: 'row', backgroundColor: '#F2F2F7', padding: 12, 
    borderRadius: 8, marginBottom: 8 
  },
  headerText: { fontSize: 10, fontWeight: '800', color: '#8E8E93', flex: 1, textAlign: 'center' },
  headerSubject: { flex: 2, textAlign: 'left' },
  
  row: { 
    flexDirection: 'row', backgroundColor: '#FFF', padding: 14, 
    borderRadius: 12, marginBottom: 8, alignItems: 'center',
    elevation: 1 
  },
  cell: { fontSize: 14, color: '#1C1C1E', flex: 1, textAlign: 'center', fontWeight: '600' },
  subjectCell: { flex: 2, textAlign: 'left', fontWeight: '700', color: '#1C1C1E' },
  
  statusBadge: { paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6, minWidth: 75 },
  statusText: { fontSize: 10, fontWeight: '800', textAlign: 'center' },
  
  aprovadoBg: { backgroundColor: '#34C75915' },
  aprovadoText: { color: '#34C759' },
  reprovadoBg: { backgroundColor: '#FF3B3015' },
  reprovadoText: { color: '#FF3B30' }
});