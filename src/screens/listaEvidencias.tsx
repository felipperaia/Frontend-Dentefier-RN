import React, { useState } from 'react';
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
} from 'react-native';

type Evidencia = {
  id: string;
  imagem: string;
  descricao: string;
  tipo: string;
  dataColeta: string;
  responsavel: string;
};

export default function Evidencias() {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([
    {
      id: '1',
      imagem: 'https://via.placeholder.com/150',
      descricao: 'Evidência 1',
      tipo: 'Fotográfica',
      dataColeta: '05/06/2025',
      responsavel: 'João Silva',
    },
    {
      id: '2',
      imagem: 'https://via.placeholder.com/150',
      descricao: 'Evidência 2',
      tipo: 'Documental',
      dataColeta: '04/06/2025',
      responsavel: 'Maria Oliveira',
    },
  ]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [evidenciaSelecionada, setEvidenciaSelecionada] = useState<Evidencia | null>(null);
  const [descricaoEditada, setDescricaoEditada] = useState<string>('');
  const [tipoEditado, setTipoEditado] = useState<string>('');
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  const abrirModal = (item: Evidencia) => {
    setEvidenciaSelecionada(item);
    setDescricaoEditada(item.descricao);
    setTipoEditado(item.tipo);
    setModoEdicao(false);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setEvidenciaSelecionada(null);
    setDescricaoEditada('');
    setTipoEditado('');
    setModoEdicao(false);
  };

  const salvarEdicao = () => {
    if (!evidenciaSelecionada) return;
    setEvidencias((prev) =>
      prev.map((ev) =>
        ev.id === evidenciaSelecionada.id
          ? { ...ev, descricao: descricaoEditada, tipo: tipoEditado }
          : ev
      )
    );
    setModoEdicao(false);
  };

  const excluirEvidencia = () => {
    if (!evidenciaSelecionada) return;
    Alert.alert(
      'Excluir Evidência',
      'Tem certeza que deseja excluir esta evidência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setEvidencias((prev) =>
              prev.filter((ev) => ev.id !== evidenciaSelecionada.id)
            );
            fecharModal();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Evidencia }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => abrirModal(item)}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
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
          <Text style={styles.bold}>Responsável:</Text> {item.responsavel}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={evidencias}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {}}
      >
        <Text style={styles.fabText}>+ Adicionar Evidência</Text>
      </TouchableOpacity>

      {/* Modal detalhado */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: evidenciaSelecionada?.imagem }}
              style={styles.modalImage}
            />

            {/* Descrição */}
            <View style={styles.fieldContainer}>
              <Text style={styles.modalLabel}>Descrição</Text>
              <TextInput
                style={styles.input}
                value={descricaoEditada}
                onChangeText={setDescricaoEditada}
                multiline
                editable={modoEdicao}
                placeholder="Digite a descrição da evidência"
              />
            </View>

            {/* Tipo da Evidência */}
            <View style={styles.fieldContainer}>
              <Text style={styles.modalLabel}>Tipo da Evidência</Text>
              <TextInput
                style={styles.input}
                value={tipoEditado}
                onChangeText={setTipoEditado}
                editable={modoEdicao}
                placeholder="Ex: Fotográfica, Documental..."
              />
            </View>

            {/* Somente leitura */}
            <View style={styles.readonlyContainer}>
              <Text style={styles.modalLabel}>Data da Coleta</Text>
              <Text style={{ color: 'white' }}>{evidenciaSelecionada?.dataColeta}</Text>
            </View>
            <View style={styles.readonlyContainer}>
              <Text style={styles.modalLabel}>Responsável</Text>
              <Text style={{ color: 'white' }}>{evidenciaSelecionada?.responsavel}</Text>
            </View>

            <View style={styles.modalButtons}>
              {!modoEdicao ? (
                <TouchableOpacity style={styles.editButton} onPress={() => {}}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.editButton} onPress={salvarEdicao}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteButton} onPress={excluirEvidencia}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={fecharModal}>
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
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-start',
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
