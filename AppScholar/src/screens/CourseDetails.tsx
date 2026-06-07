import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import { CourseStyle } from '../styles/CourseStyle';
import { subjectService } from '../services/subjectService'; 

export const CourseDetails = ({ navigation, route }: any) => {
  const { course } = route.params; 
  const isFocused = useIsFocused();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const periodLabels: Record<string, string> = {
    MORNING: 'Matutino',
    AFTERNOON: 'Vespertino',
    EVENING: 'Noturno',
    FULL_TIME: 'Integral'
  };

  useEffect(() => {
    if (isFocused) {
      fetchSubjects();
    }
  }, [isFocused]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getSubjectsByCourse(course.id);
      setSubjects(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as matérias deste curso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      <View style={CourseStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle} numberOfLines={1}>{course.acronym}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RegisterSubject', { courseId: course.id })} 
          style={CourseStyle.headerAddBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={CourseStyle.headerContent}>
        <Text style={[CourseStyle.name, { fontSize: 20 }]}>{course.name}</Text>
        <Text style={[CourseStyle.details, { marginTop: 4 }]}>
          Turno: {periodLabels[course.coursePeriod]}
        </Text>
      </View>

      <Text style={[CourseStyle.sectionTitle, { marginHorizontal: 20, marginTop: 20 }]}>
        Disciplinas / Matérias do Curso
      </Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#5856D6" />
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={CourseStyle.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 40 }}>
              Nenhuma matéria lançada para este curso ainda.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={CourseStyle.card}>
              <View style={CourseStyle.avatar}>
                <Ionicons name="journal-outline" size={22} color="#5856D6" />
              </View>
              <View style={CourseStyle.info}>
                <Text style={CourseStyle.name}>{item.name}</Text>
                <Text style={CourseStyle.details}>Carga Horária: {item.workload}h</Text>
                <Text style={CourseStyle.details}>Professor ID/Nome: {item.professorId || 'Sem professor'}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};