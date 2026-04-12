import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from '../components/MenuItem';

export const Dashboard = ({ navigation }: any) => {
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
                <Text style={styles.welcome}>Bem-vindo ao Scholar,</Text>
                <Text style={styles.userName}>Adson Filho</Text>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => navigation.replace('Login')}
                  style={styles.logoutCircle}
                  activeOpacity={0.7}
                >
                  <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                </TouchableOpacity>

                
              </View>
            </View>

            <Text style={styles.sectionTitle}>Módulos de Gestão</Text>

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

            <MenuItem 
              title="Disciplinas" 
              description="Organize as matérias do semestre, horários e quem será o professor responsável." 
              iconName="book-outline" 
              iconColor="#FF9500"
              onPress={() => navigation.navigate('Course')}
            />

            <MenuItem 
              title="Boletim" 
              description="Acompanhe notas e médias para conferir o desempenho e a situação final." 
              iconName="stats-chart-outline" 
              iconColor="#34C759"
              onPress={() => navigation.navigate('StudentReport')}
            />

          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  scrollContent: {
    paddingBottom: 40 
  },
  wrapper: { 
    width: '100%', 
    maxWidth: 600, 
    alignSelf: 'center', 
    paddingHorizontal: 20 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 40 : 20,
    marginBottom: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: { 
    fontSize: 16, 
    color: '#8E8E93', 
    fontWeight: '500' 
  },
  userName: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#1C1C1E',
    letterSpacing: -0.5
  },
  logoutCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
      web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer' }
    })
  },
  avatarPlaceholder: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  sectionTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#8E8E93', 
    textTransform: 'uppercase', 
    marginBottom: 15,
    marginLeft: 5 
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  version: { 
    fontSize: 12, 
    color: '#C7C7CC' 
  }
});