import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { contractService, authService } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados do usuário
      const user = await authService.getUserData();
      setUserData(user);
      
      // Carregar contratos da API
      const contractsData = await contractService.getContracts();
      setContracts(contractsData);
      
      // Verificar se está em modo offline (se não conseguiu conectar com a API)
      setIsOffline(contractsData.length > 0 && contractsData[0].name === 'Contrato Residencial');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleContractSelect = (contract) => {
    navigation.navigate('Faturas', { contract });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A020F0" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#A020F0', '#8B1FA9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Paragraph style={styles.headerSubtitle}>
            Bem-vindo
          </Paragraph>
          {userData && (
            <Text style={styles.userInfo}>
              {userData.name || 'Cliente'}
            </Text>
          )}
          {userData && (
            <Text style={styles.userCpf}>
              CPF/CNPJ: {userData.cpfCnpj || '609.716.883-70'}
            </Text>
          )}
          {isOffline && (
            <View style={styles.offlineIndicator}>
              <Text style={styles.offlineText}>🔴 Modo Offline</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Seus Contratos</Title>
          <Paragraph style={styles.sectionSubtitle}>
            Selecione um contrato para visualizar as faturas
          </Paragraph>
          {isOffline && (
            <Text style={styles.offlineNote}>
              Dados simulados - Modo offline ativo
            </Text>
          )}
        </View>

        {contracts.map((contract) => (
          <Card
            key={contract.id}
            style={styles.contractCard}
            onPress={() => handleContractSelect(contract)}
          >
            <Card.Content>
              <View style={styles.contractHeader}>
                <Title style={styles.contractTitle}>{contract.name}</Title>
                <Text style={styles.contractStatus}>{contract.status}</Text>
              </View>
              
              <Paragraph style={styles.contractNumber}>
                {contract.number}
              </Paragraph>
              
              <Paragraph style={styles.contractAddress}>
                {contract.address}
              </Paragraph>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleContractSelect(contract)}
                  style={styles.viewButton}
                >
                  Ver Faturas
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('WifiConfig', { contract })}
                  style={styles.wifiButton}
                  textColor="#A020F0"
                >
                  Configurar WiFi
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#f44336"
          >
            Sair do Aplicativo
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 10,
  },
  userInfo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userCpf: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  offlineIndicator: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  offlineNote: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 5,
  },
  contractCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 4,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A020F0',
    flex: 1,
  },
  contractStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  contractNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  contractAddress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  viewButton: {
    backgroundColor: '#A020F0',
    flex: 1,
  },
  wifiButton: {
    borderColor: '#A020F0',
    flex: 1,
  },
  logoutSection: {
    padding: 20,
    alignItems: 'center',
  },
  logoutButton: {
    borderColor: '#f44336',
  },
});

export default DashboardScreen; 