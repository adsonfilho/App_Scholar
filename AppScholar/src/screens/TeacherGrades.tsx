import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { studentService } from '../services/studentService'; 
import { professorService } from '../services/professorService';
import { gradeService } from '../services/gradeService';
import { TeacherStyle } from '../styles/TeacherStyle';
import { useAuth } from '../contexts/AuthContext';
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';
import { gradeInputSchema } from '../schemas/gradeSchema';

export const TeacherGrades = ({ navigation }: any) => {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'subjects' | 'students' | 'grade'>('subjects');
  const [search, setSearch] = useState('');

  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [gradeId, setGradeId] = useState<number | null>(null);
  const [grade1, setGrade1] = useState('');
  const [grade2, setGrade2] = useState('');

  const [fetchedGradeData, setFetchedGradeData] = useState<any>(null);

  const { status, showStatus, hideStatus } = useStatus();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const id = user?.id || 0;

        const response = await professorService.getSubjectsByProfessor(id); 
        const data = response?.data ? response.data : response;
        
        if (data && data.subjects) {
          setSubjects(data.subjects);
        } else if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        showStatus("Não foi possível carregar suas disciplinas.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const handleSelectSubject = async (subject: any) => {
    hideStatus();
    setSelectedSubject(subject);
    try {
      setLoading(true);
      const response = await studentService.getStudentsByCourseId(subject.courseId);
      const data = response?.data ? response.data : response;
      setStudents(data);
      setCurrentStep('students');
    } catch (error) {
      showStatus("Não foi possível carregar os alunos dessa disciplina.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = async (student: any) => {
    hideStatus();
    setSelectedStudent(student);

    try {
      setLoading(true);
      
      const response = await studentService.getStudentReport(student.userId);
      const data = response?.data ? response.data : response;

      const gradesArray = Array.isArray(data) ? data : (data?.grades || []);

      const existingGrade = gradesArray.find((g: any) => g.subjectId === selectedSubject.id);

      if (existingGrade) {
        setGradeId(existingGrade.id);
        setGrade1(existingGrade.grade1 !== null ? String(existingGrade.grade1) : '');
        setGrade2(existingGrade.grade2 !== null ? String(existingGrade.grade2) : '');
        setFetchedGradeData(existingGrade); 
      } else {
        setGradeId(null); 
        setGrade1('');
        setGrade2('');
        setFetchedGradeData(null);
      }
      
      setCurrentStep('grade');

    } catch (error) {
      setGradeId(null); 
      setGrade1('');
      setGrade2('');
      setFetchedGradeData(null);
      setCurrentStep('grade');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (text: string, setGradeState: (val: string) => void) => {
    let formattedText = text.replace(',', '.');
    formattedText = formattedText.replace(/[^0-9.]/g, '');

    const points = formattedText.split('.');
    if (points.length > 2) return;

    const numericValue = Number(formattedText);

    if (!isNaN(numericValue) && numericValue > 10) {
      setGradeState('10');
    } else {
      setGradeState(text);
    }
  };

  const calculateLiveAverage = () => {
    if (!grade1.trim() || !grade2.trim()) return 0.0;

    const n1 = Number(grade1.replace(',', '.'));
    const n2 = Number(grade2.replace(',', '.'));
    return (n1 + n2) / 2;
  };

  const handleSaveGrades = async () => {
    hideStatus();

    const rawGrade1 = grade1.trim() ? Number(grade1.replace(',', '.')) : NaN;
    const rawGrade2 = grade2.trim() ? Number(grade2.replace(',', '.')) : null;

    const validation = gradeInputSchema.safeParse({
      grade1: rawGrade1,
      grade2: rawGrade2,
    });

    if (!validation.success) {
      showStatus(validation.error.issues[0].message, "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        studentId: selectedStudent.id,
        subjectId: selectedSubject.id,
        grade1: validation.data.grade1,
        grade2: validation.data.grade2,
      };

      if (gradeId) {
        await gradeService.updateGrade(gradeId, payload);
        showStatus("Notas atualizadas com sucesso!", "success");
      } else {
        await gradeService.createGrade(payload);
        showStatus("Notas lançadas com sucesso!", "success");
      }

      setTimeout(() => {
        setCurrentStep('subjects');
        setSelectedSubject(null);
        setSelectedStudent(null);
        setFetchedGradeData(null);
      }, 1500);
      
    } catch (error) {
      showStatus("Não foi possível salvar as notas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    hideStatus();
    if (currentStep === 'grade') {
      setCurrentStep('students');
      setSelectedStudent(null);
      setFetchedGradeData(null);
    } else if (currentStep === 'students') {
      setCurrentStep('subjects');
      setSelectedSubject(null);
      setSearch('');
    }
  };

  const filteredStudents = (students || []).filter(s =>
    s?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s?.enrollment?.includes(search)
  );

  const liveAverage = calculateLiveAverage();
  const liveGradeColor = liveAverage >= 6 ? '#007AFF' : '#FF3B30'; 

  return (
    <SafeAreaView style={TeacherStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />
      
      <View style={TeacherStyle.navHeader}>
        <TouchableOpacity 
          onPress={() => {
            if (currentStep === 'subjects') {
              navigation.goBack();
            } else {
              handleBack();
            }
          }} 
          style={{ position: 'absolute', left: 16, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={TeacherStyle.navTitle}>
          {currentStep === 'subjects' && 'Minhas Disciplinas'}
          {currentStep === 'students' && `${selectedSubject?.name}`}
          {currentStep === 'grade' && `Nota: ${selectedStudent?.user?.name}`}
        </Text>
      </View>

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#007AFF" /></View>
      )}

      {!loading && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          
          {currentStep === 'subjects' && (
            <FlatList
              data={subjects}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={TeacherStyle.list}
              ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>Você não está vinculado a nenhuma disciplina.</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity style={TeacherStyle.card} onPress={() => handleSelectSubject(item)}>
                  <View style={TeacherStyle.info}>
                    <Text style={TeacherStyle.name}>{item.name}</Text>
                    <Text style={TeacherStyle.details}>{item.workload}h • {item.semester}º Semestre</Text>
                    <View style={[TeacherStyle.tag, { backgroundColor: '#E1F5FE' }]}><Text style={[TeacherStyle.tagText, { color: '#0288D1' }]}>Curso ID: {item.courseId}</Text></View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CD" style={{ alignSelf: 'center' }} />
                </TouchableOpacity>
              )}
            />
          )}

          {currentStep === 'students' && (
            <>
              <View style={TeacherStyle.headerContent}>
                <View style={TeacherStyle.searchBar}>
                  <Ionicons name="search" size={20} color="#8E8E93" />
                  <TextInput 
                    style={TeacherStyle.searchInput} 
                    placeholder="Buscar aluno por nome ou RM..." 
                    value={search} 
                    onChangeText={setSearch} 
                  />
                </View>
              </View>
              <FlatList
                data={filteredStudents}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={TeacherStyle.list}
                ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>Nenhum aluno matriculado neste curso.</Text>}
                renderItem={({ item }) => {
                  const currentGrade = item.grades?.find((g: any) => g.subjectId === selectedSubject.id);
                  const isApproved = currentGrade ? Number(currentGrade.average) >= 6 : false;
                  return (
                    <TouchableOpacity style={TeacherStyle.card} onPress={() => handleSelectStudent(item)}>
                      <View style={TeacherStyle.avatar}><Text style={TeacherStyle.avatarText}>{item.user?.name?.charAt(0).toUpperCase()}</Text></View>
                      <View style={TeacherStyle.info}>
                        <Text style={TeacherStyle.name}>{item.user?.name}</Text>
                        <Text style={TeacherStyle.details}>RM: {item.enrollment}</Text>
                        {currentGrade && (
                          <Text style={{ fontSize: 12, color: isApproved ? '#007AFF' : '#FF3B30', fontWeight: 'bold', marginTop: 4 }}>
                            Média Atual: {Number(currentGrade.average).toFixed(1)} ({currentGrade.situation})
                          </Text>
                        )}
                      </View>
                      <Ionicons name="pencil" size={18} color="#007AFF" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}

          {currentStep === 'grade' && (
            <ScrollView contentContainerStyle={TeacherStyle.scroll} keyboardShouldPersistTaps="handled">
              
              <View style={[TeacherStyle.formCard, { marginTop: 16 }]}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 2 }}>
                  {selectedStudent?.user?.name}
                </Text>
                <Text style={{ fontSize: 13, color: '#8E8E93', marginBottom: 12 }}>
                  Matéria: {selectedSubject?.name}
                </Text>

                {fetchedGradeData ? (
                  <View style={{ padding: 10, backgroundColor: '#F2F2F7', borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, color: '#1C1C1E' }}>
                      Média Atual no Sistema:{' '}
                      <Text 
                        style={{ 
                          fontWeight: 'bold', 
                          color: Number(fetchedGradeData.average) >= 6 ? '#007AFF' : '#FF3B30' 
                        }}
                      >
                        {Number(fetchedGradeData.average).toFixed(1)}
                      </Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>
                      Situação: {fetchedGradeData.situation}
                    </Text>
                  </View>
                ) : (
                  <View style={{ padding: 10, backgroundColor: '#F2F2F7', borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, color: '#8E8E93', fontStyle: 'italic' }}>
                      Nenhuma nota registrada para esta matéria.
                    </Text>
                  </View>
                )}
              </View>

              <View style={[TeacherStyle.formCard, { marginTop: 12 }]}>
                <Text style={TeacherStyle.label}>NOTA 1 (N1)</Text>
                <TextInput
                  style={TeacherStyle.input}
                  value={grade1}
                  onChangeText={(text) => handleGradeChange(text, setGrade1)}
                  keyboardType="numeric"
                  placeholder="Ex: 8.5"
                  placeholderTextColor="#C7C7CD"
                />

                <Text style={TeacherStyle.label}>NOTA 2 (N2) - OPCIONAL</Text>
                <TextInput
                  style={TeacherStyle.input}
                  value={grade2}
                  onChangeText={(text) => handleGradeChange(text, setGrade2)}
                  keyboardType="numeric"
                  placeholder="Ex: 7.0"
                  placeholderTextColor="#C7C7CD"
                />

                <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingTop: 12 }}>
                  <Text style={{ fontSize: 14, color: '#1C1C1E', fontWeight: '600' }}>
                    Média do Lançamento:{' '}
                    <Text style={{ color: liveGradeColor, fontWeight: 'bold' }}>
                      {liveAverage.toFixed(1)}
                    </Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={[TeacherStyle.saveBtn, { marginTop: 24 }]} onPress={handleSaveGrades}>
                <Text style={TeacherStyle.saveBtnText}>
                  {gradeId ? 'CONFIRMAR ALTERAÇÃO' : 'SALVAR NOTAS'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};