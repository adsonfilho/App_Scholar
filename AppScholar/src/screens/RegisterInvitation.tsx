import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Ícone para o seletor

import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';
import { invitationService } from '../services/invitationService';
import { courseService } from '../services/courseService';
import { invitationSchema } from '../schemas/invitationSchema';

import { RegisterInvitationStyle as styles } from '../styles/InvitationStyle';
import { LoginStyle } from '../styles/LoginStyle';
import { TitleStyle } from '../styles/TitleStyle';

export const RegisterInvitation = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'PROFESSOR'>('STUDENT');
  const [registration, setRegistration] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Controle do Select Customizado
  
  const { status, showStatus, hideStatus } = useStatus();

  useEffect(() => {
    courseService.getCourses()
      .then(setCourses)
      .catch(() => showStatus('Erro ao carregar cursos', 'error'))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    setRegistration(invitationService.generateRegistrationNumber());
  }, [role]);

  const handleSend = async () => {
    hideStatus();
    
    const data = { 
      email, 
      role, 
      enrollment: registration,
      courseId: role === 'STUDENT' ? (selectedCourse ? Number(selectedCourse.id) : null) : null
    };
    
    const result = invitationSchema.safeParse(data);

    if (!result.success) {
      showStatus(result.error.issues[0].message, 'error');
      return;
    }

    try {
      setLoading(true);
      await invitationService.createInvitation(result.data);
      showStatus('Convite enviado com sucesso!', 'success');
      
      setEmail('');
      setSelectedCourse(null);
      setRegistration(invitationService.generateRegistrationNumber());
    } catch (err: any) {
      showStatus(err.response?.data?.message || 'Erro no servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusMessage message={status?.msg || null} type={status?.type} onClose={hideStatus} />

        <View style={styles.wrapper}>
          <Text style={TitleStyle.h1}>Novo <Text style={TitleStyle.highlight}>Convite</Text></Text>

          <Text style={styles.label}>E-mail do destinatário</Text>
          <TextInput
            style={[LoginStyle.input, { color: '#1C1C1E' }]}
            placeholder="Digite o e-mail (ex: nome@escola.com)"
            placeholderTextColor="#636366" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!loading}
          />

          <Text style={styles.label}>Perfil de acesso</Text>
          <View style={styles.selectorContainer}>
            <TouchableOpacity 
              style={[styles.selectorButton, role === 'STUDENT' && styles.selectorActive]}
              onPress={() => setRole('STUDENT')}
              disabled={loading}
            >
              <Text style={[styles.selectorText, role === 'STUDENT' && styles.selectorTextActive]}>Aluno</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.selectorButton, role === 'PROFESSOR' && styles.selectorActive]}
              onPress={() => setRole('PROFESSOR')}
              disabled={loading}
            >
              <Text style={[styles.selectorText, role === 'PROFESSOR' && styles.selectorTextActive]}>Professor</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Matrícula Gerada ({role === 'STUDENT' ? 'Aluno' : 'Professor'})</Text>
          <TextInput
            style={[LoginStyle.input, { backgroundColor: '#E5E5EA', color: '#3A3A3C', fontWeight: 'bold' }]}
            value={registration}
            editable={false} 
          />


          {role === 'STUDENT' && (
            <>
              <Text style={styles.label}>Curso de destino</Text>
              <TouchableOpacity 
                style={styles.customSelectButton} 
                onPress={() => !loading && !loadingCourses && setModalVisible(true)}
                activeOpacity={0.7}
              >
                {loadingCourses ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <Text style={selectedCourse ? styles.selectButtonText : styles.placeholderText}>
                    {selectedCourse ? selectedCourse.name : "Clique para selecionar o curso..."}
                  </Text>
                )}
                <Ionicons name="chevron-down" size={18} color="#636366" />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.buttonContainer}>
            {loading ? <ActivityIndicator color="#007AFF" /> : <Button title="Enviar Convite" onPress={handleSend} />}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={loading}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione o Curso</Text>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                {courses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={styles.courseOption}
                    onPress={() => {
                      setSelectedCourse(course);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.courseOptionText}>{course.name}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.courseOption, styles.cancelOption]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.courseOptionText, styles.cancelOptionText]}>Cancelar</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};