// src/screens/EditEvidenciaModal.tsx
import React, { useState } from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity, Image,
  TextInput, Alert, ScrollView
} from 'react-native';
import { Evidencia, updateEvidencia } from '../services/evidencias';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  evidencia: Evidencia;
  visible: boolean;
  userRole: string;
  onClose(): void;
  onDeleted(): void;
  onSaved(): void;
}

export default function EditEvidenciaModal({ evidencia: ev, visible, userRole, onClose, onDeleted, onSaved }: Props) {
  const [descricao, setDescricao] = useState(ev.descricao);
  const [tipo, setTipo] = useState(ev.tipo);
  const [responsavel, setResponsavel] = useState(ev.responsavelColeta || '');
  const [dataColeta, setDataColeta] = useState(ev.dataColeta.split('T')[0]);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const isEditable = ['admin','assistente'].includes(userRole);

  const pickFile = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, base64: false });
    if (!res.cancelled) setFileUri(res.uri);
  };

  const save = async () => {
    try {
      const fd = new FormData();
      fd.append('descricao', descricao);
      fd.append('tipo', tipo);
      fd.append('responsavelColeta', responsavel);
      fd.append('dataColeta', dataColeta);
      if (fileUri) {
        const name = fileUri.split('/').pop()!;
        fd.append('arquivo', {
          uri: fileUri,
          name,
          type: name.match(/\.(png|jpe?g)$/i) ? 'image/jpeg' : 'application/octet-stream'
        } as any);
      }
      await updateEvidencia(ev._id, fd);
      Alert.alert('Sucesso','Atualizado');
      onSaved();
      onClose();
    } catch(e) {
      Alert.alert('Erro', e.message);
    }
  };

  const confirmDelete = () => Alert.alert(
    'Excluir?', 'Confirma exclusão da evidência?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onDeleted }
    ]
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ScrollView style={styles.modal}>
          <Image
            source={
              fileUri
                ? { uri: fileUri }
                : ev.arquivo?.filename
                  ? { uri: `https://backend-dentefier.onrender.com/api/evidencias/${ev._id}/arquivo` }
                  : require('../../assets/placeholder-image.png')
            }
            style={styles.image}
          />

          {/* Campos editáveis */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              editable={isEditable}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput style={styles.input} value={tipo} onChangeText={setTipo} editable={isEditable}/>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Responsável Coleta</Text>
            <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} editable={isEditable}/>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Data Coleta</Text>
            <TextInput style={styles.input} value={dataColeta} onChangeText={setDataColeta} editable={isEditable}/>
          </View>
          {isEditable && (
            <TouchableOpacity style={styles.fileBtn} onPress={pickFile}>
              <Text style={styles.fileBtnText}>Selecionar Arquivo</Text>
            </TouchableOpacity>
          )}

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>
            {isEditable && (
              <>
                <TouchableOpacity style={styles.saveBtn} onPress={save}>
                  <Text style={styles.btnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
                  <Text style={styles.btnText}>Excluir</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'center', padding:20
  },
  modal: {
    backgroundColor:'#393e46', borderRadius:8, padding:16
  },
  image: {
    width:'100%', height:200, borderRadius:6, marginBottom:12
  },
  field: { marginBottom:12 },
  label: { color:'#fff', marginBottom:4, fontWeight:'bold' },
  input: {
    backgroundColor:'#fff', borderRadius:4, padding:8, height:40
  },
  fileBtn: {
    backgroundColor:'#4CAF50', padding:10, borderRadius:4, alignItems:'center', marginBottom:12
  },
  fileBtnText: { color:'#fff', fontWeight:'bold' },
  buttons: { flexDirection:'row', justifyContent:'space-between' },
  closeBtn: {
    backgroundColor:'#888', padding:10, borderRadius:4
  },
  saveBtn: {
    backgroundColor:'#ffd369', padding:10, borderRadius:4
  },
  deleteBtn: {
    backgroundColor:'#ff4d4d', padding:10, borderRadius:4
  },
  btnText: { color:'#222831', fontWeight:'bold' }
});
