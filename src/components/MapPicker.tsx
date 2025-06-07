// src/components/MapPicker.tsx
import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapPickerProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string, address: string) => void;
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à localização.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude: lat, longitude: lng } = loc.coords;
      const initial: Region = { latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 };
      setRegion(initial);
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const address = `${place.postalCode || ''} ${place.street || ''}, ${place.subregion || place.city || ''}, ${place.region || ''}, ${place.country || ''}`;
      onLocationChange(lat.toString(), lng.toString(), address);
      setLoading(false);
    })();
  }, []);

  const handleMapPress = async (e: any) => {
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    setRegion(r => r ? { ...r, latitude: lat, longitude: lng } : null);
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const address = `${place.postalCode || ''} ${place.street || ''}, ${place.subregion || place.city || ''}, ${place.region || ''}, ${place.country || ''}`;
      onLocationChange(lat.toString(), lng.toString(), address);
    } catch {
      onLocationChange(lat.toString(), lng.toString(), '');
    }
  };

  if (loading || !region) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onPress={handleMapPress}
    >
      <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 250, marginBottom: 16 },
  loader: { marginVertical: 20 }
});