import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { studentService } from '../services/studentService';
import { TeacherStyle } from '../styles/TeacherStyle'; 

export const StudentListReport = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudents(); 
      
      const dataArray = response?.data ? response.data : response;
      
      if (Array.isArray(dataArray)) {
        setStudents(dataArray);
      } else {
        setStudents([]);
        console.warn("O retorno da API de estudantes não é um array válido:", response);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
      setStudents([]); 
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  const filteredStudents = (students || []).filter(s =>
    s?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s?.enrollment?.includes(search)
  );

  return (
    <SafeAreaView style={TeacherStyle.container} edges={['top']}>
      <View style={TeacherStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={TeacherStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={TeacherStyle.navTitle}>Boletins dos Alunos</Text>
        <View style={TeacherStyle.headerSpacer} />
      </View>

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={TeacherStyle.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>
              Nenhum aluno encontrado.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={TeacherStyle.card} 
              onPress={() => navigation.navigate('StudentReport', { userId: item.user?.id })}
            >
              <View style={TeacherStyle.avatar}>
                <Text style={TeacherStyle.avatarText}>
                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <View style={TeacherStyle.info}>
                <Text style={TeacherStyle.name}>{item.user?.name}</Text>
                <Text style={TeacherStyle.details}>RM: {item.enrollment}</Text>
                <View style={TeacherStyle.tag}>
                  <Text style={TeacherStyle.tagText}>{item.course?.acronym || 'Curso'}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CD" style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};