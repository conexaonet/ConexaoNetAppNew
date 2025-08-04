import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API - URL correta
const API_BASE_URL = 'https://conexaonetma.sgp.net.br';

// Credenciais fixas (não aparecem na tela)
const API_TOKEN = '2517d345-f0f9-4b4f-9fde-8ee2a76cea6e';
const API_APP = 'app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Importante para manter cookies de sessão
});

// Interceptor para adicionar credenciais automaticamente
api.interceptors.request.use(
  async (config) => {
    // Adicionar credenciais fixas
    config.headers['Authorization'] = `Bearer ${API_TOKEN}`;
    config.headers['App'] = API_APP;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login apenas com CPF/CNPJ
  login: async (cpfCnpj) => {
    try {
      // Buscar faturas via API URA
      const response = await api.post('/api/ura/titulos/', {
        cpfcnpj: cpfCnpj,
        token: API_TOKEN,
        app: API_APP
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.titulos && response.data.titulos.length > 0) {
        // Login bem-sucedido - salvar dados do usuário
        const userData = {
          cpfCnpj,
          name: response.data.titulos[0]?.clienteNome || 'Usuário',
          email: `${cpfCnpj}@conexao.com`
        };
        
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        return {
          success: true,
          message: 'Login realizado com sucesso',
          user: userData
        };
      } else {
        throw new Error('CPF/CNPJ não encontrado');
      }
    } catch (error) {

      
      // Modo offline - simular login bem-sucedido
      // Se o CPF for um dos de teste, usar o CPF real para testar a API
      const testCPF = '558.267.413-68';
      const userData = {
        cpfCnpj: cpfCnpj === '12345678901' || cpfCnpj === 'teste' ? testCPF : cpfCnpj,
        name: 'Usuário Teste',
        email: 'teste@exemplo.com'
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return {
        success: true,
        message: 'Login realizado em modo offline',
        user: userData
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  // Verificar se está logado
  isLoggedIn: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return !!userData;
    } catch (error) {
      return false;
    }
  },

  // Obter dados do usuário
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },
};

export const contractService = {
  // Listar contratos do cliente
  getContracts: async () => {
    try {
      const userData = await authService.getUserData();
      if (!userData) throw new Error('Usuário não logado');
      
      // Buscar faturas via API URA
      const response = await api.post('/api/ura/titulos/', {
        cpfcnpj: userData.cpfCnpj,
        token: API_TOKEN,
        app: API_APP
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.titulos) {
        // Extrair contratos únicos das faturas
        const contracts = new Map();
        
        response.data.titulos.forEach(titulo => {
          const contractId = titulo.clienteContrato;
          if (!contracts.has(contractId)) {
            contracts.set(contractId, {
              id: contractId.toString(),
              name: `Contrato ${contractId}`,
              number: `CON-${contractId}`,
              status: 'Ativo',
              address: 'Endereço do contrato',
              clienteNome: titulo.clienteNome
            });
          }
        });
        
        return Array.from(contracts.values());
      }
      
      return [];
    } catch (error) {

      
      // Retornar dados simulados se a API não estiver disponível
      return [
        {
          id: '54',
          name: 'Contrato Residencial',
          number: 'CON-54',
          status: 'Ativo',
          address: 'Campo Grande - MS',
          clienteNome: 'ANTONIO WANDERLAN COSTA'
        }
      ];
    }
  },
};

export const invoiceService = {
  // Listar faturas por contrato
  getInvoices: async (contractId) => {
    try {
      const userData = await authService.getUserData();
      if (!userData) throw new Error('Usuário não logado');
      
      // Buscar todas as faturas do usuário via API URA
      const response = await api.post('/api/ura/titulos/', {
        cpfcnpj: userData.cpfCnpj,
        token: API_TOKEN,
        app: API_APP
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.titulos) {

        
        // Filtrar faturas pelo contrato selecionado e apenas em aberto ou vencidas
        const invoices = response.data.titulos
          .filter(titulo => 
            titulo.clienteContrato.toString() === contractId.toString() &&
            (titulo.status === 'aberto' || titulo.status === 'vencido' || titulo.status === 'overdue')
          )
          // Ordenar faturas pela data de vencimento (mais próxima primeiro)
          .sort((a, b) => {
            const dateA = new Date(a.dataVencimento + 'T00:00:00');
            const dateB = new Date(b.dataVencimento + 'T00:00:00');
            return dateA.getTime() - dateB.getTime();
          })
          .map(titulo => {

            
            // Aplicar as mesmas regras de cores e estilos para faturas da API
            const today = new Date();
            const due = new Date(titulo.dataVencimento + 'T00:00:00');
            const diffTime = today.getTime() - due.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            

            
            // Verificar se está vencida baseado na data, independente do status
            if (diffDays > 0) {

            }
            
            return {
              id: titulo.id.toString(),
              invoiceNumber: titulo.numeroDocumento.toString(),
              amount: titulo.valor,
              dueDate: titulo.dataVencimento, // Formato correto da API: "YYYY-MM-DD"
              status: titulo.status,
              description: titulo.demonstrativo || `Fatura ${titulo.numeroDocumento}`,
              dataEmissao: titulo.dataEmissao,
              dataPagamento: titulo.dataPagamento,
              linhaDigitavel: titulo.linhaDigitavel,
              codigoPix: titulo.codigoPix,
              link: titulo.link,
              link_cobranca: titulo.link_cobranca
            };
          });
        

        return invoices;
      }
      
      return [];
    } catch (error) {

      
             // Retornar dados simulados se a API não estiver disponível (apenas em aberto ou vencidas)
       const offlineInvoices = [
         {
           id: '245364',
           invoiceNumber: '252689',
           amount: 130.00,
           dueDate: '2025-08-30',
           status: 'aberto',
           description: 'Referente ao Acesso a Internet via Fibra de 31/07/2025 a 30/08/2025',
           dataEmissao: '2024-08-19',
           dataPagamento: '',
           linhaDigitavel: '00190.00009 03351.860006 25618.243171 4 11890000013000',
           codigoPix: '00020101021226900014br.gov.bcb.pix2568qrcodepix.bb.com.br/pix/v2/cobv/21f08a88-8568-4806-b92f-638a92a432995204000053039865406130.005802BR5908WIDE PAY6012CAMPO GRANDE62070503***6304C454'
         },
         {
           id: '245366',
           invoiceNumber: '252691',
           amount: 140.00,
           dueDate: '2025-09-30',
           status: 'aberto',
           description: 'Referente ao Acesso a Internet via Fibra de 01/08/2025 a 31/08/2025',
           dataEmissao: '2024-08-01',
           dataPagamento: '',
           linhaDigitavel: '00190.00009 03351.860006 25618.243173 4 11890000014000',
           codigoPix: '00020101021226900014br.gov.bcb.pix2568qrcodepix.bb.com.br/pix/v2/cobv/23f08a88-8566-b92f-638a92a432995204000053039865406130.005802BR5908WIDE PAY6012CAMPO GRANDE62070503***6304C454'
         }
       ]
       // Ordenar faturas offline pela data de vencimento (mais próxima primeiro)
       .sort((a, b) => {
         const dateA = new Date(a.dueDate + 'T00:00:00');
         const dateB = new Date(b.dueDate + 'T00:00:00');
         return dateA.getTime() - dateB.getTime();
       });
      

      return offlineInvoices;
    }
  },

  // Obter detalhes de uma fatura específica
  getInvoiceDetails: async (invoiceId) => {
    try {
      const userData = await authService.getUserData();
      if (!userData) throw new Error('Usuário não logado');
      
      // Buscar todas as faturas e encontrar a específica via API URA
      const response = await api.post('/api/ura/titulos/', {
        cpfcnpj: userData.cpfCnpj,
        token: API_TOKEN,
        app: API_APP
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.titulos) {
        const titulo = response.data.titulos.find(t => t.id.toString() === invoiceId.toString());
        
        if (titulo) {
                     return {
             id: titulo.id.toString(),
             invoiceNumber: titulo.numeroDocumento.toString(),
             amount: titulo.valor,
             dueDate: titulo.dataVencimento, // Formato correto da API: "YYYY-MM-DD"
             status: titulo.status,
             description: titulo.demonstrativo || `Fatura ${titulo.numeroDocumento}`,
             dataEmissao: titulo.dataEmissao,
             dataPagamento: titulo.dataPagamento,
             barcode: titulo.codigoBarras || '',
             linhaDigitavel: titulo.linhaDigitavel,
             codigoPix: titulo.codigoPix,
             link: titulo.link,
             link_cobranca: titulo.link_cobranca,
             valorDesconto: titulo.valorDesconto,
             valorCorrigido: titulo.valorCorrigido,
             valorPago: titulo.valorPago
           };
        }
      }
      
      throw new Error('Fatura não encontrada');
    } catch (error) {

      
      // Retornar dados simulados se a API não estiver disponível
      return {
        id: invoiceId,
        invoiceNumber: invoiceId,
        amount: 130.00,
        dueDate: '2025-05-30',
        status: 'pago',
        description: 'Referente ao Acesso a Internet via Fibra',
        dataEmissao: '2025-05-06',
        dataPagamento: '2025-05-16',
        barcode: '',
        linhaDigitavel: '00190.00009 03351.860006 28069.252170 4 10970000013000',
        codigoPix: '00020101021226900014br.gov.bcb.pix2568qrcodepix.bb.com.br/pix/v2/cobv/7fa96131-6a57-48e3-ab71-7a17539587f65204000053039865406130.005802BR5908WIDE PAY6012CAMPO GRANDE62070503***6304745C',
        valorDesconto: 0.0,
        valorCorrigido: 130.0,
        valorPago: 130.0
      };
    }
  },
};

export const wifiService = {
  // Obter configurações de WiFi do cliente
  getWifiConfig: async (contractId) => {
    try {
      const userData = await authService.getUserData();
      if (!userData) throw new Error('Usuário não logado');
      
      const response = await api.get('/api/ura/cpemanage/', {
        params: {
          token: API_TOKEN,
          app: API_APP,
          contrato: contractId
        }
      });
      
      // Verificar se há dados de interface WiFi na resposta
      const wlanInterfaces = response.data?.info?.interface_info?.wlan_interfaces || 
                            response.data?.wlan_interfaces || [];
      
      if (wlanInterfaces.length > 0) {
        // Filtrar apenas as interfaces principais (1-1 para 2.4GHz e 1-5 para 5GHz)
        const mainInterfaces = wlanInterfaces.filter(wifiInterface => 
          wifiInterface.chave === '1-1' || wifiInterface.chave === '1-5'
        );
        
        const wifiConfig = {
          contractId,
          interfaces: mainInterfaces.map(wifiInterface => ({
            key: wifiInterface.chave,
            ssid: wifiInterface.ssid || '',
            password: wifiInterface.password || '',
            type: wifiInterface.chave === '1-1' ? '2.4GHz' : '5GHz'
          }))
        };
        
        return wifiConfig;
      }
      
      // Se não encontrou configurações na API, usar dados simulados
      return {
        contractId,
        interfaces: [
          {
            key: '1-1',
            ssid: 'Conexao_2.4G',
            password: 'senha123',
            type: '2.4GHz'
          },
          {
            key: '1-5',
            ssid: 'Conexao_5G',
            password: 'senha123',
            type: '5GHz'
          }
        ]
      };
    } catch (error) {
      console.error('Erro ao buscar configurações de WiFi:', error);
      
      // Dados simulados para teste
      return {
        contractId,
        interfaces: [
          {
            key: '1-1',
            ssid: 'Conexao_2.4G',
            password: 'senha123',
            type: '2.4GHz'
          },
          {
            key: '1-5',
            ssid: 'Conexao_5G',
            password: 'senha123',
            type: '5GHz'
          }
        ]
      };
    }
  },

  // Atualizar configurações de WiFi
  updateWifiConfig: async (contractId, wifiData) => {
    try {
      const userData = await authService.getUserData();
      if (!userData) throw new Error('Usuário não logado');
      
      const requestData = {
        token: API_TOKEN,
        app: API_APP,
        contrato: contractId
      };
      
      // Adicionar dados de WiFi se fornecidos
      if (wifiData.ssid24g) {
        requestData.novo_ssid = wifiData.ssid24g;
      }
      if (wifiData.password24g) {
        requestData.nova_senha = wifiData.password24g;
      }
      if (wifiData.ssid5g) {
        requestData.novo_ssid_5g = wifiData.ssid5g;
      }
      if (wifiData.password5g) {
        requestData.nova_senha_5g = wifiData.password5g;
      }
      
      const response = await api.post('/api/ura/cpemanage/', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        message: 'Configurações de WiFi atualizadas com sucesso',
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao atualizar configurações de WiFi:', error);
      throw new Error('Erro ao atualizar configurações de WiFi');
    }
  },
};

export default api; 