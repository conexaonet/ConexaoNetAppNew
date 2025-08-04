import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { invoiceService } from '../services/api';

const FaturaDetailScreen = ({ navigation, route }) => {
  const { invoice } = route.params;
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoiceDetails();
  }, []);

  const loadInvoiceDetails = async () => {
    try {
      setLoading(true);
      const details = await invoiceService.getInvoiceDetails(invoice.id);
      setInvoiceDetails(details);
    } catch (error) {
      console.error('Erro ao carregar detalhes da fatura:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da fatura.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Sucesso', `${label} copiado para a área de transferência!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar para a área de transferência.');
    }
  };

  const shareInvoice = async () => {
    try {
      const shareMessage = `Fatura: ${invoiceDetails?.invoiceNumber}\nValor: ${formatCurrency(invoiceDetails?.amount)}\nVencimento: ${formatDate(invoiceDetails?.dueDate)}`;
      
      await Share.share({
        message: shareMessage,
        title: 'Detalhes da Fatura',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a fatura.');
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
          
          console.log(`Fatura vencida - Status: ${status}, DueDate: ${dueDate}, DiffDays: ${diffDays}`);
          
          if (diffDays > 1) {
            console.log(`Aplicando cor vermelha escura (#B71C1C) para fatura vencida há ${diffDays} dias`);
            return '#B71C1C'; // Vermelho mais escuro para faturas vencidas há mais de 1 dia
          } else {
            console.log(`Aplicando cor vermelha normal (#D32F2F) para fatura vencida há ${diffDays} dias`);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Detalhes da Fatura</Title>
          <Text style={styles.headerSubtitle}>
            {invoiceDetails?.invoiceNumber || invoice?.invoiceNumber}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Card style={[
          styles.mainCard,
          (invoiceDetails?.status || invoice?.status)?.toLowerCase() === 'vencido' && styles.overdueCard
        ]}>
          <Card.Content>
            <View style={styles.invoiceHeader}>
              <Title style={styles.invoiceTitle}>
                {invoiceDetails?.invoiceNumber || invoice?.invoiceNumber}
              </Title>
                             <View
                 style={[
                   styles.statusChip,
                   { 
                     borderColor: getStatusColor(invoiceDetails?.status || invoice?.status, invoiceDetails?.dueDate || invoice?.dueDate),
                     borderWidth: 1,
                     borderRadius: 16,
                     paddingHorizontal: 12,
                     paddingVertical: 6,
                     backgroundColor: 'transparent'
                   },
                 ]}
               >
                 <Text style={{ color: getStatusColor(invoiceDetails?.status || invoice?.status, invoiceDetails?.dueDate || invoice?.dueDate) }}>
                   {invoiceDetails?.status || invoice?.status}
                 </Text>
               </View>
            </View>

            <Text style={styles.invoiceDescription}>
              {invoiceDetails?.description || invoice?.description}
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.detailsSection}>
              <Title style={styles.sectionTitle}>Informações da Fatura</Title>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Valor Original:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(invoiceDetails?.amount || invoice?.amount)}
                </Text>
              </View>

                             {invoiceDetails?.valorCorrigido && invoiceDetails.valorCorrigido !== invoiceDetails?.amount ? (
                 <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Valor Corrigido:</Text>
                   <Text style={styles.detailValue}>
                     {formatCurrency(invoiceDetails.valorCorrigido)}
                   </Text>
                 </View>
               ) : null}

                             {invoiceDetails?.valorDesconto && invoiceDetails.valorDesconto > 0 ? (
                 <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Desconto:</Text>
                   <Text style={styles.detailValue}>
                     {formatCurrency(invoiceDetails.valorDesconto)}
                   </Text>
                 </View>
               ) : null}

                             {invoiceDetails?.valorPago && invoiceDetails.valorPago > 0 ? (
                 <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Valor Pago:</Text>
                   <Text style={styles.detailValue}>
                     {formatCurrency(invoiceDetails.valorPago)}
                   </Text>
                 </View>
               ) : null}
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Data de Emissão:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoiceDetails?.dataEmissao || invoice?.dataEmissao)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vencimento:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoiceDetails?.dueDate || invoice?.dueDate)}
                </Text>
              </View>

                             {invoiceDetails?.dataPagamento ? (
                 <View style={styles.detailRow}>
                   <Text style={styles.detailLabel}>Data de Pagamento:</Text>
                   <Text style={styles.detailValue}>
                     {formatDate(invoiceDetails.dataPagamento)}
                   </Text>
                 </View>
               ) : null}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.paymentSection}>
              <Title style={styles.sectionTitle}>Formas de Pagamento</Title>
              
                             {invoiceDetails?.linhaDigitavel ? (
                 <Card style={styles.paymentCard}>
                   <Card.Content>
                     <Title style={styles.paymentTitle}>Linha Digitável</Title>
                     <Text style={styles.paymentCode}>
                       {invoiceDetails.linhaDigitavel}
                     </Text>
                     <Button
                       mode="outlined"
                       onPress={() => copyToClipboard(invoiceDetails.linhaDigitavel, 'Linha digitável')}
                       style={styles.copyButton}
                     >
                       Copiar Linha Digitável
                     </Button>
                   </Card.Content>
                 </Card>
               ) : null}

                             {invoiceDetails?.codigoPix ? (
                 <Card style={styles.paymentCard}>
                   <Card.Content>
                     <Title style={styles.paymentTitle}>PIX</Title>
                     <Text style={styles.paymentCode}>
                       {invoiceDetails.codigoPix}
                     </Text>
                     <Button
                       mode="outlined"
                       onPress={() => copyToClipboard(invoiceDetails.codigoPix, 'Código PIX')}
                       style={styles.copyButton}
                     >
                       Copiar Código PIX
                     </Button>
                   </Card.Content>
                 </Card>
               ) : null}

                             {invoiceDetails?.barcode && invoiceDetails.barcode.trim() !== '' ? (
                 <Card style={styles.paymentCard}>
                   <Card.Content>
                     <Title style={styles.paymentTitle}>Código de Barras</Title>
                     <Text style={styles.paymentCode}>
                       {invoiceDetails.barcode}
                     </Text>
                     <Button
                       mode="outlined"
                       onPress={() => copyToClipboard(invoiceDetails.barcode, 'Código de barras')}
                       style={styles.copyButton}
                     >
                       Copiar Código de Barras
                     </Button>
                   </Card.Content>
                 </Card>
               ) : null}

                             {invoiceDetails?.link ? (
                 <Card style={styles.paymentCard}>
                   <Card.Content>
                     <Title style={styles.paymentTitle}>Link do Boleto</Title>
                     <Text style={styles.paymentCode}>
                       {invoiceDetails.link}
                     </Text>
                     <Button
                       mode="outlined"
                       onPress={() => copyToClipboard(invoiceDetails.link, 'Link do boleto')}
                       style={styles.copyButton}
                     >
                       Copiar Link do Boleto
                     </Button>
                   </Card.Content>
                 </Card>
               ) : null}
            </View>

            <View style={styles.actionSection}>
              <Button
                mode="contained"
                onPress={shareInvoice}
                style={styles.shareButton}
                icon="share"
              >
                Compartilhar Fatura
              </Button>
            </View>
          </Card.Content>
        </Card>
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
  mainCard: {
    margin: 15,
    elevation: 4,
  },
  overdueCard: {
    backgroundColor: '#FFEBEE', // Fundo vermelho claro para faturas vencidas
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    flex: 1,
  },
  statusChip: {
    marginLeft: 10,
  },
  invoiceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  paymentSection: {
    marginBottom: 20,
  },
  paymentCard: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  paymentCode: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  copyButton: {
    borderColor: '#2196F3',
  },
  actionSection: {
    marginTop: 20,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
});

export default FaturaDetailScreen; 