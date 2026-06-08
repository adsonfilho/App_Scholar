import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; 

import { CourseStyle } from '../styles/CourseStyle';
import { COURSE_INITIAL_STATE } from '../schemas/courseSchema';
import { courseService } from '../services/courseService'; 
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';
import { useAuth } from '../contexts/AuthContext'; 
import { professorService } from '../services/professorService';

export const CourseList = ({ navigation }: any) => {
  const isFocused = useIsFocused(); 
  const { user } = useAuth(); 
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status, showStatus, hideStatus } = useStatus();

  const periodLabels: Record<string, string> = {
    MORNING: 'Matutino',
    AFTERNOON: 'Vespertino',
    EVENNING: 'Noturno',
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

      if (user?.role === 'PROFESSOR') {
        const professorData = await professorService.getSubjectsByProfessor(user.id); 
        const teacherSubjects = professorData.subjects || [];

        const teacherCourses = data.filter((course: any) => 
          teacherSubjects.some((subject: any) => subject.courseId === course.id)
        );
        setCourses(teacherCourses);
      } else {
        setCourses(data);
      }

    } catch (error) {
      showStatus("Não foi possível carregar os cursos do banco.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.acronym?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: any) => {
    hideStatus();
    navigation.navigate('RegisterCourse', { 
      course: { ...COURSE_INITIAL_STATE, ...item } 
    });
  };

  const handleDelete = (id: number) => {
    Keyboard.dismiss();
    hideStatus();
    
    const performDelete = async () => {
      try {
        await courseService.deleteCourse(id);
        setCourses(prev => prev.filter(c => c.id !== id));
        showStatus("Curso removido com sucesso.", "success");
      } catch (error) {
        showStatus("Não foi possível remover o curso.", "error");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente excluir este curso?")) {
        performDelete();
      }
    } else {
      showStatus("Confirme a exclusão no alerta do sistema.", undefined);
      import('react-native').then(({ Alert }) => {
        Alert.alert(
          "Excluir Curso",
          "Tem certeza que deseja remover este curso do sistema?",
          [
            { text: "Cancelar", style: "cancel", onPress: hideStatus },
            { text: "Excluir", style: "destructive", onPress: performDelete }
          ]
        );
      });
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle}>Cursos</Text>
        
        {user?.role === 'ADMIN' && (
          <TouchableOpacity 
            onPress={() => {
              hideStatus();
              navigation.navigate('RegisterCourse');
            }} 
            style={CourseStyle.headerAddBtn}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        )}
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
              onPress={() => {
                hideStatus();
                navigation.navigate('CourseDetails', { course: item });
              }}
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

              {user?.role === 'ADMIN' && (
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
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};