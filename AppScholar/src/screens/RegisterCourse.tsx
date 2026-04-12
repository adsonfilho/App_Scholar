import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseStyle } from '../styles/CourseStyle';
import { courseSchema, COURSE_INITIAL_STATE, ICourse } from '../schemas/courseSchema';
import { StatusMessage } from '../components/StatusMessage';
import { UI_SETTINGS } from '../config/config';

export const RegisterCourse = ({ navigation, route }: any) => {
  const editData = route.params?.course;
  const [form, setForm] = useState<ICourse>({ ...COURSE_INITIAL_STATE, ...editData });
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error'>('error');

  const handleSave = () => {
    const result = courseSchema.safeParse(form);

    if (!result.success) {
      setMsgType('error');
      setMessage(result.error.issues[0].message);
      setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      return;
    }

    setMsgType('success');
    setMessage(editData ? "Disciplina atualizada!" : "Disciplina cadastrada!");
    
    setTimeout(() => { 
      setMessage(null); 
      navigation.goBack(); 
    }, UI_SETTINGS.LOAD_SIMULATION_TIME);
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      <View style={CourseStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle}>{editData ? 'Editar Disciplina' : 'Nova Disciplina'}</Text>
        <View style={CourseStyle.headerSpacer} />
      </View>

      <StatusMessage message={message} type={msgType} onClose={() => setMessage(null)} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={CourseStyle.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={CourseStyle.sectionTitle}>Dados da Disciplina</Text>
          <View style={CourseStyle.formCard}>
            <Text style={CourseStyle.label}>NOME DA DISCIPLINA</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.nome} 
              onChangeText={v => setForm({...form, nome: v})} 
              placeholder="Ex: Estrutura de Dados"
              placeholderTextColor="#C7C7CD"
            />
            
            <Text style={CourseStyle.label}>CURSO</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.curso} 
              onChangeText={v => setForm({...form, curso: v})} 
              placeholder="Ex: DSM ou Gestão Empresarial"
              placeholderTextColor="#C7C7CD"
            />

            <View style={CourseStyle.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={CourseStyle.label}>CARGA HORÁRIA</Text>
                <TextInput 
                  style={CourseStyle.input} 
                  value={form.cargaHoraria} 
                  onChangeText={v => setForm({...form, cargaHoraria: v})} 
                  placeholder="Ex: 80h"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={CourseStyle.label}>SEMESTRE</Text>
                <TextInput 
                  style={CourseStyle.input} 
                  value={form.semestre} 
                  onChangeText={v => setForm({...form, semestre: v})} 
                  placeholder="Ex: 4º"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
            </View>
          </View>

          <Text style={CourseStyle.sectionTitle}>Responsável</Text>
          <View style={CourseStyle.formCard}>
            <Text style={CourseStyle.label}>PROFESSOR TITULAR</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.professor} 
              onChangeText={v => setForm({...form, professor: v})} 
              placeholder="Nome do professor"
              placeholderTextColor="#C7C7CD"
            />
          </View>

          <TouchableOpacity 
            style={CourseStyle.saveBtn} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={CourseStyle.saveBtnText}>
              {editData ? "CONFIRMAR ALTERAÇÕES" : "SALVAR DISCIPLINA"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};