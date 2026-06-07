import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusMessage } from '../components/StatusMessage';
import { studentSchema, STUDENT_INITIAL_STATE, IStudent } from '../schemas/studentSchema';
import { RegisterStudentStyle } from '../styles/StudentStyle';
import { UI_SETTINGS } from '../config/config';
import { getAddressByCep } from '../services/cepService';
import { studentService } from '../services/StudentService';

const CEP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export const RegisterStudent = ({ navigation, route }: any) => {
  const editData = route.params?.student;
  
  const [form, setForm] = useState<IStudent>(editData || STUDENT_INITIAL_STATE);
  
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const handleCepBlur = async () => {
    const cleanedCep = form.zipCode.replace(/\D/g, '');
    if (cleanedCep.length === 8) {
      const address = await getAddressByCep(cleanedCep);
      
      if (address) {
        setForm((prev: any) => ({
          ...prev,
          state: address.uf,
          city: address.localidade,
          address: address.logradouro,
          neighborhood: address.bairro,
        }));
      } else {
        setMsgType('error');
        setMessage("CEP não encontrado.");
        setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      }
    }
  };

  const handleSave = async () => {
    const dataToValidate = {
      ...form,
      cep: form.zipCode.replace(/\D/g, ''),
      telefone: form.phone.replace(/\D/g, '')
    };

    const result = studentSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      setMsgType('error');
      setMessage(result.error.issues[0].message);
      setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      return;
    }

    const newStudent = await studentService.createStudent(dataToValidate);

    if (!newStudent) {
      setMsgType('error');
      setMessage("Erro ao salvar aluno. Tente novamente.");
      setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      return;
    }

    setMsgType('success');
    setMessage(editData ? "Alterações salvas!" : "Aluno cadastrado com sucesso!");
    
    setTimeout(() => { 
      setMessage(null); 
      navigation.goBack(); 
    }, UI_SETTINGS.LOAD_SIMULATION_TIME);
  };

  return (
    <SafeAreaView style={RegisterStudentStyle.container} edges={['top']}>

      <View style={RegisterStudentStyle.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={RegisterStudentStyle.backButton}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={RegisterStudentStyle.headerTitle}>
          {editData ? 'Editar Aluno' : 'Novo Aluno'}
        </Text>
        <View style={RegisterStudentStyle.headerSpacer} />
      </View>

      <StatusMessage message={message} type={msgType} onClose={() => setMessage(null)} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={RegisterStudentStyle.scroll} showsVerticalScrollIndicator={false}>
          
          <Text style={RegisterStudentStyle.sectionTitle}>Dados Acadêmicos</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>NOME COMPLETO</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.name} 
              onChangeText={v => setForm({...form, name: v})} 
              placeholder="Ex: Adson Ottoni" 
              placeholderTextColor="#C7C7CD"
            />
            
            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>MATRÍCULA</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.enrollment} 
                  onChangeText={v => setForm({...form, enrollment: v})} 
                  keyboardType="numeric" 
                />
              </View>
              {/* <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>CURSO</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.course} 
                  onChangeText={v => setForm({...form, course: v})} 
                />
              </View> */}
            </View>
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Contato</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>E-MAIL ACADÊMICO</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.email} 
              onChangeText={v => setForm({...form, email: v})} 
              autoCapitalize="none" 
              keyboardType="email-address"
            />
            
            <Text style={RegisterStudentStyle.label}>TELEFONE</Text>
            <MaskInput
              style={RegisterStudentStyle.input}
              value={form.phone}
              onChangeText={(masked) => setForm({...form, phone: masked})}
              mask={Masks.BRL_PHONE}
              keyboardType="numeric"
              placeholder="(00) 00000-0000"
              placeholderTextColor="#C7C7CD"
            />
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Endereço</Text>
          <View style={RegisterStudentStyle.card}>
            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 2, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>CEP</Text>
                <MaskInput
                  style={RegisterStudentStyle.input}
                  value={form.zipCode}
                  onChangeText={(masked) => setForm({...form, zipCode: masked})}
                  onBlur={handleCepBlur}
                  mask={CEP_MASK}
                  keyboardType="numeric"
                  placeholder="00000-000"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>UF</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.state} 
                  onChangeText={v => setForm({...form, state: v})} 
                  maxLength={2} 
                  autoCapitalize="characters" 
                />
              </View>
            </View>

            <Text style={RegisterStudentStyle.label}>CIDADE</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.city} 
              onChangeText={v => setForm({...form, city: v})} 
            />

            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 3, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>LOGRADOURO</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.address} 
                  onChangeText={v => setForm({...form, address: v})} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>Nº</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.number} 
                  onChangeText={v => setForm({...form, number: v})} 
                  keyboardType="numeric"
                  placeholder="123"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
            </View>

            <Text style={RegisterStudentStyle.label}>BAIRRO</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.neighborhood} 
              onChangeText={v => setForm({...form, neighborhood: v})} 
            />
          </View>

          <TouchableOpacity style={RegisterStudentStyle.saveBtn} onPress={handleSave}>
            <Text style={RegisterStudentStyle.saveBtnText}>
              {editData ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};