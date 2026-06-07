import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseStyle } from '../styles/CourseStyle';
import { courseSchema, COURSE_INITIAL_STATE, ICourse } from '../schemas/courseSchema';
import { StatusMessage } from '../components/StatusMessage';
import { UI_SETTINGS } from '../config/config';
import { courseService } from '../services/courseService'; 

export const RegisterCourse = ({ navigation, route }: any) => {
  const editData = route.params?.course;
  const [form, setForm] = useState<ICourse>({ ...COURSE_INITIAL_STATE, ...editData });
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error'>('error');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const periodLabels: Record<string, string> = {
    MORNING: 'Matutino',
    AFTERNOON: 'Vespertino',
    EVENING: 'Noturno',
    FULL_TIME: 'Integral'
  };

  const handleSave = async () => {
    if (loading) return;

    const payload = { ...form, active: form.active ?? true };
    const result = courseSchema.safeParse(payload);

    if (!result.success) {
      setMsgType('error');
      setMessage(result.error.issues[0].message);
      setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      return;
    }

    try {
      setLoading(true);

      if (editData) {

        await courseService.updateCourse(form.id ?? 0 , result.data);
        setMsgType('success');
        setMessage("Curso atualizado!");
      } else {
        await courseService.createCourse(result.data);
        setMsgType('success');
        setMessage("Curso cadastrado com sucesso!");
      }
      
      setTimeout(() => { 
        setMessage(null); 
        navigation.goBack(); 
      }, UI_SETTINGS.LOAD_SIMULATION_TIME);

    } catch (err: any) {
      setMsgType('error');
      setMessage(err.response?.data?.message || 'Erro ao salvar curso no servidor');
      setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
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
        <Text style={CourseStyle.navTitle}>{editData ? 'Editar Curso' : 'Novo Curso'}</Text>
        <View style={CourseStyle.headerSpacer} />
      </View>

      <StatusMessage message={message} type={msgType} onClose={() => setMessage(null)} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={CourseStyle.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={CourseStyle.sectionTitle}>Dados do Curso</Text>
          <View style={CourseStyle.formCard}>
            <Text style={CourseStyle.label}>NOME DO CURSO</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.name} 
              onChangeText={v => setForm({...form, name: v})} 
              placeholder="Ex: Desenvolvimento de Software Multiplataforma"
              placeholderTextColor="#8E8E93"
              editable={!loading}
            />
            
            <Text style={CourseStyle.label}>SIGLA / ACRÔNIMO</Text>
            <TextInput 
              style={CourseStyle.input} 
              value={form.acronym} 
              onChangeText={v => setForm({...form, acronym: v})} 
              placeholder="Ex: DSM"
              placeholderTextColor="#8E8E93"
              autoCapitalize="characters"
              editable={!loading}
            />

            <Text style={CourseStyle.label}>PERÍODO / TURNO</Text>
            <TouchableOpacity 
              style={CourseStyle.customSelect} 
              onPress={() => !loading && setModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={CourseStyle.selectText}>
                {periodLabels[form.coursePeriod] || "Selecione o turno..."}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[CourseStyle.saveBtn, loading && { opacity: 0.7 }]} 
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={CourseStyle.saveBtnText}>
              {loading ? "PROCESSANDO..." : editData ? "CONFIRMAR ALTERAÇÕES" : "SALVAR CURSO"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={CourseStyle.modalOverlay}>
          <View style={CourseStyle.modalContent}>
            <Text style={CourseStyle.modalTitle}>Selecione o Turno</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {Object.keys(periodLabels).map((key) => (
                <TouchableOpacity
                  key={key}
                  style={CourseStyle.modalOption}
                  onPress={() => {
                    setForm({ ...form, coursePeriod: key as any });
                    setModalVisible(false);
                  }}
                >
                  <Text style={CourseStyle.modalOptionText}>{periodLabels[key]}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[CourseStyle.modalOption, CourseStyle.modalCancel]} onPress={() => setModalVisible(false)}>
                <Text style={[CourseStyle.modalOptionText, { color: '#FF3B30' }]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};