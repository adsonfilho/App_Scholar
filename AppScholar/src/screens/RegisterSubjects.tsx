import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseStyle } from '../styles/CourseStyle';
import { subjectService } from '../services/subjectService';

export const RegisterSubject = ({ navigation, route }: any) => {
  const { courseId } = route.params; 
  const [name, setName] = useState('');
  const [workload, setWorkload] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSubject = async () => {
    if (!name.trim() || !workload.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name,
        workload: Number(workload),
        courseId: Number(courseId) 
      };

      await subjectService.createSubject(payload);
      
      Alert.alert("Sucesso", "Matéria lançada com sucesso!");
      navigation.goBack(); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a disciplina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
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
              value={name} 
              onChangeText={setName} 
              placeholder="Ex: Banco de Dados Não Relacional"
              placeholderTextColor="#8E8E93"
              editable={!loading}
            />
            
            <Text style={CourseStyle.label}>CARGA HORÁRIA (EM HORAS)</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={workload} 
              onChangeText={setWorkload} 
              placeholder="Ex: 80"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          <TouchableOpacity 
            style={[CourseStyle.saveBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSaveSubject}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={CourseStyle.saveBtnText}>
              {loading ? "SALVANDO..." : "VINCULAR MATÉRIA AO CURSO"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};