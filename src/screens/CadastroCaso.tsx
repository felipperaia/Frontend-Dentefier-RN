// src/screens/CadastroCaso.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getMe } from '../services/auth';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

export type RootStackParamList = { CadastroCaso: undefined };
type Navigation = NavigationProp<RootStackParamList>;

interface FormData {
  numeroCaso: string;
  titulo: string;
  dataAbertura: string;
  status: string;
  peritoResponsavel: string;
  dadosIndividuo: { nome: string; idadeEstimado: string; sexo: string };
  contexto: { tipoCaso: string; origemDemanda: string; descricao: string };
  localizacao: { lat: string; lng: string; enderecoCompleto: string };
}

export default function CadastroCaso() {
  const nav = useNavigation<Navigation>();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    numeroCaso: '',
    titulo: '',
    dataAbertura: new Date().toISOString().slice(0, 10),
    status: '',
    peritoResponsavel: '',
    dadosIndividuo: { nome: '', idadeEstimado: '', sexo: '' },
    contexto: { tipoCaso: '', origemDemanda: '', descricao: '' },
    localizacao: { lat: '', lng: '', enderecoCompleto: '' },
  });
  const [region, setRegion] = useState<Region | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    getMe().then(me => setForm(f => ({ ...f, peritoResponsavel: me.username }))).catch(() => {});
  }, []);

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Autorize o uso de localização.');
        setLoadingLocation(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude: lat, longitude: lng } = loc.coords;
      setRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 });
      const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const place = places[0] || {};
      const address = `${place.postalCode || ''} ${place.street || ''}, ${place.subregion || place.city || ''}, ${place.region || ''}, ${place.country || ''}`;
      setForm(f => ({
        ...f,
        localizacao: {
          lat: lat.toString(),
          lng: lng.toString(),
          enderecoCompleto: address,
        },
      }));
      // force rerender map
      setMapKey(k => k + 1);
    } catch {
      Alert.alert('Erro', 'Não foi possível obter localização.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const next = () => setStep(s => Math.min(s + 1, 2));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        localizacao: {
          lat: parseFloat(form.localizacao.lat),
          lng: parseFloat(form.localizacao.lng),
          enderecoCompleto: form.localizacao.enderecoCompleto,
        },
      };
      const res = await fetch('https://backend-dentefier.onrender.com/api/casos', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      Alert.alert('Sucesso', 'Caso salvo com sucesso!');
      nav.goBack();
    } catch {
      Alert.alert('Erro', 'Falha ao salvar caso.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {['Identificação', 'Dados Caso', 'Localização'].map((label, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tabBtn, step === i && styles.tabBtnActive]}
            onPress={() => setStep(i)}
          >
            <Text style={[styles.tabText, step === i && styles.tabTextActive]}>
              {`${i + 1}. ${label}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 && (
          <>
            <TextInput style={styles.input} placeholder="Número do Caso" value={form.numeroCaso} onChangeText={v => setForm(f => ({ ...f, numeroCaso: v }))} />
            <TextInput style={styles.input} placeholder="Título do Caso" value={form.titulo} onChangeText={v => setForm(f => ({ ...f, titulo: v }))} />
            <TextInput style={styles.input} placeholder="Data de Abertura" value={form.dataAbertura} onChangeText={v => setForm(f => ({ ...f, dataAbertura: v }))} />
            <Picker selectedValue={form.status} style={styles.input} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
              <Picker.Item label="Selecione Status" value="" />
              <Picker.Item label="Em andamento" value="Em andamento" />
              <Picker.Item label="Finalizado" value="Finalizado" />
              <Picker.Item label="Arquivado" value="Arquivado" />
            </Picker>
            <TextInput style={[styles.input, { backgroundColor: '#eee' }]} editable={false} value={form.peritoResponsavel} />
            <TouchableOpacity style={styles.btn} onPress={next}><Text style={styles.btnText}>Próximo ▶</Text></TouchableOpacity>
          </>
        )}
        {step === 1 && (
          <>
            <Picker selectedValue={form.contexto.tipoCaso} style={styles.input} onValueChange={v => setForm(f => ({ ...f, contexto: { ...f.contexto, tipoCaso: v } }))}>
              <Picker.Item label="Tipo de Caso" value="" />
              <Picker.Item label="Odontologia Forense" value="Odontologia Forense" />
              <Picker.Item label="Identificação Humana" value="Identificação Humana" />
              <Picker.Item label="Exame Criminal" value="Exame Criminal" />
              <Picker.Item label="Trauma" value="Trauma" />
              <Picker.Item label="Estimativa de Idade" value="Estimativa de Idade" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
            <TextInput style={styles.input} placeholder="Origem da Demanda" value={form.contexto.origemDemanda} onChangeText={v => setForm(f => ({ ...f, contexto: { ...f.contexto, origemDemanda: v } }))} />
            <TextInput style={[styles.input, { height: 100 }]} placeholder="Descrição detalhada" multiline value={form.contexto.descricao} onChangeText={v => setForm(f => ({ ...f, contexto: { ...f.contexto, descricao: v } }))} />
            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.btnSecondary} onPress={back}><Text style={styles.btnText}>◀ Anterior</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={next}><Text style={styles.btnText}>Próximo ▶</Text></TouchableOpacity>
            </View>
          </>
        )}
        {step === 2 && (
          <>
            <MapView
              key={mapKey}
              style={styles.map}
              initialRegion={region || undefined}
              onPress={e => fetchLocation()}
            >
              {region && <Marker coordinate={region} />}
            </MapView>
            <TouchableOpacity style={styles.locationBtn} onPress={fetchLocation}>
              {loadingLocation ? <ActivityIndicator color="#fff" /> : <Text style={styles.locationBtnText}>📍 Pegar Localização</Text>}
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Latitude" value={form.localizacao.lat} onChangeText={v => setForm(f => ({ ...f, localizacao: { ...f.localizacao, lat: v } }))} />
            <TextInput style={styles.input} placeholder="Longitude" value={form.localizacao.lng} onChangeText={v => setForm(f => ({ ...f, localizacao: { ...f.localizacao, lng: v } }))} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Endereço Completo" multiline value={form.localizacao.enderecoCompleto} onChangeText={v => setForm(f => ({ ...f, localizacao: { ...f.localizacao, enderecoCompleto: v } }))} />
            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.btnSecondary} onPress={back}><Text style={styles.btnText}>◀ Anterior</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleSubmit}><Text style={styles.btnText}>Salvar ✔</Text></TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
  tabBtn: { flex: 1, padding: 12, backgroundColor: '#eee' },
  tabBtnActive: { backgroundColor: '#4CAF50' },
  tabText: { textAlign: 'center', fontWeight: 'bold' },
  tabTextActive: { color: '#fff' },
  content: { padding: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 6, marginBottom: 12 },
  btn: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 4, marginTop: 8 },
  btnSecondary: { backgroundColor: '#888', padding: 12, borderRadius: 4, marginTop: 8, flex: 1 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  navBtns: { flexDirection: 'row', justifyContent: 'space-between' },
  locationBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 4, alignItems: 'center', marginBottom: 12 },
  locationBtnText: { color: '#fff', fontWeight: 'bold' },
  map: { width: '100%', height: 200, marginBottom: 12 },
});
