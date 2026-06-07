import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectUserTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStudent: () => void;
  onSelectTeacher: () => void;
}

export const SelectUserTypeModal = ({
  visible,
  onClose,
  onSelectStudent,
  onSelectTeacher,
}: SelectUserTypeModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Novo Cadastro</Text>
            <Text style={styles.subtitle}>Selecione o tipo de usuário</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.card, styles.cardStudent]}
              onPress={onSelectStudent}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E8F4FF' }]}>
                <Ionicons name="school-outline" size={32} color="#007AFF" />
              </View>
              <Text style={styles.cardTitle}>Aluno</Text>
              <Text style={styles.cardDesc}>Cadastrar novo estudante</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, styles.cardTeacher]}
              onPress={onSelectTeacher}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#EDFAF1' }]}>
                <Ionicons name="person-outline" size={32} color="#34C759" />
              </View>
              <Text style={styles.cardTitle}>Professor</Text>
              <Text style={styles.cardDesc}>Cadastrar novo docente</Text>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cardStudent: {
    backgroundColor: '#F5FAFF',
    borderColor: '#C2DEFF',
  },
  cardTeacher: {
    backgroundColor: '#F4FBF6',
    borderColor: '#BEECD0',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 15,
  },
});