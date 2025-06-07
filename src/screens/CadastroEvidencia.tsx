// src/screens/CadastroEvidencia.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { getMe } from '../services/auth';
import { getCasos } from '../services/casos';

interface Caso { _id: string; numeroCaso: string; titulo: string }
interface User { _id: string; username: string; role: string }

export type MainAppStackParamList = {
  CadastroEvidencia: undefined;
};

export default function CadastroEvidencia() {
  const nav = useNavigation<NavigationProp<MainAppStackParamList>>();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [meId, setMeId] = useState<string>('');
  const [form, setForm] = useState({
    casoId: '', tipo: '', descricao: '',
    responsavelColeta: '', dataColeta: new Date().toISOString().slice(0,10)
  });

  useEffect(() => {
    (async () => {
      const me = await getMe();
      setMeId(me._id);
      const casosList = await getCasos();
      setCasos(casosList);
      const res = await fetch('https://backend-dentefier.onrender.com/api/users?limit=100', { credentials: 'include' });
      const { data } = await res.json();
      setUsuarios(data.filter((u:User) => ['admin','assistente'].includes(u.role)));
      setForm(f => ({ ...f, responsavelColeta: me.username }));
    })();
  }, []);

  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All });
    if (!res.cancelled) setFileUri(res.uri);
  };

  const submit = async () => {
    try {
      const fd = new FormData();
      // Envia tanto 'caso' quanto 'casoId' para compatibilidade com o backend
      fd.append('caso', form.casoId);
      fd.append('casoId', form.casoId);
      fd.append('tipo', form.tipo);
      fd.append('descricao', form.descricao);
      fd.append('responsavelColeta', form.responsavelColeta);
      fd.append('dataColeta', form.dataColeta);
      fd.append('registradoPor', meId);

      if (fileUri) {
        const name = fileUri.split('/').pop()!;
        fd.append('arquivo', {
          uri: fileUri,
          name,
          type: name.match(/\.(jpe?g|png)$/i)
            ? `image/${name.split('.').pop()}`
            : 'application/octet-stream',
        } as any);
      }

      const response = await fetch(
        'https://backend-dentefier.onrender.com/api/evidencias',
        {
          method: 'POST',
          credentials: 'include',
          body: fd,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao criar evidência');
      }

      Alert.alert('Sucesso', 'Evidência criada');
      nav.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Caso</Text>
      <Picker
        selectedValue={form.casoId}
        onValueChange={v => setForm(f => ({ ...f, casoId: v }))}
        style={styles.input}
      >
        <Picker.Item label="Selecione caso" value="" />
        {casos.map(c => (
          <Picker.Item
            key={c._id}
            label={`${c.numeroCaso} – ${c.titulo}`}
            value={c._id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        value={form.tipo}
        onChangeText={t => setForm(f => ({ ...f, tipo: t }))}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.descricao}
        onChangeText={t => setForm(f => ({ ...f, descricao: t }))}
      />

      <Text style={styles.label}>Responsável Coleta</Text>
      <Picker
        selectedValue={form.responsavelColeta}
        onValueChange={v => setForm(f => ({ ...f, responsavelColeta: v }))}
        style={styles.input}
      >
        {usuarios.map(u => (
          <Picker.Item
            key={u._id}
            label={`${u.username} (${u.role})`}
            value={u.username}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Data Coleta</Text>
      <TextInput
        style={styles.input}
        value={form.dataColeta}
        onChangeText={t => setForm(f => ({ ...f, dataColeta: t }))}
      />

      <TouchableOpacity style={styles.fileBtn} onPress={pickFile}>
        <Text style={styles.fileBtnText}>Selecionar Arquivo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitText}>Salvar Evidência</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222831' },
  label: { color: '#FFD369', marginBottom: 4 },
  input: { backgroundColor: '#393e46', color: 'white', borderRadius: 4, padding: 8, marginBottom: 12 },
  fileBtn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 12 },
  fileBtnText: { color: 'white', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#FFD369', padding: 12, borderRadius: 6, alignItems: 'center' },
  submitText: { color: '#222831', fontWeight: 'bold' },
});
