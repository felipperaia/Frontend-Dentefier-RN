// src/screens/EvidenciasList.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getEvidencias, Evidencia, deleteEvidencia } from '../services/evidencias';
import { getMe } from '../services/auth';
import EditEvidenciaModal from './EditEvidenciaModal';

export type MainAppStackParamList = {
  CadastroEvidencia: undefined;
  EditEvidencia: { id: string };
};

export default function EvidenciasList() {
  const navigation = useNavigation<NavigationProp<MainAppStackParamList>>();
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [selected, setSelected] = useState<Evidencia | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const me = await getMe();
      setUserRole(me.role);
      const list = await getEvidencias();
      setEvidencias(list);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    try {
      await deleteEvidencia(id);
      setEvidencias(prev => prev.filter(e => e._id !== id));
      setSelected(null);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  const renderItem = ({ item }: { item: Evidencia }) => (
    <TouchableOpacity style={styles.item} onPress={() => setSelected(item)}>
      {item.arquivo?.filename ? (
        <Image
          source={{ uri: `https://backend-dentefier.onrender.com/api/evidencias/${item._id}/arquivo` }}
          style={styles.thumb}
        />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <Text style={styles.text}>SEM ARQUIVO</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.text}><Text style={styles.bold}>Descrição:</Text> {item.descricao}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Tipo:</Text> {item.tipo}</Text>
        <Text style={styles.text}><Text style={styles.bold}>Data:</Text> {new Date(item.dataColeta).toLocaleDateString('pt-BR')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={evidencias}
        keyExtractor={i => i._id}
        renderItem={renderItem}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CadastroEvidencia')}
      >
        <Text style={styles.fabText}>+ Adicionar</Text>
      </TouchableOpacity>

      {selected && (
        <EditEvidenciaModal
          evidencia={selected}
          visible={!!selected}
          onClose={() => setSelected(null)}
          onDeleted={() => onDelete(selected._id)}
          onSaved={load}
          userRole={userRole}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222831' },
  item: { flexDirection: 'row', backgroundColor: '#393e46', margin: 8, borderRadius: 8, padding: 10 },
  thumb: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#ccc' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 12 },
  text: { color: 'white', marginBottom: 4 },
  bold: { fontWeight: 'bold' },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: '#ffd369', padding: 12, borderRadius: 30
  },
  fabText: { color: '#222831', fontWeight: 'bold' },
});
