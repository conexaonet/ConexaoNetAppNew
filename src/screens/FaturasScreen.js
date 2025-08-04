import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { invoiceService } from '../services/api';

const FaturasScreen = ({ navigation, route }) => {
  const { contract } = route.params;
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const invoicesData = await invoiceService.getInvoices(contract.id);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as faturas.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInvoices();
    setRefreshing(false);
  };

  const handleInvoicePress = (invoice) => {
    navigation.navigate('FaturaDetail', { invoice });
  };

  const getStatusColor = (status, dueDate) => {
    switch (status?.toLowerCase()) {
      case 'pago':
      case 'paid':
        return '#4CAF50';
      case 'vencido':
      case 'overdue':
        // Verificar se está vencida há mais de 1 dia
        if (dueDate) {
          const today = new Date();
          const due = new Date(dueDate + 'T00:00:00');
          const diffTime = today.getTime() - due.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            return '#B71C1C'; // Vermelho mais escuro para faturas vencidas há mais de 1 dia
          } else {
            return '#D32F2F'; // Vermelho normal para faturas vencidas há 1 dia ou menos
          }
        }
        return '#D32F2F'; // Vermelho para faturas vencidas
      case 'aberto':
        return '#2196F3'; // Azul para faturas em aberto
      case 'pendente':
      case 'pending':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Garantir que a data está no formato correto
    const date = new Date(dateString + 'T00:00:00');
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A020F0" />
        <Text style={styles.loadingText}>Carregando faturas...</Text>
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
          <Title style={styles.headerTitle}>Faturas</Title>
          <Paragraph style={styles.headerSubtitle}>
            {contract?.name || 'Contrato'}
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
          <Title style={styles.sectionTitle}>Lista de Faturas</Title>
          <Paragraph style={styles.sectionSubtitle}>
            {invoices.length} faturas encontradas
          </Paragraph>
        </View>

        {invoices.map((invoice) => {
          const isOverdueMoreThanOneDay = () => {
            if (invoice.dueDate) {
              const today = new Date();
              const due = new Date(invoice.dueDate + 'T00:00:00');
              const diffTime = today.getTime() - due.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              

              
              return diffDays > 1;
            }
            return false;
          };

          const isOverdue = () => {
            if (invoice.dueDate) {
              const today = new Date();
              const due = new Date(invoice.dueDate + 'T00:00:00');
              const diffTime = today.getTime() - due.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays > 0;
            }
            return false;
          };

          return (
            <Card
              key={invoice.id}
              style={[
                styles.invoiceCard,
                (invoice.status?.toLowerCase() === 'vencido' || isOverdue()) && styles.overdueCard,
                isOverdueMoreThanOneDay() && styles.criticalOverdueCard
              ]}
              onPress={() => handleInvoicePress(invoice)}
            >
            <Card.Content>
              <View style={styles.invoiceHeader}>
                <Title style={[
                  styles.invoiceTitle,
                  isOverdueMoreThanOneDay() && styles.criticalTitle
                ]}>
                  {isOverdueMoreThanOneDay() ? '🚨 ' : ''}{invoice.invoiceNumber}
                </Title>
                                 <View
                   style={[
                     styles.statusChip,
                     { 
                       borderColor: getStatusColor(invoice.status, invoice.dueDate),
                       borderWidth: 1,
                       borderRadius: 16,
                       paddingHorizontal: 12,
                       paddingVertical: 6,
                       backgroundColor: 'transparent'
                     },
                   ]}
                 >
                   <Text style={{ color: getStatusColor(invoice.status, invoice.dueDate) }}>
                     {invoice.status}
                   </Text>
                 </View>
              </View>
              
              <Paragraph style={styles.invoiceDescription}>
                {invoice.description}
              </Paragraph>
              
              <View style={styles.invoiceDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Valor:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(invoice.amount)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vencimento:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(invoice.dueDate)}
                  </Text>
                </View>
                
                {isOverdueMoreThanOneDay() && (
                  <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                      🚨 ATENÇÃO: Fatura vencida há mais de 1 dia! 🚨
                    </Text>
                  </View>
                )}
                
                {isOverdue() && !isOverdueMoreThanOneDay() && (
                  <View style={[styles.warningContainer, { backgroundColor: '#FF9800' }]}>
                    <Text style={styles.warningText}>
                      ⚠️ ATENÇÃO: Fatura vencida! ⚠️
                    </Text>
                  </View>
                )}
              </View>
              
              <Button
                mode="contained"
                onPress={() => handleInvoicePress(invoice)}
                style={styles.viewButton}
              >
                Ver Detalhes
              </Button>
            </Card.Content>
          </Card>
        );
        })}

                 {invoices.length === 0 ? (
           <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>
               Nenhuma fatura encontrada para este contrato.
             </Text>
           </View>
         ) : null}
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
  invoiceCard: {
    margin: 15,
    marginBottom: 10,
    elevation: 4,
  },
  overdueCard: {
    backgroundColor: '#FFEBEE', // Fundo vermelho claro para faturas vencidas
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  criticalOverdueCard: {
    backgroundColor: '#FFCDD2', // Fundo vermelho mais intenso para faturas vencidas há mais de 1 dia
    borderLeftWidth: 8,
    borderLeftColor: '#B71C1C',
    borderTopWidth: 2,
    borderTopColor: '#B71C1C',
    borderRightWidth: 2,
    borderRightColor: '#B71C1C',
    borderBottomWidth: 2,
    borderBottomColor: '#B71C1C',
    elevation: 8,
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A020F0',
    flex: 1,
  },
  criticalTitle: {
    color: '#B71C1C',
    fontWeight: '900',
  },
  statusChip: {
    marginLeft: 10,
  },
  invoiceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  invoiceDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#A020F0',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  warningContainer: {
    backgroundColor: '#B71C1C',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#FF0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  warningText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default FaturasScreen; 