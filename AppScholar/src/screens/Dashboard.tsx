import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../components/MenuItem';
import { useAuth } from '../contexts/AuthContext'; 
import {studentService} from '../services/studentService';
import {professorService} from '../services/professorService';

export const Dashboard = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false); 

  const handleLogout = () => {
    logout();
  };

  const handleMyDataPress = async () => {
    if (!user?.id) return;

    setLoadingProfile(true);
    try {
      if (user.role === 'STUDENT') {

        const id = user.id;
        const response = await studentService.getStudentById(id);

        navigation.navigate('RegisterStudent', {
          student: {
            user: { id: response.id },
            id: response.id,
            name: response.user?.name || response.name || '',
            email: response.user?.email || response.email || '',
            nome: response.user?.name || response.nome || '',
            password: '',
            enrollment: response.student.enrollment || '',
            phone: response.student.phone || '',
            zipCode: response.student.zipCode || '',
            address: response.student.address || '',
            city: response.student.city || '',
            state: response.student.state || '',
            neighborhood: response.student.neighborhood || '',
            number: response.student.number || '',
          }
        });

      } else if (user.role === 'PROFESSOR') {
        const response = await professorService.getProfessors();  
        const professor = response.find((p: any) => p.userId === user.id);
        const teacherData = professor;

        navigation.navigate('RegisterTeacher', { 
          teacher: teacherData 
        });
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os seus dados cadastrais.');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.wrapper}>
            
            <View style={styles.header}>
              <View>
                <Text style={styles.welcome}>
                  Bem-vindo ao Scholar, <Text style={styles.roleText}>[{user?.role}]</Text>
                </Text>
                <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={handleLogout}
                  style={styles.logoutCircle}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Módulos de Gestão</Text>

            {(user?.role === 'STUDENT' || user?.role === 'PROFESSOR') && (
              <View style={{ position: 'relative' }}>
                <MenuItem 
                  title="Meus Dados" 
                  description="Visualize e atualize suas informações de cadastro e dados pessoais." 
                  iconName="person-circle-outline" 
                  iconColor="#007AFF"
                  onPress={handleMyDataPress}
                />
                {loadingProfile && (
                  <ActivityIndicator 
                    size="small" 
                    color="#007AFF" 
                    style={{ position: 'absolute', right: 20, top: '40%' }} 
                  />
                )}
              </View>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <MenuItem 
                  title="Alunos" 
                  description="Cadastre novos alunos" 
                  iconName="person-add-outline" 
                  iconColor="#007AFF"
                  onPress={() => navigation.navigate('Student')}
                />

                <MenuItem 
                  title="Professores" 
                  description="Gerencie a equipe docente, suas formações acadêmicas e áreas de atuação." 
                  iconName="briefcase-outline" 
                  iconColor="#5856D6"
                  onPress={() => navigation.navigate('Teacher')}
                />
              </>
            )}

            {user?.role !== 'STUDENT' && (
              <MenuItem 
                title="Disciplinas" 
                description="Organize as matérias do semestre, horários e quem será o professor responsável." 
                iconName="book-outline" 
                iconColor="#FF9500"
                onPress={() => navigation.navigate('Course')}
              />
            )}

            {user?.role === 'PROFESSOR' && (
              <MenuItem 
                title="Lançar Notas" 
                description="Selecione uma disciplina e gerencie as notas dos alunos." 
                iconName="pencil-sharp" 
                iconColor="#AF52DE"
                onPress={() => navigation.navigate('TeacherGrades')}
              />
            )}

            {user?.role === 'ADMIN' && (
              <MenuItem 
                title="Gerar Convites" 
                description="Crie e envie convites de acesso para novos alunos ou professores do sistema." 
                iconName="mail-open-outline" 
                iconColor="#5AC8FA"
                onPress={() => navigation.navigate('RegisterInvitation')}
              />
            )}

            <MenuItem 
              title="Boletim" 
              description="Acompanhe notas e médias para conferir o desempenho e a situação final." 
              iconName="stats-chart-outline" 
              iconColor="#34C759"
              onPress={() => {
                if (user?.role === 'STUDENT') {
                  navigation.navigate('StudentReport');
                } else {
                  navigation.navigate('StudentListReport');
                }
              }}
            />

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { paddingBottom: 40 },
  wrapper: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'web' ? 40 : 20, marginBottom: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  welcome: { fontSize: 16, color: '#8E8E93', fontWeight: '500' },
  roleText: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  userName: { fontSize: 32, fontWeight: '800', color: '#1C1C1E', letterSpacing: -0.5 },
  logoutCircle: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer' }
    })
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 15, marginLeft: 5 }
});