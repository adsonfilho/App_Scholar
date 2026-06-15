import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ZodError } from 'zod';

import { CourseStyle } from '../styles/CourseStyle'; 
import { alertService } from '../services/alertService';
import { createAlertSchema } from '../schemas/alertSchema'; 
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';

export const RegisterAlert = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { status, showStatus, hideStatus } = useStatus();

  const handlePublish = async () => {
    try {
      setSubmitting(true);
      Keyboard.dismiss();

      const validatedData = createAlertSchema.parse({
        title,
        content,
      });

      await alertService.createAlert(validatedData);

      showStatus("Aviso publicado com sucesso!", "success");
      
      setTimeout(() => {
        hideStatus();
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0]?.message || "Dados inválidos.";
        showStatus(firstError, "error");
      } else {
        const errorMsg = error?.response?.data?.message || "Não foi possível publicar este aviso.";
        showStatus(errorMsg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

      <View style={CourseStyle.navHeader}>
        <TouchableOpacity 
          onPress={() => {
            hideStatus();
            navigation.goBack();
          }} 
          style={CourseStyle.navBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={CourseStyle.navTitle}>Novo Aviso</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Título do Comunicado *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Mudança no horário das aulas de DSM"
          placeholderTextColor="#8E8E93"
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
        />

        <Text style={styles.label}>Conteúdo do Aviso *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite aqui as informações detalhadas que toda a instituição precisa ler..."
          placeholderTextColor="#8E8E93"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          editable={!submitting}
        />

        <TouchableOpacity 
          style={[styles.publishBtn, submitting && styles.publishBtnDisabled]}
          onPress={handlePublish}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="paper-plane-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.publishBtnText}>Publicar no Mural</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 20,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  publishBtn: {
    backgroundColor: '#FF9500',
    height: 52,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  publishBtnDisabled: {
    backgroundColor: '#FFCC80',
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});