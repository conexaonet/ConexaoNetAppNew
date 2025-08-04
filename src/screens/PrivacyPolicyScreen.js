import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacyPolicyScreen = ({ navigation }) => {
  const openEmail = () => {
    Linking.openURL('mailto:privacidade@conexaonet.com.br');
  };

  const openANPD = () => {
    Linking.openURL('https://www.gov.br/anpd');
  };

  const openWebVersion = () => {
    // Substitua 'seu-usuario' pelo seu nome de usuário do GitHub
    Linking.openURL('https://seu-usuario.github.io/ConexaoNetAppNew');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#A020F0', '#8A2BE2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdate}>Última atualização: Janeiro de 2025</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introdução</Text>
          <Text style={styles.paragraph}>
            A Conexão Net ("nós", "nosso", "nossa") respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você utiliza nosso aplicativo ConexaoNetAppNew.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Informações que Coletamos</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Informações de Identificação Pessoal</Text>
          <Text style={styles.bulletPoint}>• CPF/CNPJ: Para autenticação e identificação do cliente</Text>
          <Text style={styles.bulletPoint}>• Nome do Cliente: Obtido através de nossos sistemas</Text>
          <Text style={styles.bulletPoint}>• Endereço de E-mail: Gerado automaticamente para fins de identificação</Text>

          <Text style={styles.subsectionTitle}>2.2 Informações de Contrato e Serviços</Text>
          <Text style={styles.bulletPoint}>• Número do Contrato: Para identificação dos serviços contratados</Text>
          <Text style={styles.bulletPoint}>• Endereço de Instalação: Local onde o serviço está instalado</Text>
          <Text style={styles.bulletPoint}>• Status do Contrato: Se está ativo ou inativo</Text>

          <Text style={styles.subsectionTitle}>2.3 Informações de Faturamento</Text>
          <Text style={styles.bulletPoint}>• Número da Fatura: Identificação única da fatura</Text>
          <Text style={styles.bulletPoint}>• Valor: Valor a ser pago</Text>
          <Text style={styles.bulletPoint}>• Data de Vencimento: Data limite para pagamento</Text>
          <Text style={styles.bulletPoint}>• Status do Pagamento: Se está pago, em aberto ou vencido</Text>
          <Text style={styles.bulletPoint}>• Código de Barras: Para pagamento via boleto</Text>
          <Text style={styles.bulletPoint}>• Código PIX: Para pagamento via PIX</Text>
          <Text style={styles.bulletPoint}>• Linha Digitável: Para pagamento via boleto</Text>

          <Text style={styles.subsectionTitle}>2.4 Informações de Configuração de WiFi</Text>
          <Text style={styles.bulletPoint}>• Nome da Rede WiFi (SSID): Nome da rede sem fio</Text>
          <Text style={styles.bulletPoint}>• Senha da Rede WiFi: Senha de acesso à rede</Text>
          <Text style={styles.bulletPoint}>• Tipo de Rede: 2.4GHz ou 5GHz</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Como Usamos Suas Informações</Text>
          
          <Text style={styles.subsectionTitle}>3.1 Fornecimento de Serviços</Text>
          <Text style={styles.bulletPoint}>• Autenticação e identificação do cliente</Text>
          <Text style={styles.bulletPoint}>• Exibição de faturas e informações de pagamento</Text>
          <Text style={styles.bulletPoint}>• Configuração e gerenciamento de redes WiFi</Text>
          <Text style={styles.bulletPoint}>• Atualização de dados de contrato</Text>

          <Text style={styles.subsectionTitle}>3.2 Comunicação</Text>
          <Text style={styles.bulletPoint}>• Notificações sobre faturas vencidas</Text>
          <Text style={styles.bulletPoint}>• Alertas de manutenção programada</Text>
          <Text style={styles.bulletPoint}>• Informações sobre novos serviços</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Compartilhamento de Informações</Text>
          
          <Text style={styles.subsectionTitle}>4.1 Não Vendemos Suas Informações</Text>
          <Text style={styles.paragraph}>
            Não vendemos, alugamos ou comercializamos suas informações pessoais com terceiros.
          </Text>

          <Text style={styles.subsectionTitle}>4.2 Compartilhamento Autorizado</Text>
          <Text style={styles.paragraph}>
            Podemos compartilhar suas informações apenas nas seguintes situações:
          </Text>
          <Text style={styles.bulletPoint}>• Com sua autorização explícita</Text>
          <Text style={styles.bulletPoint}>• Prestadores de serviços essenciais (processamento de pagamentos, hospedagem)</Text>
          <Text style={styles.bulletPoint}>• Obrigações legais (quando exigido por lei)</Text>
          <Text style={styles.bulletPoint}>• Proteção de direitos (para proteger nossos direitos e segurança)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Armazenamento e Segurança</Text>
          
          <Text style={styles.subsectionTitle}>5.1 Armazenamento Local</Text>
          <Text style={styles.bulletPoint}>• Dados de login são armazenados localmente no dispositivo</Text>
          <Text style={styles.bulletPoint}>• Informações de sessão são mantidas temporariamente</Text>

          <Text style={styles.subsectionTitle}>5.2 Armazenamento em Nuvem</Text>
          <Text style={styles.bulletPoint}>• Dados são armazenados em servidores seguros</Text>
          <Text style={styles.bulletPoint}>• Utilizamos criptografia para proteger informações sensíveis</Text>
          <Text style={styles.bulletPoint}>• Acesso restrito apenas a funcionários autorizados</Text>

          <Text style={styles.subsectionTitle}>5.3 Medidas de Segurança</Text>
          <Text style={styles.bulletPoint}>• Criptografia de dados em trânsito e em repouso</Text>
          <Text style={styles.bulletPoint}>• Autenticação de dois fatores quando aplicável</Text>
          <Text style={styles.bulletPoint}>• Monitoramento contínuo de segurança</Text>
          <Text style={styles.bulletPoint}>• Atualizações regulares de segurança</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
          
          <Text style={styles.subsectionTitle}>6.1 Acesso e Correção</Text>
          <Text style={styles.paragraph}>Você tem o direito de:</Text>
          <Text style={styles.bulletPoint}>• Acessar suas informações pessoais</Text>
          <Text style={styles.bulletPoint}>• Corrigir dados incorretos</Text>
          <Text style={styles.bulletPoint}>• Solicitar exclusão de dados (quando permitido por lei)</Text>

          <Text style={styles.subsectionTitle}>6.2 Portabilidade</Text>
          <Text style={styles.bulletPoint}>• Solicitar uma cópia de seus dados em formato legível</Text>
          <Text style={styles.bulletPoint}>• Transferir dados para outro provedor de serviços</Text>

          <Text style={styles.subsectionTitle}>6.3 Revogação de Consentimento</Text>
          <Text style={styles.bulletPoint}>• Revogar consentimento para uso de dados</Text>
          <Text style={styles.bulletPoint}>• Cancelar assinatura de comunicações</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Retenção de Dados</Text>
          
          <Text style={styles.subsectionTitle}>7.1 Período de Retenção</Text>
          <Text style={styles.bulletPoint}>• Dados de Contrato: Mantidos durante a vigência do contrato + 5 anos</Text>
          <Text style={styles.bulletPoint}>• Dados de Faturamento: Mantidos por 5 anos (obrigação legal)</Text>
          <Text style={styles.bulletPoint}>• Logs de Acesso: Mantidos por 2 anos</Text>
          <Text style={styles.bulletPoint}>• Dados de WiFi: Mantidos durante a vigência do contrato</Text>

          <Text style={styles.subsectionTitle}>7.2 Exclusão</Text>
          <Text style={styles.bulletPoint}>• Dados são excluídos automaticamente após o período de retenção</Text>
          <Text style={styles.bulletPoint}>• Você pode solicitar exclusão antecipada (quando permitido)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Cookies e Tecnologias Similares</Text>
          
          <Text style={styles.subsectionTitle}>8.1 Uso de Cookies</Text>
          <Text style={styles.bulletPoint}>• Utilizamos cookies para melhorar a experiência</Text>
          <Text style={styles.bulletPoint}>• Cookies essenciais para funcionamento do aplicativo</Text>
          <Text style={styles.bulletPoint}>• Cookies de análise para entender o uso</Text>

          <Text style={styles.subsectionTitle}>8.2 Controle de Cookies</Text>
          <Text style={styles.bulletPoint}>• Você pode desativar cookies nas configurações do dispositivo</Text>
          <Text style={styles.bulletPoint}>• Algumas funcionalidades podem ser afetadas</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Menores de Idade</Text>
          
          <Text style={styles.subsectionTitle}>9.1 Proteção de Menores</Text>
          <Text style={styles.bulletPoint}>• Nosso aplicativo não é destinado a menores de 18 anos</Text>
          <Text style={styles.bulletPoint}>• Não coletamos intencionalmente dados de menores</Text>
          <Text style={styles.bulletPoint}>• Se descobrirmos dados de menores, os excluiremos imediatamente</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Transferências Internacionais</Text>
          
          <Text style={styles.subsectionTitle}>10.1 Armazenamento</Text>
          <Text style={styles.bulletPoint}>• Dados são armazenados no Brasil</Text>
          <Text style={styles.bulletPoint}>• Podemos transferir dados para outros países quando necessário</Text>
          <Text style={styles.bulletPoint}>• Sempre com proteções adequadas de segurança</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Alterações na Política</Text>
          
          <Text style={styles.subsectionTitle}>11.1 Notificação de Mudanças</Text>
          <Text style={styles.bulletPoint}>• Notificaremos sobre mudanças significativas</Text>
          <Text style={styles.bulletPoint}>• Atualizaremos a data de "última atualização"</Text>
          <Text style={styles.bulletPoint}>• Continuar usando o app significa aceitar as mudanças</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contato</Text>
          
          <Text style={styles.subsectionTitle}>12.1 Versão Web</Text>
          <Text style={styles.paragraph}>
            Para uma versão mais detalhada e melhor formatada:
          </Text>
          
          <TouchableOpacity onPress={openWebVersion} style={styles.contactItem}>
            <Text style={styles.contactLabel}>Website:</Text>
            <Text style={styles.contactValue}>Ver Política de Privacidade Online</Text>
          </TouchableOpacity>
          
          <Text style={styles.subsectionTitle}>12.2 Dúvidas e Solicitações</Text>
          <Text style={styles.paragraph}>
            Para dúvidas sobre esta política ou exercer seus direitos:
          </Text>
          
          <TouchableOpacity onPress={openEmail} style={styles.contactItem}>
            <Text style={styles.contactLabel}>E-mail:</Text>
            <Text style={styles.contactValue}>privacidade@conexaonet.com.br</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Telefone:</Text>
            <Text style={styles.contactValue}>(67) 9999-9999</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Endereço:</Text>
            <Text style={styles.contactValue}>Rua Exemplo, 123 - Campo Grande/MS - CEP: 79000-000</Text>
          </View>

          <Text style={styles.subsectionTitle}>12.3 Autoridade Nacional de Proteção de Dados (ANPD)</Text>
          <Text style={styles.paragraph}>
            Se não ficar satisfeito com nossa resposta, você pode contatar a ANPD:
          </Text>
          
          <TouchableOpacity onPress={openANPD} style={styles.contactItem}>
            <Text style={styles.contactLabel}>Website:</Text>
            <Text style={styles.contactValue}>www.gov.br/anpd</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>E-mail:</Text>
            <Text style={styles.contactValue}>dp@anpd.gov.br</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Disposições Finais</Text>
          
          <Text style={styles.subsectionTitle}>13.1 Lei Aplicável</Text>
          <Text style={styles.paragraph}>
            Esta política é regida pelas leis brasileiras, especialmente a Lei Geral de Proteção de Dados (LGPD).
          </Text>

          <Text style={styles.subsectionTitle}>13.2 Aceitação</Text>
          <Text style={styles.paragraph}>
            Ao usar nosso aplicativo, você concorda com esta Política de Privacidade.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.footerBold}>Conexão Net</Text>{'\n'}
            Campo Grande - MS, Brasil
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  lastUpdate: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A020F0',
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 5,
    paddingLeft: 10,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A020F0',
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerBold: {
    fontWeight: 'bold',
    color: '#A020F0',
  },
});

export default PrivacyPolicyScreen; 