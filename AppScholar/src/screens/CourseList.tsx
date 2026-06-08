import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; 

import { CourseStyle } from '../styles/CourseStyle';
import { COURSE_INITIAL_STATE } from '../schemas/courseSchema';
import { courseService } from '../services/courseService'; 

export const CourseList = ({ navigation }: any) => {
  const isFocused = useIsFocused(); 
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const periodLabels: Record<string, string> = {
    MORNING: 'Matutino',
    AFTERNOON: 'Vespertino',
    EVENING: 'Noturno',
    FULL_TIME: 'Integral'
  };

  useEffect(() => {
    if (isFocused) {
      fetchCourses();
    }
  }, [isFocused]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os cursos do banco.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.acronym?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: any) => {
    navigation.navigate('RegisterCourse', { 
      course: { ...COURSE_INITIAL_STATE, ...item } 
    });
  };

  const handleDelete = (id: string) => {
    Keyboard.dismiss();
    
    const performDelete = async () => {
      try {
        await courseService.deleteCourse(id);
        setCourses(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        Alert.alert("Erro", "Não foi possível remover o curso.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente excluir este curso?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Excluir Curso",
        "Tem certeza que deseja remover este curso do sistema?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: performDelete }
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
        <Text style={CourseStyle.navTitle}>Cursos</Text>
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
            placeholder="Buscar por nome ou sigla..." 
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
          data={filteredCourses}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={CourseStyle.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>
              Nenhum curso encontrado.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={CourseStyle.card}
              onPress={() => navigation.navigate('CourseDetails', { course: item })}
              activeOpacity={0.8}
            >
              <View style={CourseStyle.avatar}>
                <Ionicons name="school-outline" size={22} color="#5856D6" />
              </View>
              
              <View style={CourseStyle.info}>
                <Text style={CourseStyle.name}>{item.name}</Text>
                <Text style={CourseStyle.details}>Sigla: {item.acronym}</Text>
                <View style={CourseStyle.badge}>
                  <Text style={CourseStyle.badgeText}>
                    TURNO: {periodLabels[item.coursePeriod]?.toUpperCase() || 'NÃO DEFINIDO'}
                  </Text>
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
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};