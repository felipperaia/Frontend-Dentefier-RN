import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, Card, Title, Paragraph, DataTable, Button } from 'react-native-paper';
import tw from 'twrnc';
import { FileDown, Trash2 } from 'lucide-react-native'; // Icons

// Mock data for reports
const mockReports = [
  { id: '1', caseNumber: 'CASO-001', date: '2024-05-15', status: 'Concluído' },
  { id: '2', caseNumber: 'CASO-002', date: '2024-05-20', status: 'Em Análise' },
  { id: '3', caseNumber: 'CASO-003', date: '2024-05-28', status: 'Concluído' },
  { id: '4', caseNumber: 'CASO-004', date: '2024-06-01', status: 'Pendente' },
];

const ReportsScreen = () => {

  // TODO: Implement actual data fetching logic
  // TODO: Implement download/delete logic

  const handleDownloadReport = (reportId: string) => {
    console.log(`Baixar relatório: ${reportId}`);
    // Add download logic here
  };

  const handleDeleteReport = (reportId: string) => {
    console.log(`Excluir relatório: ${reportId}`);
    // Add delete logic here (with confirmation)
  };

  const renderReportItem = ({ item }: { item: typeof mockReports[0] }) => (
    <DataTable.Row style={tw`border-b border-gray-700`}>
      <DataTable.Cell textStyle={tw`text-gray-300`}>{item.caseNumber}</DataTable.Cell>
      <DataTable.Cell textStyle={tw`text-gray-300`}>{item.date}</DataTable.Cell>
      <DataTable.Cell textStyle={tw`text-gray-300`}>{item.status}</DataTable.Cell>
      <DataTable.Cell style={tw`justify-end`}>
        <View style={tw`flex-row`}>
          <Button 
            icon={() => <FileDown color={tw.color('blue-400')} size={18} />} 
            onPress={() => handleDownloadReport(item.id)} 
            compact 
            style={tw`p-0 m-0 min-h-0`} 
            contentStyle={tw`p-1`}
          />
          <Button 
            icon={() => <Trash2 color={tw.color('red-500')} size={18} />} 
            onPress={() => handleDeleteReport(item.id)} 
            compact 
            style={tw`p-0 m-0 min-h-0`} 
            contentStyle={tw`p-1`}
          />
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <ScrollView style={tw`flex-1 bg-black p-4`}>
      <Card style={tw`mb-6 bg-gray-900`}>
        <Card.Content>
          <Title style={tw`text-yellow-500 text-lg mb-2`}>Relatórios de Identificação</Title>
          <Paragraph style={tw`text-gray-300 mb-4`}>
            Visualize e gerencie os relatórios gerados pelo sistema.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={tw`bg-gray-900`}>
        <DataTable>
          <DataTable.Header style={tw`border-b border-gray-600 bg-gray-800`}>
            <DataTable.Title><Text style={tw`text-yellow-500 font-semibold`}>Caso</Text></DataTable.Title>
            <DataTable.Title><Text style={tw`text-yellow-500 font-semibold`}>Data</Text></DataTable.Title>
            <DataTable.Title><Text style={tw`text-yellow-500 font-semibold`}>Status</Text></DataTable.Title>
            <DataTable.Title style={tw`justify-end`}><Text style={tw`text-yellow-500 font-semibold`}>Ações</Text></DataTable.Title>
          </DataTable.Header>

          <FlatList
            data={mockReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id}
          />

          {/* Add Pagination if needed */}
          {/* <DataTable.Pagination ... /> */}
        </DataTable>
      </Card>

    </ScrollView>
  );
};

export default ReportsScreen;

