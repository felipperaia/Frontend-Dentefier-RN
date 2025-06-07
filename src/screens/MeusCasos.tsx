// src/screens/MeusCasos.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { Platform } from 'react-native';
import { MainTabParamList } from '../navigation/MainAppTabs';

import { getMe, User as AuthUser } from '../services/auth';
import { getCasos, Caso as ServiceCaso } from '../services/casos';

type Navigation = NavigationProp<MainTabParamList>;

export default function MeusCasos() {
  const navigation = useNavigation<Navigation>();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [casos, setCasos] = useState<ServiceCaso[]>([]);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<ServiceCaso | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const me = await getMe();
      setUser(me);
      const list = await getCasos();
      setCasos(list);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados])
  );

  const casosFiltrados = casos.filter(c => {
    const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro;
    const matchTipo = tipoFiltro === 'todos' || c.contexto.tipoCaso === tipoFiltro;
    const matchBusca =
      !busca ||
      c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      c.numeroCaso.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchTipo && matchBusca;
  });

  const openModal = (caso: ServiceCaso) => {
    setSelectedCaso(caso);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.center, styles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.center, styles.container]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meus Casos</Text>
      <View style={styles.filterBar}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por título ou código"
          placeholderTextColor="#888"
          value={busca}
          onChangeText={setBusca}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={statusFiltro}
            style={styles.picker}
            dropdownIconColor="#222"
            mode="dropdown"
            onValueChange={setStatusFiltro}
          >
            <Picker.Item label="Todos os Status" value="todos" />
            <Picker.Item label="Em andamento" value="Em andamento" />
            <Picker.Item label="Finalizado" value="Finalizado" />
            <Picker.Item label="Arquivado" value="Arquivado" />
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoFiltro}
            style={styles.picker}
            dropdownIconColor="#222"
            mode="dropdown"
            onValueChange={setTipoFiltro}
          >
            <Picker.Item label="Todos os Tipos" value="todos" />
            <Picker.Item label="Odontologia Forense" value="Odontologia Forense" />
            <Picker.Item label="Identificação Humana" value="Identificação Humana" />
            <Picker.Item label="Exame Criminal" value="Exame Criminal" />
            <Picker.Item label="Trauma" value="Trauma" />
            <Picker.Item label="Estimativa de Idade" value="Estimativa de Idade" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flex: 1 }}
        data={casosFiltrados}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
            <Text style={styles.title}>{item.titulo}</Text>
            <Text style={styles.subtitle}>
              #{item.numeroCaso} • {item.status} •{' '}
              {new Date(item.dataAbertura).toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>Nenhum caso encontrado.</Text>
          </View>
        )}
      />
      {user?.role !== 'assistente' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CadastroCaso')}
        >
          <Text style={styles.addButtonText}>+ Novo Caso</Text>
        </TouchableOpacity>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>#{selectedCaso?.numeroCaso}</Text>
              <Text style={styles.modalLabel}>Título:</Text>
              <Text style={styles.modalText}>{selectedCaso?.titulo}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', margin: 16 },
  filterBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    backgroundColor: '#eee',
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
    ...Platform.select({
      android: { paddingHorizontal: 8 },
    }),
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
    elevation: 1,
  },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16, padding: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '80%',
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalLabel: { fontWeight: 'bold', marginTop: 8 },
  modalText: { marginBottom: 4 },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 4,
  },
  closeButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
