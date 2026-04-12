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

const CEP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

export const RegisterStudent = ({ navigation, route }: any) => {
  const editData = route.params?.student;
  
  const [form, setForm] = useState<IStudent>(editData || STUDENT_INITIAL_STATE);
  
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const handleCepBlur = async () => {
    const cleanedCep = form.cep.replace(/\D/g, '');
    if (cleanedCep.length === 8) {
      const address = await getAddressByCep(cleanedCep);
      
      if (address) {
        setForm(prev => ({
          ...prev,
          estado: address.uf,
          cidade: address.localidade,
          endereco: address.logradouro,
          bairro: address.bairro,
        }));
      } else {
        setMsgType('error');
        setMessage("CEP não encontrado.");
        setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
      }
    }
  };

  const handleSave = () => {
    const dataToValidate = {
      ...form,
      cep: form.cep.replace(/\D/g, ''),
      telefone: form.telefone.replace(/\D/g, '')
    };

    const result = studentSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      setMsgType('error');
      setMessage(result.error.issues[0].message);
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
              value={form.nome} 
              onChangeText={v => setForm({...form, nome: v})} 
              placeholder="Ex: Adson Ottoni" 
              placeholderTextColor="#C7C7CD"
            />
            
            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>MATRÍCULA</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.matricula} 
                  onChangeText={v => setForm({...form, matricula: v})} 
                  keyboardType="numeric" 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>CURSO</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.curso} 
                  onChangeText={v => setForm({...form, curso: v})} 
                />
              </View>
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
              value={form.telefone}
              onChangeText={(masked) => setForm({...form, telefone: masked})}
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
                  value={form.cep}
                  onChangeText={(masked) => setForm({...form, cep: masked})}
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
                  value={form.estado} 
                  onChangeText={v => setForm({...form, estado: v})} 
                  maxLength={2} 
                  autoCapitalize="characters" 
                />
              </View>
            </View>

            <Text style={RegisterStudentStyle.label}>CIDADE</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.cidade} 
              onChangeText={v => setForm({...form, cidade: v})} 
            />

            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 3, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>LOGRADOURO</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.endereco} 
                  onChangeText={v => setForm({...form, endereco: v})} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>Nº</Text>
                <TextInput 
                  style={RegisterStudentStyle.input} 
                  value={form.numero} 
                  onChangeText={v => setForm({...form, numero: v})} 
                  keyboardType="numeric"
                  placeholder="123"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
            </View>

            <Text style={RegisterStudentStyle.label}>BAIRRO</Text>
            <TextInput 
              style={RegisterStudentStyle.input} 
              value={form.bairro} 
              onChangeText={v => setForm({...form, bairro: v})} 
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