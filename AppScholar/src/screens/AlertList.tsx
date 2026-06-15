import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../contexts/AuthContext';
import { alertService } from '../services/alertService';
import { CourseStyle } from '../styles/CourseStyle'; 

export const AlertScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const isFocused = useIsFocused(); 
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      fetchAlerts();
      markAsRead();
    }
  }, [isFocused]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await AsyncStorage.setItem('@last_alert_check', new Date().toISOString());
    } catch (error) {
      console.error("Erro ao salvar timestamp de leitura", error);
    }
  };

  return (
    <SafeAreaView style={CourseStyle.container} edges={['top']}>
      {/* HEADER DA TELA */}
      <View style={CourseStyle.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={CourseStyle.navBtn}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={CourseStyle.navTitle}>Avisos</Text>
        
        {(user?.role === 'ADMIN' || user?.role === 'PROFESSOR') ? (
          <TouchableOpacity 
            onPress={() => navigation.navigate('RegisterAlert')}
            style={CourseStyle.navBtn}
          >
            <Ionicons name="add" size={28} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} /> 
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.alertCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBadge}>
                  <Ionicons name="bookmark" size={16} color="#FF9500" />
                </View>
                <Text style={styles.alertTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>

              <Text style={styles.alertContent}>
                {item.content}
              </Text>

              <View style={styles.cardFooter}>
                <Ionicons name="person-circle-outline" size={16} color="#8E8E93" style={{ marginRight: 6 }} />
                <Text style={styles.authorText}>
                  Por: <Text style={styles.authorName}>{item.user?.name}</Text> • {item.user?.role}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    backgroundColor: '#FF950015', 
    padding: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
    letterSpacing: -0.3,
  },
  alertContent: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F2F2F7',
    paddingTop: 12,
  },
  authorText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  authorName: {
    fontWeight: '600',
    color: '#636366',
  },
});