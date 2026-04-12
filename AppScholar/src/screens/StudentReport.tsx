import React from 'react';
import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import { ReportStyle } from '../styles/ReportStyle';
import { Ionicons } from '@expo/vector-icons';

export const StudentReport = ({ navigation }: any) => {

  const studentInfo = {
    nome: "Adson Ottoni Balbino Filho",
    curso: "DSM - Desenvolvimento de Software Multiplataforma",
    semestre: "4º Semestre"
  };

  const tableHead = ['Disciplina', 'N1', 'N2', 'Média', 'Situação'];

  const notas = [
    { id: '1', disc: 'Mobile', n1: 8.5, n2: 9.0 },
    { id: '2', disc: 'Estatística', n1: 7.0, n2: 5.5 },
    { id: '3', disc: 'Inglês IV', n1: 10.0, n2: 9.5 },
    { id: '4', disc: 'Gestão Ágil', n1: 5.0, n2: 4.5 },
  ];

  const renderStatus = (media: number) => {
    const aprovado = media >= 6.0;
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <View style={[
          ReportStyle.statusBadge, 
          aprovado ? ReportStyle.aprovadoBg : ReportStyle.reprovadoBg,
          { minWidth: 60, paddingVertical: 2 }
        ]}>
          <Text style={[ReportStyle.statusText, aprovado ? ReportStyle.aprovadoText : ReportStyle.reprovadoText]}>
            {aprovado ? 'APROVADO' : 'REPROVADO'}
          </Text>
        </View>
      </View>
    );
  };

  const tableData = notas.map(item => {
    const media = (item.n1 + item.n2) / 2;
    return [
      item.disc,
      item.n1.toFixed(1),
      item.n2.toFixed(1),
      media.toFixed(1),
      renderStatus(media)
    ];
  });

  return (
    <SafeAreaView style={ReportStyle.container} edges={['top']}>

      <View style={ReportStyle.navHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ position: 'absolute', left: 16, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={ReportStyle.navTitle}>Boletim Escolar</Text>
      </View>

      <ScrollView contentContainerStyle={ReportStyle.scroll} showsVerticalScrollIndicator={false}>

        <View style={ReportStyle.studentCard}>
          <Text style={ReportStyle.studentLabel}>Aluno(a)</Text>
          <Text style={ReportStyle.studentName}>{studentInfo.nome}</Text>
          <Text style={ReportStyle.courseName}>{studentInfo.curso}</Text>
          <Text style={[ReportStyle.studentLabel, { marginTop: 8 }]}>{studentInfo.semestre}</Text>
        </View>

        <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#F2F2F7' }}>
          <Table>
            <Row 
              data={tableHead} 
              flexArr={[2, 1, 1, 1, 1.5]}
              style={{ height: 45, backgroundColor: '#F2F2F7' }} 
              textStyle={{ textAlign: 'center', fontWeight: 'bold', fontSize: 11, color: '#8E8E93' }}
            />
            <Rows 
              data={tableData} 
              flexArr={[2, 1, 1, 1, 1.5]}
              style={{ height: 55, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F7' }}
              textStyle={{ textAlign: 'center', fontSize: 14, color: '#1C1C1E' }}
            />
          </Table>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};