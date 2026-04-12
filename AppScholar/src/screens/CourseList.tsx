import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseStyle } from '../styles/CourseStyle';
import { COURSE_INITIAL_STATE } from '../schemas/courseSchema';

export const CourseList = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState([
    { 
      id: '1', 
      nome: 'Desenvolvimento Mobile', 
      cargaHoraria: '80h', 
      semestre: '4º', 
      professor: 'André Olímpio', 
      curso: 'DSM' 
    },
    { 
      id: '2', 
      nome: 'Estatística Aplicada', 
      cargaHoraria: '40h', 
      semestre: '3º', 
      professor: 'Fabiana', 
      curso: 'DSM' 
    },
  ]);

  const filteredCourses = courses.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) || 
    c.curso.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: any) => {
    navigation.navigate('RegisterCourse', { 
      course: { ...COURSE_INITIAL_STATE, ...item } 
    });
  };

  const handleDelete = (id: string) => {
    Keyboard.dismiss();
    
    const performDelete = () => {
      setCourses(prev => prev.filter(c => c.id !== id));
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente excluir esta disciplina?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Excluir Disciplina",
        "Tem certeza que deseja remover esta disciplina do sistema?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive", 
            onPress: performDelete 
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      <View style={CourseStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle}>Disciplinas</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RegisterCourse')} 
          style={CourseStyle.headerAddBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={CourseStyle.headerContent}>
        <View style={CourseStyle.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput 
            style={CourseStyle.searchInput} 
            placeholder="Buscar por nome ou curso..." 
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

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={CourseStyle.list}
        renderItem={({ item }) => (
          <View style={CourseStyle.card}>
            <View style={CourseStyle.avatar}>
              <Ionicons name="journal-outline" size={22} color="#5856D6" />
            </View>
            
            <View style={CourseStyle.info}>
              <Text style={CourseStyle.name}>{item.nome}</Text>
              <Text style={CourseStyle.details}>Prof. {item.professor} • {item.cargaHoraria}</Text>
              <View style={CourseStyle.badge}>
                <Text style={CourseStyle.badgeText}>{item.curso} - {item.semestre} SEMESTRE</Text>
              </View>
            </View>

            <View style={CourseStyle.actions}>
              <TouchableOpacity 
                style={[CourseStyle.actionBtn, CourseStyle.editBtn]} 
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </TouchableOpacity>

              
              <TouchableOpacity 
                style={[CourseStyle.actionBtn, CourseStyle.deleteBtn]} 
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};