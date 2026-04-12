import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';
import { loginSchema } from '../schemas/authSchema'; 
import { LoginStyle } from '../styles/LoginStyle';
import { TitleStyle } from '../styles/TitleStyle';

export const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { status, showStatus, hideStatus } = useStatus();

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const firstError = result.error.issues[0].message;
      showStatus(firstError, 'error'); 
      return;
    }

    showStatus("Bem-vindo ao App Scholar!", "success");

    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 800);
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
      
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

