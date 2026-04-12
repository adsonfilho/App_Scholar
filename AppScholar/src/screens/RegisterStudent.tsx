import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusMessage } from '../components/StatusMessage';
import { studentSchema, STUDENT_INITIAL_STATE, IStudent } from '../schemas/forms';
import { RegisterStudentStyle } from '../styles/StudentStyle';

export const RegisterStudent = ({ navigation, route }: any) => {
  const editData = route.params?.student;
  const [form, setForm] = useState<IStudent>(editData || STUDENT_INITIAL_STATE);
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const handleSave = () => {
    const result = studentSchema.safeParse(form);
    if (!result.success) {
      setMsgType('error');
      setMessage(result.error.issues[0].message);
      return;
    }
    setMsgType('success');
    setMessage(editData ? "Alterações salvas!" : "Aluno cadastrado com sucesso!");
    setTimeout(() => { setMessage(null); navigation.goBack(); }, 2000);
  };

  return (
    <SafeAreaView style={RegisterStudentStyle.container} edges={['top']}>
      <View style={RegisterStudentStyle.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={RegisterStudentStyle.backButton}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={RegisterStudentStyle.headerTitle}>{editData ? 'Editar Aluno' : 'Novo Aluno'}</Text>
        <View style={RegisterStudentStyle.headerSpacer} />
      </View>

      <StatusMessage message={message} type={msgType} onClose={() => setMessage(null)} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={RegisterStudentStyle.scroll} showsVerticalScrollIndicator={false}>
          <Text style={RegisterStudentStyle.sectionTitle}>Dados Acadêmicos</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>NOME COMPLETO</Text>
            <TextInput style={RegisterStudentStyle.input} value={form.nome} onChangeText={v => setForm({...form, nome: v})} placeholder="Ex: Adson" />
            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>MATRÍCULA</Text>
                <TextInput style={RegisterStudentStyle.input} value={form.matricula} onChangeText={v => setForm({...form, matricula: v})} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>CURSO</Text>
                <TextInput style={RegisterStudentStyle.input} value={form.curso} onChangeText={v => setForm({...form, curso: v})} />
              </View>
            </View>
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Contato</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>E-MAIL ACADÊMICO</Text>
            <TextInput style={RegisterStudentStyle.input} value={form.email} onChangeText={v => setForm({...form, email: v})} autoCapitalize="none" />
            <Text style={RegisterStudentStyle.label}>TELEFONE</Text>
            <TextInput style={RegisterStudentStyle.input} value={form.telefone} onChangeText={v => setForm({...form, telefone: v})} keyboardType="phone-pad" />
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Endereço</Text>
          <View style={RegisterStudentStyle.card}>
            <View >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>CEP</Text>
                <TextInput style={RegisterStudentStyle.input} value={form.cep} onChangeText={v => setForm({...form, cep: v})} keyboardType="numeric" maxLength={8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>UF</Text>
                <TextInput style={RegisterStudentStyle.input} value={form.estado} onChangeText={v => setForm({...form, estado: v})} maxLength={2} autoCapitalize="characters" />
              </View>
            </View>
            <Text style={RegisterStudentStyle.label}>CIDADE</Text>
            <TextInput style={RegisterStudentStyle.input} value={form.cidade} onChangeText={v => setForm({...form, cidade: v})} />
            <Text style={RegisterStudentStyle.label}>LOGRADOURO</Text>
            <TextInput style={RegisterStudentStyle.input} value={form.endereco} onChangeText={v => setForm({...form, endereco: v})} />
          </View>

          <TouchableOpacity style={RegisterStudentStyle.saveBtn} onPress={handleSave}>
            <Text style={RegisterStudentStyle.saveBtnText}>{editData ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};