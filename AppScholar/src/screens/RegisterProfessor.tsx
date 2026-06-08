import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeacherStyle } from '../styles/TeacherStyle';
import { professorSchema, IProfessor, TEACHER_INITIAL_STATE } from '../schemas/professorSchema';
import { StatusMessage } from '../components/StatusMessage';
import { UI_SETTINGS } from '../config/config';
import { professorService } from '../services/professorService';
import api from '../services/apiService';

interface IOption {
  id: number;
  name: string;
  active: boolean;
}



export const RegisterTeacher = ({ navigation, route }: any) => {
  const editData = route.params?.teacher;

  const [form, setForm] = useState<IProfessor>(() => {
    if (editData) {
      return {
        ...TEACHER_INITIAL_STATE,
        ...editData,
        name: editData.user?.name || '',
        email: editData.user?.email || '',
        password: '', 
      };
    }
    return TEACHER_INITIAL_STATE;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const [degrees, setDegrees] = useState<IOption[]>([]);
  const [fields, setFields] = useState<IOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [selectedDegree, setSelectedDegree] = useState<IOption | null>(null);
  const [selectedField, setSelectedField] = useState<IOption | null>(null);
  const [degreeModalVisible, setDegreeModalVisible] = useState(false);
  const [fieldModalVisible, setFieldModalVisible] = useState(false);

  const showMsg = (msg: string, type: 'success' | 'error' | 'warning') => {
    setMsgType(type);
    setMessage(msg);
    setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [degreesRes, fieldsRes] = await Promise.all([
          api.get('/degrees'),
          api.get('/fields'),
        ]);
        setDegrees(degreesRes.data.filter((d: IOption) => d.active));
        setFields(fieldsRes.data.filter((f: IOption) => f.active));

        if (editData) {
          const deg = degreesRes.data.find((d: IOption) => d.id === editData.degreeId);
          const fld = fieldsRes.data.find((f: IOption) => f.id === editData.fieldId);
          if (deg) setSelectedDegree(deg);
          if (fld) setSelectedField(fld);
        }
      } catch (error) {
        showMsg('Erro ao carregar opções. Tente novamente.', 'error');
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const handleSave = async () => {
    const dataToValidate = {
      ...form,
      role: 'PROFESSOR' as const,
      degreeId: Number(selectedDegree?.id ?? 0),
      fieldId: Number(selectedField?.id ?? 0),
      teachingExperience: Number(form.teachingExperience)
    };

    if (editData && !dataToValidate.password) {
      delete (dataToValidate as any).password;
    }

    const result = professorSchema.safeParse(dataToValidate);

    if (!result.success) {
      showMsg(result.error.issues[0].message, 'error');
      return;
    }

    try {
      if (editData) {
        await professorService.updateProfessor(editData.userId, result.data);
        showMsg('Alterações salvas!', 'success');
      } else {
        await professorService.createProfessor(result.data);
        showMsg('Professor cadastrado com sucesso!', 'success');
      }
      setTimeout(() => { setMessage(null); navigation.goBack(); }, UI_SETTINGS.LOAD_SIMULATION_TIME);
    } catch (error: any) {
      showMsg(error?.response?.data?.message || error?.message || 'Erro ao salvar professor.', 'error');
    }
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
        <ScrollView contentContainerStyle={TeacherStyle.scroll} showsVerticalScrollIndicator={false}>

          <Text style={TeacherStyle.sectionTitle}>Identificação</Text>
          <View style={TeacherStyle.formCard}>
            <Text style={TeacherStyle.label}>NOME COMPLETO</Text>
            <TextInput
              style={TeacherStyle.input}
              value={form.name}
              onChangeText={v => setForm({ ...form, name: v })}
              placeholder="Ex: André Olímpio"
              placeholderTextColor="#C7C7CD"
            />

            {!editData && (
              <>
                <Text style={TeacherStyle.label}>MATRÍCULA / INVITATION CODE</Text>
                <TextInput
                  style={TeacherStyle.input}
                  value={form.enrollment}
                  onChangeText={v => setForm({ ...form, enrollment: v })}
                  keyboardType="numeric"
                  placeholder="Ex: 1234567"
                  placeholderTextColor="#C7C7CD"
                />
              </>
            )}
          </View>

          <Text style={TeacherStyle.sectionTitle}>Acesso</Text>
          <View style={TeacherStyle.formCard}>
            <Text style={TeacherStyle.label}>E-MAIL INSTITUCIONAL</Text>
            <TextInput
              style={[TeacherStyle.input, editData && { backgroundColor: '#F2F2F7', color: '#8E8E93' }]}
              value={form.email}
              onChangeText={v => setForm({ ...form, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="professor@fatec.sp.gov.br"
              placeholderTextColor="#C7C7CD"
              editable={!editData}
            />

            <Text style={TeacherStyle.label}>SENHA</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={TeacherStyle.input}
                value={form.password}
                onChangeText={v => setForm({ ...form, password: v })}
                secureTextEntry={!showPassword}
                placeholder={editData ? "Preencha apenas se quiser alterar" : "Mínimo 6 caracteres"}
                placeholderTextColor="#C7C7CD"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(p => !p)}
                style={{ position: 'absolute', right: 12, top: 12 }}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={TeacherStyle.sectionTitle}>Experiência</Text>
          <View style={TeacherStyle.formCard}>

            {loadingOptions ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 16 }} />
            ) : (
              <>
                <Text style={TeacherStyle.label}>TITULAÇÃO</Text>
                <TouchableOpacity
                  style={TeacherStyle.customSelectButton}
                  onPress={() => setDegreeModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={selectedDegree ? TeacherStyle.selectButtonText : TeacherStyle.placeholderText}>
                    {selectedDegree ? selectedDegree.name : 'Selecione a titulação...'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#636366" />
                </TouchableOpacity>

                <Text style={TeacherStyle.label}>ÁREA DE ATUAÇÃO</Text>
                <TouchableOpacity
                  style={TeacherStyle.customSelectButton}
                  onPress={() => setFieldModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={selectedField ? TeacherStyle.selectButtonText : TeacherStyle.placeholderText}>
                    {selectedField ? selectedField.name : 'Selecione a área...'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#636366" />
                </TouchableOpacity>
              </>
            )}

            <Text style={TeacherStyle.label}>Tempo de Experiência Docente (meses)</Text>
            <TextInput
              style={TeacherStyle.input}
              value={String(form.teachingExperience ?? '')}
              onChangeText={v => setForm({ ...form, teachingExperience: v === '' ? 0 : Number(v) as any })}
              keyboardType="numeric"
              placeholder="Ex: 5"
              placeholderTextColor="#C7C7CD"
              maxLength={2}
            />
          </View>

          <TouchableOpacity style={TeacherStyle.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={TeacherStyle.saveBtnText}>
              {editData ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PROFESSOR'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="slide" transparent visible={degreeModalVisible} onRequestClose={() => setDegreeModalVisible(false)}>
        <View style={TeacherStyle.modalOverlay}>
          <View style={TeacherStyle.modalContent}>
            <Text style={TeacherStyle.modalTitle}>Selecione a Titulação</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {degrees.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={TeacherStyle.modalOption}
                  onPress={() => { setSelectedDegree(d); setDegreeModalVisible(false); }}
                >
                  <Text style={TeacherStyle.modalOptionText}>{d.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[TeacherStyle.modalOption, TeacherStyle.cancelOption]}
                onPress={() => setDegreeModalVisible(false)}
              >
                <Text style={[TeacherStyle.modalOptionText, TeacherStyle.cancelOptionText]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={fieldModalVisible} onRequestClose={() => setFieldModalVisible(false)}>
        <View style={TeacherStyle.modalOverlay}>
          <View style={TeacherStyle.modalContent}>
            <Text style={TeacherStyle.modalTitle}>Selecione a Área</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {fields.map(f => (
                <TouchableOpacity
                  key={f.id}
                  style={TeacherStyle.modalOption}
                  onPress={() => { setSelectedField(f); setFieldModalVisible(false); }}
                >
                  <Text style={TeacherStyle.modalOptionText}>{f.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[TeacherStyle.modalOption, TeacherStyle.cancelOption]}
                onPress={() => setFieldModalVisible(false)}
              >
                <Text style={[TeacherStyle.modalOptionText, TeacherStyle.cancelOptionText]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};