import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import { ReportStyle } from '../styles/ReportStyle';
import { Ionicons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';
import { useAuth } from '../contexts/AuthContext'; 
import { useStatus } from '../hooks/useStatus';
import { StatusMessage } from '../components/StatusMessage';

export const StudentReport = ({ navigation, route }: any) => {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);

  const { status, showStatus, hideStatus } = useStatus();

  const studentId = route.params?.userId || user?.id; 

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await studentService.getStudentReport(studentId);
        
        const data = response?.data ? response.data : response;
        setStudentData(data);
      } catch (error) {
        showStatus("Não foi possível carregar o boletim escolar.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchReport();
    } else {
      showStatus("ID do aluno não foi fornecido.", "error");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  }, [studentId]);

  const tableHead = ['Disciplina', 'N1', 'N2', 'Média', 'Situação'];

  const renderStatus = (situation: string) => {
    const isApproved = situation === 'PASSED' || situation === 'APROVADO';
    const isPending = situation === 'PENDING' || situation === 'PENDENTE';

    let badgeStyle = ReportStyle.reprovadoBg;
    let textStyle = ReportStyle.reprovadoText;
    let label = 'REPROVADO';

    if (isApproved) {
      badgeStyle = ReportStyle.aprovadoBg;
      textStyle = ReportStyle.aprovadoText;
      label = 'APROVADO';
    } else if (isPending) {
      badgeStyle = { backgroundColor: '#FFE2E2' };
      textStyle = { color: '#FF9500' };
      label = 'CURSANDO';
    }

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <View style={[ReportStyle.statusBadge, badgeStyle, { minWidth: 65, paddingVertical: 2 }]}>
          <Text style={[ReportStyle.statusText, textStyle, { fontSize: 10 }]}>{label}</Text>
        </View>
      </View>
    );
  };

  const tableData = studentData?.grades?.map((item: any) => {
    const n1Formatted = item.grade1 !== null && item.grade1 !== undefined ? Number(item.grade1).toFixed(1) : '-';
    const n2Formatted = item.grade2 !== null && item.grade2 !== undefined ? Number(item.grade2).toFixed(1) : '-';
    const mediaFormatted = item.average !== null && item.average !== undefined ? Number(item.average).toFixed(1) : '-';

    return [
      item.subject?.name || 'Matéria',
      n1Formatted,
      n2Formatted,
      mediaFormatted,
      renderStatus(item.situation)
    ];
  }) || [];

  return (
    <SafeAreaView style={ReportStyle.container} edges={['top']}>
      <StatusMessage
        message={status?.msg || null}
        type={status?.type}
        onClose={hideStatus}
      />

      <View style={ReportStyle.navHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ position: 'absolute', left: 16, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={ReportStyle.navTitle}>Boletim Escolar</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={ReportStyle.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={ReportStyle.studentCard}>
            <Text style={ReportStyle.studentLabel}>Aluno(a)</Text>
            <Text style={ReportStyle.studentName}>{studentData?.user?.name}</Text>
            <Text style={ReportStyle.courseName}>{studentData?.course?.name || 'Curso não identificado'}</Text>
            <Text style={[ReportStyle.studentLabel, { marginTop: 8 }]}>
              {studentData?.enrollment ? `RA: ${studentData.enrollment}` : ''}
            </Text>
          </View>

          <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F2F2F7' }}>
            <Table>
              <Row 
                data={tableHead} 
                flexArr={[2, 1, 1, 1, 1.5]}
                style={{ height: 45, backgroundColor: '#F2F2F7' }} 
                textStyle={{ textAlign: 'center', fontWeight: 'bold', fontSize: 11, color: '#8E8E93' }}
              />
              {tableData.length > 0 ? (
                <Rows 
                  data={tableData} 
                  flexArr={[2, 1, 1, 1, 1.5]}
                  style={{ height: 55, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F7' }}
                  textStyle={{ textAlign: 'center', fontSize: 13, color: '#1C1C1E' }}
                />
              ) : (
                <View style={{ padding: 20, backgroundColor: '#FFF' }}>
                  <Text style={{ textAlign: 'center', color: '#8E8E93' }}>Nenhuma nota lançada.</Text>
                </View>
              )}
            </Table>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};