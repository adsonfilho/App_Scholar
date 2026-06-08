import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native'; 
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
  const [loadingLogin, setLoadingLogin] = useState(false);

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
      setLoadingLogin(true); 
      await login(email, password);
      showStatus("Bem-vindo ao App Scholar!", "success");
    } catch (error: any) {
      showStatus(error.message || "E-mail ou senha incorretos.", "error");
    } finally {
      setLoadingLogin(false); 
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
        editable={!loadingLogin} 
      />

      <TextInput
        style={LoginStyle.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loadingLogin} 
      />

      <TouchableOpacity 
        onPress={handleLogin} 
        style={[LoginStyle.primaryBtn, loadingLogin && { opacity: 0.8 }]}
        disabled={loadingLogin} 
      >
        {loadingLogin ? (
          <ActivityIndicator size="small" color="#FFF" /> 
        ) : (
          <Text style={LoginStyle.primaryBtnText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={LoginStyle.secondaryBtn}
        disabled={loadingLogin}
      >
        <Text style={LoginStyle.secondaryBtnText}>Primeiro acesso? Clique aqui</Text>
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