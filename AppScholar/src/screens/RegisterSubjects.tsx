import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseStyle } from '../styles/CourseStyle';
import { subjectService } from '../services/subjectService';
import { professorService } from '../services/professorService'; 
import { subjectSchema, SUBJECT_INITIAL_STATE } from '../schemas/subjectSchema';
import { useStatus } from '../hooks/useStatus'; 
import { StatusMessage } from '../components/StatusMessage'; 

export const RegisterSubject = ({ navigation, route }: any) => {
  const { courseId } = route.params; 
  const [form, setForm] = useState(SUBJECT_INITIAL_STATE);
  const [professors, setProfessors] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [loadingProfessors, setLoadingProfessors] = useState(true);
  
  const [semesterModalVisible, setSemesterModalVisible] = useState(false);
  const [professorModalVisible, setProfessorModalVisible] = useState(false);

  const { status, showStatus, hideStatus } = useStatus(); 

  const semestersOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const data = await professorService.getProfessors(); 
        setProfessors(data);
      } catch (error) {
        showStatus("Não foi possível carregar a lista de professores.", "error");
      } finally {
        setLoadingProfessors(false);
      }
    };
    fetchProfessors();
  }, []);

  const selectedProfessorName = professors.find(p => p.id === form.professorId)?.user?.name;

  const handleSaveSubject = async () => {
    if (loading) return;
    hideStatus(); 

    const result = subjectSchema.safeParse({
      ...form,
      courseId: Number(courseId)
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      showStatus(firstError, 'error'); 
      return;
    }

    try {
      setLoading(true);
      await subjectService.createSubject(result.data);
      
      showStatus("Matéria lançada com sucesso!", "success"); 
      
      setTimeout(() => {
        navigation.goBack(); 
      }, 1500);

    } catch (error: any) {
      const apiMessage = error.response?.data?.message || "Não foi possível cadastrar a disciplina.";
      showStatus(apiMessage, "error"); // 🌟 Erro da API no StatusMessage
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

      <View style={CourseStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn} disabled={loading}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle}>Lançar Matéria</Text>
        <View style={CourseStyle.headerSpacer} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={CourseStyle.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={CourseStyle.sectionTitle}>Nova Disciplina</Text>
          <View style={CourseStyle.formCard}>
            <Text style={CourseStyle.label}>NOME DA MATÉRIA</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.name} 
              onChangeText={v => setForm({...form, name: v})} 
              placeholder="Ex: Estatística Aplicada"
              placeholderTextColor="#8E8E93"
              editable={!loading}
            />
            
            <Text style={CourseStyle.label}>CARGA HORÁRIA (EM HORAS)</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={typeof form.workload === 'string' && form.workload === '' ? '' : String(form.workload)} 
              onChangeText={v => setForm({...form, workload: v === '' ? ('' as any) : Number(v)})} 
              placeholder="Ex: 40"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              editable={!loading}
            />

            <Text style={CourseStyle.label}>SEMESTRE DA DISCIPLINA</Text>
            <TouchableOpacity 
              style={CourseStyle.customSelect} 
              onPress={() => !loading && setSemesterModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={CourseStyle.selectText}>
                {form.semester ? `${form.semester}º Semestre` : "Selecione o semestre letivo..."}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#8E8E93" />
            </TouchableOpacity>

            <Text style={CourseStyle.label}>PROFESSOR RESPONSÁVEL</Text>
            <TouchableOpacity 
              style={CourseStyle.customSelect} 
              onPress={() => !loading && !loadingProfessors && setProfessorModalVisible(true)}
              activeOpacity={0.7}
              disabled={loadingProfessors}
            >
              {loadingProfessors ? (
                <ActivityIndicator size="small" color="#5856D6" style={{ alignSelf: 'flex-start' }} />
              ) : (
                <Text style={CourseStyle.selectText}>
                  {selectedProfessorName || "Selecione o professor titular..."}
                </Text>
              )}
              <Ionicons name="chevron-down" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[CourseStyle.saveBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSaveSubject}
            activeOpacity={0.8}
            disabled={loading || loadingProfessors}
          >
            <Text style={CourseStyle.saveBtnText}>
              {loading ? "SALVANDO..." : "VINCULAR MATÉRIA AO CURSO"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="slide" transparent={true} visible={semesterModalVisible} onRequestClose={() => setSemesterModalVisible(false)}>
        <View style={CourseStyle.modalOverlay}>
          <View style={CourseStyle.modalContent}>
            <Text style={CourseStyle.modalTitle}>Selecione o Semestre</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {semestersOptions.map((sem) => (
                <TouchableOpacity
                  key={sem}
                  style={CourseStyle.modalOption}
                  onPress={() => {
                    setForm({ ...form, semester: sem });
                    setSemesterModalVisible(false);
                  }}
                >
                  <Text style={CourseStyle.modalOptionText}>{sem}º Semestre</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[CourseStyle.modalOption, CourseStyle.modalCancel]} onPress={() => setSemesterModalVisible(false)}>
                <Text style={[CourseStyle.modalOptionText, { color: '#FF3B30' }]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={professorModalVisible} onRequestClose={() => setProfessorModalVisible(false)}>
        <View style={CourseStyle.modalOverlay}>
          <View style={CourseStyle.modalContent}>
            <Text style={CourseStyle.modalTitle}>Selecione o Professor</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {professors.map((professor) => (
                <TouchableOpacity
                  key={professor.id}
                  style={CourseStyle.modalOption}
                  onPress={() => {
                    setForm({ ...form, professorId: Number(professor.id) });
                    setProfessorModalVisible(false);
                  }}
                >
                  <Text style={CourseStyle.modalOptionText}>{professor.user?.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[CourseStyle.modalOption, CourseStyle.modalCancel]} onPress={() => setProfessorModalVisible(false)}>
                <Text style={[CourseStyle.modalOptionText, { color: '#FF3B30' }]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};