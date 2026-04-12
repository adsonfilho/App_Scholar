import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudentListStyle } from '../styles/StudentStyle';

export const StudentList = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([
    { id: '1', nome: 'Adson Ottoni', matricula: '2024001', curso: 'DSM' },
    { id: '2', nome: 'Ana Silva', matricula: '2024002', curso: 'DSM' },
  ]);

  const filteredStudents = students.filter(s => 
    s.nome.toLowerCase().includes(search.toLowerCase()) || s.matricula.includes(search)
  );

  const handleDelete = (id: string) => {
    Keyboard.dismiss();
    const deleteAction = () => setStudents(prev => prev.filter(s => s.id !== id));

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente remover este aluno?")) deleteAction();
    } else {
      Alert.alert("Excluir", "Deseja remover este aluno?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: deleteAction }
      ]);
    }
  };

  return (
    <SafeAreaView style={StudentListStyle.container} edges={['top']}>
      <View style={StudentListStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={StudentListStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={StudentListStyle.navTitle}>Gerenciar Alunos</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('RegisterStudent')} 
          style={StudentListStyle.headerAddBtn}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={StudentListStyle.headerContent}>
        <View style={StudentListStyle.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput 
            style={StudentListStyle.searchInput} 
            placeholder="Pesquisar nome ou RA..." 
            value={search} 
            onChangeText={setSearch} 
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={StudentListStyle.list}
        renderItem={({ item }) => (
          <View style={StudentListStyle.card}>
            <View style={StudentListStyle.avatar}><Text style={StudentListStyle.avatarText}>{item.nome.charAt(0)}</Text></View>
            <View style={StudentListStyle.info}>
              <Text style={StudentListStyle.name}>{item.nome}</Text>
              <Text style={StudentListStyle.details}>RA: {item.matricula} • {item.curso}</Text>
            </View>
            <View style={StudentListStyle.actions}>
              <TouchableOpacity 
                style={[StudentListStyle.actionBtn, StudentListStyle.editBtn]}
                onPress={() => navigation.navigate('RegisterStudent', { student: item })}
              >
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[StudentListStyle.actionBtn, StudentListStyle.deleteBtn]}
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