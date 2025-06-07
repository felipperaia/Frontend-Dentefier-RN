import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { login as loginService } from '../services/auth';

type Props = {
  onLoginSuccess: () => void;
};

const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const colors = theme.colors;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, insira usuário e senha.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginService(username, password);

      if (!result.success) {
        Alert.alert('Erro', result.message || 'Erro ao realizar login');
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      onLoginSuccess();
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Falha', 'Falha no login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/logo_dentefier.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.input, { borderLeftColor: colors.accent, color: colors.background }]}
          placeholder="Usuário"
          placeholderTextColor={colors.placeholder}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { borderLeftColor: colors.accent, color: colors.background }]}
          placeholder="Senha"
          placeholderTextColor={colors.placeholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.background }]}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 4,
    borderLeftWidth: 5,
    fontSize: 16,
  },
  button: {
    width: '70%',
    paddingVertical: 12,
    marginVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
