import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusMessage } from '../components/StatusMessage';
import { studentSchema, STUDENT_INITIAL_STATE, IStudent } from '../schemas/studentSchema';
import { RegisterStudentStyle } from '../styles/StudentStyle';
import { UI_SETTINGS } from '../config/config';
import { getAddressByCep } from '../services/cepService';
import { studentService } from '../services/studentService';

const CEP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

interface IUF { id: number; sigla: string; nome: string; }
interface ICity { id: number; nome: string; }

export const RegisterStudent = ({ navigation, route }: any) => {
  const editData = route.params?.student;

  const [form, setForm] = useState<IStudent>(editData || STUDENT_INITIAL_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<'success' | 'error' | 'warning'>('error');

  const [ufs, setUfs] = useState<IUF[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedUF, setSelectedUF] = useState<IUF | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [loadingUFs, setLoadingUFs] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const [ufModalVisible, setUfModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const showMsg = (msg: string, type: 'success' | 'error' | 'warning') => {
    setMsgType(type);
    setMessage(msg);
    setTimeout(() => setMessage(null), UI_SETTINGS.STATUS_DURATION);
  };

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(r => r.json())
      .then((data: IUF[]) => {
        setUfs(data);
        if (editData?.state) {
          const uf = data.find(u => u.sigla === editData.state);
          if (uf) setSelectedUF(uf);
        }
      })
      .catch(() => showMsg('Erro ao carregar estados.', 'error'))
      .finally(() => setLoadingUFs(false));
  }, []);

  useEffect(() => {
    if (!selectedUF) { setCities([]); return; }

    setLoadingCities(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF.id}/municipios?orderBy=nome`)
      .then(r => r.json())
      .then((data: ICity[]) => {
        setCities(data);
        if (editData?.city) {
          const city = data.find(c => c.nome === editData.city);
          if (city) setSelectedCity(city);
        }
      })
      .catch(() => showMsg('Erro ao carregar cidades.', 'error'))
      .finally(() => setLoadingCities(false));
  }, [selectedUF]);

  const handleSelectUF = (uf: IUF) => {
    setSelectedUF(uf);
    setSelectedCity(null);
    setForm(prev => ({
      ...prev,
      state: uf.sigla,
      city: '',
      address: '',
      neighborhood: '',
      zipCode: '',
      number: '',
    }));
    setUfModalVisible(false);
  };

  const handleSelectCity = (city: ICity) => {
    setSelectedCity(city);
    setForm(prev => ({
      ...prev,
      city: city.nome,
      address: '',
      neighborhood: '',
      zipCode: '',
      number: '',
    }));
    setCityModalVisible(false);
  };

  const handleCepBlur = async () => {
    const cleanedCep = form.zipCode.replace(/\D/g, '');
    if (cleanedCep.length === 8) {
      const address = await getAddressByCep(cleanedCep);
      if (address) {
        const uf = ufs.find(u => u.sigla === address.uf);
        if (uf) {
          setSelectedUF(uf);
          setLoadingCities(true);
          fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.id}/municipios?orderBy=nome`)
            .then(r => r.json())
            .then((data: ICity[]) => {
              setCities(data);
              const city = data.find(c =>
                c.nome.toLowerCase() === address.localidade.toLowerCase()
              );
              if (city) setSelectedCity(city);
            })
            .finally(() => setLoadingCities(false));
        }
        setForm(prev => ({
          ...prev,
          state: address.uf,
          city: address.localidade,
          address: address.logradouro,
          neighborhood: address.bairro,
        }));
      } else {
        showMsg('CEP não encontrado.', 'error');
      }
    }
  };

  const handleSave = async () => {
    const dataToValidate: any = {
      ...form,
      phone: form.phone.replace(/\D/g, ''),
      zipCode: form.zipCode,
      role: 'STUDENT',
    };

    const result = studentSchema.safeParse(dataToValidate);

    if (!result.success) {
      showMsg(result.error.issues[0].message, 'error');
      return;
    }

    try {
      if (editData) {
        const updatePayload: any = {
          name: result.data.name,
          phone: result.data.phone,
          zipCode: result.data.zipCode,
          address: result.data.address,
          number: result.data.number,
          city: result.data.city,
          state: result.data.state,
          neighborhood: result.data.neighborhood,
        };

        if (result.data.password && result.data.password.trim() !== '') {
          updatePayload.password = result.data.password;
        }

        await studentService.updateStudent(editData.user.id, updatePayload);
        showMsg('Alterações salvas!', 'success');
      } else {
        await studentService.createStudent(result.data);
        showMsg('Aluno cadastrado com sucesso!', 'success');
      }
      setTimeout(() => { setMessage(null); navigation.goBack(); }, UI_SETTINGS.LOAD_SIMULATION_TIME);
    } catch (error: any) {
      showMsg(error?.response?.data?.message || error?.message || 'Erro ao salvar aluno.', 'error');
    }
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
              onChangeText={v => setForm({ ...form, name: v })}
              placeholder="Ex: Adson Ottoni"
              placeholderTextColor="#C7C7CD"
            />

            <Text style={RegisterStudentStyle.label}>MATRÍCULA</Text>
            <TextInput
              style={[RegisterStudentStyle.input, editData && { backgroundColor: '#F2F2F7', color: '#8E8E93' }]}
              value={form.enrollment}
              onChangeText={v => setForm({ ...form, enrollment: v })}
              keyboardType="numeric"
              placeholder="Ex: 1234567"
              placeholderTextColor="#C7C7CD"
              editable={!editData} 
            />
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Acesso</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>E-MAIL ACADÊMICO</Text>
            <TextInput
              style={[RegisterStudentStyle.input, editData && { backgroundColor: '#F2F2F7', color: '#8E8E93' }]}
              value={form.email}
              onChangeText={v => setForm({ ...form, email: v })}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="aluno@email.com"
              placeholderTextColor="#C7C7CD"
              editable={!editData} // 🌟 BLOQUEADO NA EDIÇÃO
            />

            <Text style={RegisterStudentStyle.label}>SENHA</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={RegisterStudentStyle.input}
                value={form.password}
                onChangeText={v => setForm({ ...form, password: v })}
                secureTextEntry={!showPassword}
                placeholder={editData ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
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

          <Text style={RegisterStudentStyle.sectionTitle}>Contato</Text>
          <View style={RegisterStudentStyle.card}>
            <Text style={RegisterStudentStyle.label}>TELEFONE</Text>
            <MaskInput
              style={RegisterStudentStyle.input}
              value={form.phone}
              onChangeText={masked => setForm({ ...form, phone: masked })}
              mask={Masks.BRL_PHONE}
              keyboardType="numeric"
              placeholder="(00) 00000-0000"
              placeholderTextColor="#C7C7CD"
            />
          </View>

          <Text style={RegisterStudentStyle.sectionTitle}>Endereço</Text>
          <View style={RegisterStudentStyle.card}>

            <Text style={RegisterStudentStyle.label}>CEP</Text>
            <MaskInput
              style={RegisterStudentStyle.input}
              value={form.zipCode}
              onChangeText={masked => setForm({ ...form, zipCode: masked })}
              onBlur={handleCepBlur}
              mask={CEP_MASK}
              keyboardType="numeric"
              placeholder="00000-000"
              placeholderTextColor="#C7C7CD"
            />

            <Text style={RegisterStudentStyle.label}>ESTADO</Text>
            {loadingUFs ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginBottom: 12 }} />
            ) : (
              <TouchableOpacity
                style={RegisterStudentStyle.customSelectButton}
                onPress={() => setUfModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={selectedUF ? RegisterStudentStyle.selectButtonText : RegisterStudentStyle.placeholderText}>
                  {selectedUF ? `${selectedUF.sigla} — ${selectedUF.nome}` : 'Selecione o estado...'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#636366" />
              </TouchableOpacity>
            )}

            <Text style={RegisterStudentStyle.label}>CIDADE</Text>
            <TouchableOpacity
              style={[
                RegisterStudentStyle.customSelectButton,
                !selectedUF && RegisterStudentStyle.selectDisabled,
              ]}
              onPress={() => selectedUF && !loadingCities && setCityModalVisible(true)}
              activeOpacity={selectedUF ? 0.7 : 1}
            >
              {loadingCities ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={selectedCity ? RegisterStudentStyle.selectButtonText : RegisterStudentStyle.placeholderText}>
                  {selectedCity ? selectedCity.nome : selectedUF ? 'Selecione a cidade...' : 'Selecione o estado primeiro'}
                </Text>
              )}
              <Ionicons name="chevron-down" size={18} color={selectedUF ? '#636366' : '#C7C7CD'} />
            </TouchableOpacity>

            <View style={RegisterStudentStyle.row}>
              <View style={{ flex: 3, marginRight: 10 }}>
                <Text style={RegisterStudentStyle.label}>LOGRADOURO</Text>
                <TextInput
                  style={RegisterStudentStyle.input}
                  value={form.address}
                  onChangeText={v => setForm({ ...form, address: v })}
                  placeholder="Ex: Rua das Flores"
                  placeholderTextColor="#C7C7CD"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={RegisterStudentStyle.label}>Nº</Text>
                <TextInput
                  style={RegisterStudentStyle.input}
                  value={form.number}
                  onChangeText={v => setForm({ ...form, number: v })}
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
              onChangeText={v => setForm({ ...form, neighborhood: v })}
              placeholder="Ex: Centro"
              placeholderTextColor="#C7C7CD"
            />
          </View>

          <TouchableOpacity style={RegisterStudentStyle.saveBtn} onPress={handleSave}>
            <Text style={RegisterStudentStyle.saveBtnText}>
              {editData ? 'SALVAR ALTERAÇÕES' : 'FINALIZAR CADASTRO'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="slide" transparent visible={ufModalVisible} onRequestClose={() => setUfModalVisible(false)}>
        <View style={RegisterStudentStyle.modalOverlay}>
          <View style={RegisterStudentStyle.modalContent}>
            <Text style={RegisterStudentStyle.modalTitle}>Selecione o Estado</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {ufs.map(uf => (
                <TouchableOpacity
                  key={uf.id}
                  style={RegisterStudentStyle.modalOption}
                  onPress={() => handleSelectUF(uf)}
                >
                  <Text style={RegisterStudentStyle.modalOptionText}>{uf.sigla} — {uf.nome}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[RegisterStudentStyle.modalOption, RegisterStudentStyle.cancelOption]}
                onPress={() => setUfModalVisible(false)}
              >
                <Text style={[RegisterStudentStyle.modalOptionText, RegisterStudentStyle.cancelOptionText]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={cityModalVisible} onRequestClose={() => setCityModalVisible(false)}>
        <View style={RegisterStudentStyle.modalOverlay}>
          <View style={RegisterStudentStyle.modalContent}>
            <Text style={RegisterStudentStyle.modalTitle}>Selecione a Cidade</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cities.map(city => (
                <TouchableOpacity
                  key={city.id}
                  style={RegisterStudentStyle.modalOption}
                  onPress={() => handleSelectCity(city)}
                >
                  <Text style={RegisterStudentStyle.modalOptionText}>{city.nome}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[RegisterStudentStyle.modalOption, RegisterStudentStyle.cancelOption]}
                onPress={() => setCityModalVisible(false)}
              >
                <Text style={[RegisterStudentStyle.modalOptionText, RegisterStudentStyle.cancelOptionText]}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};