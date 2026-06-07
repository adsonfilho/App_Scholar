import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';
import { loginSchema } from '../schemas/authSchema';
import { LoginStyle } from '../styles/LoginStyle';
import { TitleStyle } from '../styles/TitleStyle';
import { useAuth } from '../contexts/AuthContext';
import { SelectUserTypeModal } from '../components/SelectUserTypeModal';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const { status, showStatus, hideStatus } = useStatus();
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    hideStatus();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      showStatus(firstError, 'error');
      return;
    }

    try {
      await login(email, password);
      showStatus("Bem-vindo ao App Scholar!", "success");
    } catch (error: any) {
      showStatus(error.message || "E-mail ou senha incorretos.", "error");
    }
  };

  return (
    <View style={LoginStyle.container}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

      <Text style={TitleStyle.h1}>
        <Text style={TitleStyle.highlight}>App Scholar</Text>
      </Text>

      <TextInput
        style={LoginStyle.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={LoginStyle.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={LoginStyle.primaryBtn}>
        <Text style={LoginStyle.primaryBtnText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={LoginStyle.secondaryBtn}
      >
        <Text style={LoginStyle.secondaryBtnText}>Novo Cadastro</Text>
      </TouchableOpacity>

      <SelectUserTypeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectStudent={() => {
          setModalVisible(false);
          navigation.navigate('RegisterStudent');
        }}
        onSelectTeacher={() => {
          setModalVisible(false);
          navigation.navigate('RegisterTeacher');
        }}
      />
    </View>
  );
};