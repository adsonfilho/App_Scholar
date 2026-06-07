import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeacherStyle } from '../styles/TeacherStyle';
import { TEACHER_INITIAL_STATE } from '../schemas/professorSchema';

export const TeacherList = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [teachers, setTeachers] = useState([
    { id: '1', nome: 'André Olímpio', area: 'Programação', titulacao: 'Mestre', experiencia: '12' },
    { id: '2', nome: 'Fabiana Silva', area: 'Estatística', titulacao: 'Doutora', experiencia: '8' },
  ]);

  const filtered = teachers.filter(t => 
    t.nome.toLowerCase().includes(search.toLowerCase()) || t.area.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    Keyboard.dismiss();
    const action = () => setTeachers(prev => prev.filter(t => t.id !== id));
    
    if (Platform.OS === 'web') {
      if (window.confirm("Deseja remover este professor?")) action();
    } else {
      Alert.alert("Excluir", "Remover professor selecionado?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: action }
      ]);
    }
  };

  return (
    <SafeAreaView style={TeacherStyle.container} edges={['top']}>
      <View style={TeacherStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={TeacherStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={TeacherStyle.navTitle}>Professores</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RegisterTeacher')} 
          style={TeacherStyle.headerAddBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={TeacherStyle.headerContent}>
        <View style={TeacherStyle.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput 
            style={TeacherStyle.searchInput} 
            placeholder="Buscar por nome ou área..." 
            value={search} 
            onChangeText={setSearch} 
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={TeacherStyle.list}
        renderItem={({ item }) => (
          <View style={TeacherStyle.card}>
            <View style={TeacherStyle.avatar}><Text style={TeacherStyle.avatarText}>{item.nome.charAt(0)}</Text></View>
            <View style={TeacherStyle.info}>
              <Text style={TeacherStyle.name}>{item.nome}</Text>
              <Text style={TeacherStyle.details}>{item.titulacao}</Text>
              <Text style={TeacherStyle.experienceText}>{item.experiencia} anos de atuação</Text>
              <View style={TeacherStyle.tag}>
                <Text style={TeacherStyle.tagText}>{item.area}</Text>
              </View>
            </View>
            <View style={TeacherStyle.actions}>
              <TouchableOpacity 
                style={[TeacherStyle.actionBtn, TeacherStyle.editBtn]}
                onPress={() => navigation.navigate('RegisterTeacher', { teacher: {...TEACHER_INITIAL_STATE, ...item } })}
              > 
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[TeacherStyle.actionBtn, TeacherStyle.deleteBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};