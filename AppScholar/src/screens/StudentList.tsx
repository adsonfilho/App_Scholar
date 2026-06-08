import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; 

import { StudentListStyle } from '../styles/StudentStyle';
import { STUDENT_INITIAL_STATE } from '../schemas/studentSchema';
import { studentService } from '../services/studentService'; 
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';

export const StudentList = ({ navigation }: any) => {
  const isFocused = useIsFocused(); 
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const { status, showStatus, hideStatus } = useStatus();

  useEffect(() => {
    if (isFocused) {
      fetchStudents();
    }
  }, [isFocused]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents(); 
      setStudents(data);
    } catch (error) {
      showStatus("Não foi possível carregar a lista de alunos do banco.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const nomeAluno = s.user?.name || s.nome || '';
    const matriculaAluno = s.registration || s.matricula || '';
    
    return (
      nomeAluno.toLowerCase().includes(search.toLowerCase()) || 
      matriculaAluno.toString().includes(search)
    );
  });

  const handleDelete = (id: string) => {
    Keyboard.dismiss();
    hideStatus();
    
    const performDelete = async () => {
      try {
        await studentService.deleteStudent(Number(id)); 
        showStatus("Aluno removido com sucesso!", "success");
        await fetchStudents();
      } catch (error) {
        showStatus("Não foi possível remover o aluno.", "error");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente remover este aluno?")) {
        performDelete();
      }
    } else {
      Alert.alert("Excluir", "Deseja remover este aluno?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: performDelete }
      ]);
    }
  };

  return (
    <SafeAreaView style={StudentListStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

      <View style={StudentListStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={StudentListStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={StudentListStyle.navTitle}>Gerenciar Alunos</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RegisterStudent')} 
          style={StudentListStyle.headerAddBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={StudentListStyle.headerContent}>
        <View style={StudentListStyle.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput 
            style={StudentListStyle.searchInput} 
            placeholder="Pesquisar nome ou RA..." 
            value={search} 
            onChangeText={setSearch} 
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#5856D6" />
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={StudentListStyle.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>
              Nenhum aluno encontrado.
            </Text>
          }
          renderItem={({ item }) => {
            const displayNome = item.user?.name || 'Sem Nome';
            const displayMatricula = item.enrollment || 'N/A';
            const displayCurso = item.course?.acronym || 'N/A';

            return (
              <View style={StudentListStyle.card}>
                <View style={StudentListStyle.avatar}>
                  <Text style={StudentListStyle.avatarText}>
                    {displayNome.charAt(0).toUpperCase()}
                  </Text>
                </View>
                
                <View style={StudentListStyle.info}>
                  <Text style={StudentListStyle.name}>{displayNome}</Text>
                  <Text style={StudentListStyle.details}>
                    RA: {displayMatricula} • {displayCurso}
                  </Text>
                </View>
                
                <View style={StudentListStyle.actions}>
                  <TouchableOpacity 
                    style={[StudentListStyle.actionBtn, StudentListStyle.editBtn]}
                    onPress={() => navigation.navigate('RegisterStudent', { student: { ...STUDENT_INITIAL_STATE, ...item, 
                      name: item.user?.name || item.name || '', 
                      email: item.user?.email || item.email || '',
                      nome: item.user?.name || item.nome || '',
                      id: item.id,} 
                    })}
                  >
                    <Ionicons name="pencil" size={18} color="#007AFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[StudentListStyle.actionBtn, StudentListStyle.deleteBtn]}
                    onPress={() => handleDelete(item.userId)}
                  >
                    <Ionicons name="trash" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};