// src/screens/ListaEvidencias.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import { getEvidencias, deleteEvidencia, updateEvidencia } from '../services/evidencias';

type Evidencia = {
  _id: string;
  imagemUrl: string;
  descricao: string;
  tipo: string;
  dataColeta: string;
  responsavelColeta: string;
};

export type MainAppStackParamList = {
  ListaEvidencias: undefined;
  CadastroEvidencia: undefined;
};

export default function ListaEvidencias() {
  const navigation = useNavigation<NavigationProp<MainAppStackParamList>>();
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<Evidencia | null>(null);
  const [descricaoEdit, setDescricaoEdit] = useState<string>('');
  const [tipoEdit, setTipoEdit] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const fetchEvidencias = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getEvidencias();
      setEvidencias(list);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível carregar evidências');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega evidências sempre que a tela receber foco
  useFocusEffect(
    useCallback(() => {
      fetchEvidencias();
    }, [fetchEvidencias])
  );

  const openModal = (item: Evidencia) => {
    setSelected(item);
    setDescricaoEdit(item.descricao);
    setTipoEdit(item.tipo);
    setEditMode(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const saveEdit = async () => {
    if (!selected) return;
    try {
      await updateEvidencia(selected._id, { descricao: descricaoEdit, tipo: tipoEdit });
      setModalVisible(false);
      fetchEvidencias();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Falha ao atualizar');
    }
  };

  const deleteItem = () => {
    if (!selected) return;
    Alert.alert(
      'Excluir Evidência',
      'Tem certeza que deseja excluir esta evidência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvidencia(selected._id);
              setModalVisible(false);
              fetchEvidencias();
            } catch (e: any) {
              Alert.alert('Erro', e.message || 'Falha ao excluir');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Evidencia }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openModal(item)}>
      <Image source={{ uri: item.imagemUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>
          <Text style={styles.bold}>Descrição:</Text> {item.descricao}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Tipo:</Text> {item.tipo}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Data:</Text> {item.dataColeta}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>Responsável:</Text> {item.responsavelColeta}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={evidencias}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroEvidencia')}
      >
        <Text style={styles.fabText}>+ Adicionar Evidência</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selected?.imagemUrl }}
              style={styles.modalImage}
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.modalLabel}>Descrição</Text>
              <TextInput
                style={styles.input}
                value={descricaoEdit}
                onChangeText={setDescricaoEdit}
                multiline
                editable={editMode}
                placeholder="Digite a descrição da evidência"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.modalLabel}>Tipo da Evidência</Text>
              <TextInput
                style={styles.input}
                value={tipoEdit}
                onChangeText={setTipoEdit}
                editable={editMode}
                placeholder="Ex: Fotográfica, Documental..."
              />
            </View>

            <View style={styles.readonlyContainer}>
              <Text style={styles.modalLabel}>Data da Coleta</Text>
              <Text style={{ color: 'white' }}>{selected?.dataColeta}</Text>
            </View>
            <View style={styles.readonlyContainer}>
              <Text style={styles.modalLabel}>Responsável</Text>
              <Text style={{ color: 'white' }}>{selected?.responsavelColeta}</Text>
            </View>

            <View style={styles.modalButtons}>
              {!editMode ? (
                <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.editButton} onPress={saveEdit}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteButton} onPress={deleteItem}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#222831',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#393e46',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    marginBottom: 4,
    color: 'white',
  },
  bold: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffd369',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: {
    color: '#222831',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#393e46',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 20,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 12,
  },
  modalLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#EEEEEE',
  },
  readonlyContainer: {
    width: '100%',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#ffd369',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#ffd369',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#222831',
    fontWeight: 'bold',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});
