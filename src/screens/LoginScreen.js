import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validateCPFCNPJ, formatCPFCNPJ } from '../utils/validation';
import { authService } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpfCnpjError, setCpfCnpjError] = useState('');

  const handleCpfCnpjChange = (text) => {
    const formatted = formatCPFCNPJ(text);
    setCpfCnpj(formatted);
    
    if (text.length > 0) {
      const isValid = validateCPFCNPJ(text);
      setCpfCnpjError(isValid ? '' : 'CPF/CNPJ inválido');
    } else {
      setCpfCnpjError('');
    }
  };

  const handleLogin = async () => {
    if (!cpfCnpj) {
      Alert.alert('Erro', 'Por favor, insira seu CPF ou CNPJ.');
      return;
    }

    if (cpfCnpjError) {
      Alert.alert('Erro', 'Por favor, insira um CPF/CNPJ válido.');
      return;
    }

    setLoading(true);

    try {
      const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
      const response = await authService.login(cleanCpfCnpj);
      
      if (response.success) {
        // Mostrar mensagem diferente se estiver em modo offline
        if (response.message && response.message.includes('offline')) {
          Alert.alert(
            'Modo Offline',
            'Conectando em modo offline. Algumas funcionalidades podem estar limitadas.',
            [
              {
                text: 'Continuar',
                onPress: () => navigation.replace('Dashboard')
              }
            ]
          );
        } else {
          navigation.replace('Dashboard');
        }
      } else {
        Alert.alert('Erro', response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar com o servidor. O aplicativo funcionará em modo offline.',
        [
          {
            text: 'Continuar Offline',
            onPress: () => navigation.replace('Dashboard')
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={['#A020F0', '#8B1FA9']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Title style={styles.title}>Conexão Net Telecom</Title>
            <Paragraph style={styles.subtitle}>
              Acesse suas faturas de forma rápida e segura
            </Paragraph>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Login</Title>
              
              <TextInput
                label="CPF ou CNPJ"
                value={cpfCnpj}
                onChangeText={handleCpfCnpjChange}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
                maxLength={18}
                error={!!cpfCnpjError}
                disabled={loading}
              />
              {cpfCnpjError ? (
                <Text style={styles.errorText}>{cpfCnpjError}</Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                disabled={loading || !cpfCnpj || !!cpfCnpjError}
                loading={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Digite seu CPF ou CNPJ para acessar o sistema
            </Text>
            <Text style={styles.offlineText}>
              Funciona mesmo sem conexão com a internet
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  gradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 4,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#A020F0',
  },
  input: {
    marginBottom: 15,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#A020F0',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
  },
  offlineText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 