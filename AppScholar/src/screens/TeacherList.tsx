import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Platform, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { TeacherStyle } from '../styles/TeacherStyle';
import { professorService } from '../services/professorService';
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';

export const TeacherList = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status, showStatus, hideStatus } = useStatus();

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const data = await professorService.getProfessors();
      setProfessors(data);
    } catch (error) {
      showStatus("Não foi possível carregar a lista de professores.", "error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfessors();
    }, [])
  );

  const filtered = professors.filter(p => 
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.field?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    Keyboard.dismiss();
    hideStatus();
    
    const performDelete = async () => {
      try {
        await professorService.deleteProfessor(id); 
        showStatus("Professor removido com sucesso.", "success");
        await fetchProfessors();
      } catch (error) {
        showStatus("Não foi possível remover o professor.", "error");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja remover este professor?")) performDelete();
    } else {
      showStatus("Confirme a exclusão no alerta do sistema.", undefined);
      import('react-native').then(({ Alert }) => {
        Alert.alert("Excluir", "Remover professor selecionado?", [
          { text: "Cancelar", style: "cancel", onPress: hideStatus },
          { text: "Excluir", style: "destructive", onPress: performDelete }
        ]);
      });
    }
  };

  const formatExperience = (months: number) => {
    if (!months) return "Sem experiência cadastrada";
    const years = Math.floor(months / 12);
    if (years === 0) return `${months} meses de atuação`;
    return `${years} ${years === 1 ? 'ano' : 'anos'} de atuação`;
  };

  return (
    <SafeAreaView style={TeacherStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={TeacherStyle.list}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#8E8E93', marginTop: 20 }}>
              Nenhum professor encontrado.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={TeacherStyle.card}>
              <View style={TeacherStyle.avatar}>
                <Text style={TeacherStyle.avatarText}>
                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <View style={TeacherStyle.info}>
                <Text style={TeacherStyle.name}>{item.user?.name}</Text>
                <Text style={TeacherStyle.details}>{item.degree?.name || 'Titulação não informada'}</Text>
                <Text style={TeacherStyle.experienceText}>{formatExperience(item.teachingExperience)}</Text>
                <View style={TeacherStyle.tag}>
                  <Text style={TeacherStyle.tagText}>{item.field?.name || 'Geral'}</Text>
                </View>
              </View>
              <View style={TeacherStyle.actions}>
                <TouchableOpacity 
                  style={[TeacherStyle.actionBtn, TeacherStyle.editBtn]}
                  onPress={() => navigation.navigate('RegisterTeacher', { teacher: item })}
                > 
                  <Ionicons name="pencil" size={18} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[TeacherStyle.actionBtn, TeacherStyle.deleteBtn]}
                  onPress={() => handleDelete(item.userId)}
                >
                  <Ionicons name="trash" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};