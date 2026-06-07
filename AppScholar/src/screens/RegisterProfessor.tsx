import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeacherStyle } from '../styles/TeacherStyle';
import { professorSchema, IProfessor, TEACHER_INITIAL_STATE } from '../schemas/professorSchema';
import { StatusMessage } from '../components/StatusMessage';
import { UI_SETTINGS } from '../config/config';
import { professorService } from '../services/professorService';

export const RegisterTeacher = ({ navigation, route }: any) => {
  const editData = route.params?.teacher;
  const [form, setForm] = useState<IProfessor>(editData || TEACHER_INITIAL_STATE);
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const handleSave = async () => {
    const result = professorSchema.safeParse(form);
    
    if (!result.success) {
        setMsgType('error');
        setMessage(result.error.issues[0].message);
        setTimeout(() => { setMessage(null);}, UI_SETTINGS.STATUS_DURATION)
        return;
    }

    if (editData) {
      const updatedProfessor = await professorService.updateProfessor(editData.id, result.data);
      if (!updatedProfessor) {
        setMsgType('error');
        setMessage("Erro ao salvar alterações. Tente novamente.");
        setTimeout(() => { setMessage(null);}, UI_SETTINGS.STATUS_DURATION)
        return;
      }
      setMsgType('success');
      setMessage("Alterações salvas!");
      setTimeout(() => { setMessage(null); navigation.goBack(); }, UI_SETTINGS.LOAD_SIMULATION_TIME);
      return;
    }

    const newProfessor = await professorService.createProfessor(result.data);

    if (!newProfessor) {
      setMsgType('error');
      setMessage("Erro ao salvar professor. Tente novamente.");
      setTimeout(() => { setMessage(null);}, UI_SETTINGS.STATUS_DURATION)
      return;
    }

    setMsgType('success');
    setMessage(editData ? "Alterações salvas!" : "Professor cadastrado com sucesso!");
    
    setTimeout(() => { 
      setMessage(null); 
      navigation.goBack(); 
    }, UI_SETTINGS.LOAD_SIMULATION_TIME);
  };

  return (
    <SafeAreaView style={TeacherStyle.container} edges={['top']}>
      <View style={TeacherStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={TeacherStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={TeacherStyle.navTitle}>{editData ? 'Editar Professor' : 'Novo Professor'}</Text>
        <View style={TeacherStyle.headerSpacer} />
      </View>

      <StatusMessage message={message} type={msgType} onClose={() => setMessage(null)} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={TeacherStyle.scroll}
          showsVerticalScrollIndicator={false}
        >
          
          <Text style={TeacherStyle.sectionTitle}>Identificação e Experiência</Text>
          <View style={TeacherStyle.formCard}>
            <Text style={TeacherStyle.label}>NOME COMPLETO</Text>
            <TextInput 
              style={TeacherStyle.input} 
              value={form.name} 
              onChangeText={v => setForm({...form, name: v})} 
              placeholder="Ex: André Olímpio" 
              placeholderTextColor="#C7C7CD"
            />
            
            <View style={TeacherStyle.row}>
              <View style={{ flex: 2, marginRight: 10 }}>
                <Text style={TeacherStyle.label}>TITULAÇÃO</Text>
                <TextInput 
                  style={TeacherStyle.input} 
                  value={form.degreeId} 
                  onChangeText={v => setForm({...form, degreeId: v})} 
                  placeholder="Ex: Mestre"
                  placeholderTextColor="#C7C7CD"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={TeacherStyle.label}>TEMPO DE DOCENCIA (XP)</Text>
                <TextInput 
                  style={TeacherStyle.input} 
                  value={form.tempoDocencia?.toString()} 
                  onChangeText={v => setForm({...form, tempoDocencia: v})} 
                  keyboardType="numeric"
                  placeholder="Ex: 5"
                  placeholderTextColor="#C7C7CD"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          <Text style={TeacherStyle.sectionTitle}>Atuação</Text>
          <View style={TeacherStyle.formCard}>
            <Text style={TeacherStyle.label}>ÁREA DE ESPECIALIDADE</Text>
            <TextInput 
              style={TeacherStyle.input} 
              value={form.fieldId} 
              onChangeText={v => setForm({...form, fieldId: v})} 
              placeholder="Ex: Desenvolvimento Web" 
              placeholderTextColor="#C7C7CD"
            />
            
            <Text style={TeacherStyle.label}>E-MAIL INSTITUCIONAL</Text>
            <TextInput 
              style={TeacherStyle.input} 
              value={form.email} 
              onChangeText={v => setForm({...form, email: v})} 
              keyboardType="email-address"
              autoCapitalize="none" 
              placeholder="professor@fatec.sp.gov.br"
              placeholderTextColor="#C7C7CD"
            />
          </View>

          <TouchableOpacity 
            style={TeacherStyle.saveBtn} 
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={TeacherStyle.saveBtnText}>
              {editData ? "SALVAR ALTERAÇÕES" : "CADASTRAR PROFESSOR"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};