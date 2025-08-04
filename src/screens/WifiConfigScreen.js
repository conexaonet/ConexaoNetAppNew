import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, TextInput, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { wifiService } from '../services/api';

const WifiConfigScreen = ({ navigation, route }) => {
  const { contract } = route.params;
  const [wifiConfig, setWifiConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para os campos de edição
  const [editMode, setEditMode] = useState(false);
  const [ssid24g, setSsid24g] = useState('');
  const [password24g, setPassword24g] = useState('');
  const [ssid5g, setSsid5g] = useState('');
  const [password5g, setPassword5g] = useState('');
  const [showPassword24g, setShowPassword24g] = useState(false);
  const [showPassword5g, setShowPassword5g] = useState(false);

  useEffect(() => {
    loadWifiConfig();
  }, []);

  const loadWifiConfig = async () => {
    try {
      setLoading(true);
      const config = await wifiService.getWifiConfig(contract.id);
      setWifiConfig(config);
      
      // Preencher campos de edição com valores atuais
      const wifi24g = config.interfaces.find(i => i.key === '1-1');
      const wifi5g = config.interfaces.find(i => i.key === '1-5');
      
      setSsid24g(wifi24g?.ssid || '');
      setPassword24g(wifi24g?.password || '');
      setSsid5g(wifi5g?.ssid || '');
      setPassword5g(wifi5g?.password || '');
    } catch (error) {
      console.error('Erro ao carregar configurações de WiFi:', error);
      // Não mostrar alerta de erro, pois o serviço já retorna dados simulados
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWifiConfig();
    setRefreshing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validar campos obrigatórios
      if (!ssid24g.trim() || !password24g.trim()) {
        Alert.alert('Erro', 'Nome e senha do WiFi 2.4GHz são obrigatórios.');
        return;
      }
      
      if (!ssid5g.trim() || !password5g.trim()) {
        Alert.alert('Erro', 'Nome e senha do WiFi 5GHz são obrigatórios.');
        return;
      }
      
      // Validar tamanho mínimo da senha
      if (password24g.length < 8) {
        Alert.alert('Erro', 'A senha do WiFi 2.4GHz deve ter pelo menos 8 caracteres.');
        return;
      }
      
      if (password5g.length < 8) {
        Alert.alert('Erro', 'A senha do WiFi 5GHz deve ter pelo menos 8 caracteres.');
        return;
      }
      
      const wifiData = {
        ssid24g: ssid24g.trim(),
        password24g: password24g.trim(),
        ssid5g: ssid5g.trim(),
        password5g: password5g.trim()
      };
      
      await wifiService.updateWifiConfig(contract.id, wifiData);
      
      Alert.alert(
        'Sucesso',
        'Configurações de WiFi atualizadas com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              setEditMode(false);
              loadWifiConfig();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Não foi possível atualizar as configurações de WiFi.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originais
    const wifi24g = wifiConfig?.interfaces.find(i => i.key === '1-1');
    const wifi5g = wifiConfig?.interfaces.find(i => i.key === '1-5');
    
    setSsid24g(wifi24g?.ssid || '');
    setPassword24g(wifi24g?.password || '');
    setSsid5g(wifi5g?.ssid || '');
    setPassword5g(wifi5g?.password || '');
    setEditMode(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A020F0" />
        <Text style={styles.loadingText}>Carregando configurações...</Text>
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
          <Title style={styles.headerTitle}>Configurações WiFi</Title>
          <Paragraph style={styles.headerSubtitle}>
            Contrato: {contract.name}
          </Paragraph>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Redes WiFi</Title>
            <Button
              mode={editMode ? "outlined" : "contained"}
              onPress={() => setEditMode(!editMode)}
              style={styles.editButton}
              disabled={saving}
            >
              {editMode ? 'Cancelar' : 'Editar'}
            </Button>
          </View>
          <Paragraph style={styles.sectionSubtitle}>
            Gerencie o nome e senha das suas redes WiFi
          </Paragraph>
        </View>

        {/* WiFi 2.4GHz */}
        <Card style={styles.wifiCard}>
          <Card.Content>
            <View style={styles.wifiHeader}>
              <Title style={styles.wifiTitle}>WiFi 2.4GHz</Title>
              <Text style={styles.wifiType}>Rede 2.4GHz</Text>
            </View>
            
            {editMode ? (
              <View style={styles.editFields}>
                <TextInput
                  label="Nome da rede (SSID)"
                  value={ssid24g}
                  onChangeText={setSsid24g}
                  mode="outlined"
                  style={styles.input}
                  maxLength={32}
                />
                <TextInput
                  label="Senha"
                  value={password24g}
                  onChangeText={setPassword24g}
                  mode="outlined"
                  secureTextEntry={!showPassword24g}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon={showPassword24g ? "eye-off" : "eye"}
                      onPress={() => setShowPassword24g(!showPassword24g)}
                    />
                  }
                  maxLength={64}
                />
              </View>
            ) : (
              <View style={styles.infoFields}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nome da rede:</Text>
                  <Text style={styles.infoValue}>{wifiConfig?.interfaces.find(i => i.key === '1-1')?.ssid || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Senha:</Text>
                  <Text style={styles.infoValue}>••••••••</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* WiFi 5GHz */}
        <Card style={styles.wifiCard}>
          <Card.Content>
            <View style={styles.wifiHeader}>
              <Title style={styles.wifiTitle}>WiFi 5GHz</Title>
              <Text style={styles.wifiType}>Rede 5GHz</Text>
            </View>
            
            {editMode ? (
              <View style={styles.editFields}>
                <TextInput
                  label="Nome da rede (SSID)"
                  value={ssid5g}
                  onChangeText={setSsid5g}
                  mode="outlined"
                  style={styles.input}
                  maxLength={32}
                />
                <TextInput
                  label="Senha"
                  value={password5g}
                  onChangeText={setPassword5g}
                  mode="outlined"
                  secureTextEntry={!showPassword5g}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      icon={showPassword5g ? "eye-off" : "eye"}
                      onPress={() => setShowPassword5g(!showPassword5g)}
                    />
                  }
                  maxLength={64}
                />
              </View>
            ) : (
              <View style={styles.infoFields}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nome da rede:</Text>
                  <Text style={styles.infoValue}>{wifiConfig?.interfaces.find(i => i.key === '1-5')?.ssid || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Senha:</Text>
                  <Text style={styles.infoValue}>••••••••</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {editMode && (
          <View style={styles.saveSection}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              loading={saving}
              disabled={saving}
            >
              Salvar Alterações
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancelar
            </Button>
          </View>
        )}

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoCardTitle}>Informações Importantes</Title>
              <Paragraph style={styles.infoCardText}>
                • A senha deve ter pelo menos 8 caracteres{'\n'}
                • O nome da rede deve ter entre 1 e 32 caracteres{'\n'}
                • Após salvar, pode levar alguns minutos para as alterações serem aplicadas{'\n'}
                • Recomendamos usar senhas fortes com letras, números e símbolos
              </Paragraph>
            </Card.Content>
          </Card>
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
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#A020F0',
  },
  wifiCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 4,
  },
  wifiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  wifiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A020F0',
  },
  wifiType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editFields: {
    gap: 15,
  },
  input: {
    backgroundColor: 'white',
  },
  infoFields: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  saveSection: {
    padding: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#A020F0',
  },
  cancelButton: {
    borderColor: '#666',
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default WifiConfigScreen; 