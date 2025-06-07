import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native'; // caso queira usar animação Lottie
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      // Aguarda 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.navigate('Home'); // ou a tela protegida
        } else {
          navigation.navigate('Login'); // ou a tela de autenticação
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        navigation.navigate('Login');
      }
    };

    checkTokenAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon-detenfier.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />

      {/* Se quiser usar Lottie: */}
      {/* <LottieView
        source={require('../assets/loading.json')}
        autoPlay
        loop
        style={styles.lottie}
      /> */}
    </View>
  );
};

const colors = {
  background: '#222831',
  secondary: '#393E46',
  accent: '#FFD369',
  text: '#EEEEEE',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default SplashScreen;
