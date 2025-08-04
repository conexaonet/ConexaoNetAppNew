# Política de Privacidade - ConexaoNetAppNew

## 📋 Visão Geral

Este documento contém a Política de Privacidade completa para o aplicativo ConexaoNetAppNew, desenvolvida em conformidade com a Lei Geral de Proteção de Dados (LGPD) brasileira.

## 📁 Arquivos Criados

### 1. `POLITICA_PRIVACIDADE.md`
- Versão em Markdown da política
- Formato legível e bem estruturado
- Pode ser facilmente convertido para outros formatos

### 2. `POLITICA_PRIVACIDADE.html`
- Versão HTML da política
- Design responsivo e moderno
- Pode ser hospedada em um servidor web
- Inclui estilos CSS integrados

### 3. `src/screens/PrivacyPolicyScreen.js`
- Tela nativa do aplicativo React Native
- Interface otimizada para dispositivos móveis
- Navegação integrada com o resto do app
- Links clicáveis para e-mail e ANPD

## 🚀 Como Usar

### Integração no Aplicativo

A tela de Política de Privacidade já foi integrada ao aplicativo. Para acessá-la:

```javascript
// Navegar para a tela de Política de Privacidade
navigation.navigate('PrivacyPolicy');
```

### Adicionar Link no Menu

Para adicionar um link para a Política de Privacidade no menu do aplicativo, adicione um botão ou item de menu:

```javascript
<TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
  <Text>Política de Privacidade</Text>
</TouchableOpacity>
```

### Exemplo de Integração no Dashboard

```javascript
// No DashboardScreen.js, adicione um botão para a política
<TouchableOpacity 
  style={styles.menuItem}
  onPress={() => navigation.navigate('PrivacyPolicy')}
>
  <Text style={styles.menuItemText}>Política de Privacidade</Text>
</TouchableOpacity>
```

## 📱 Funcionalidades da Tela

### Características Principais
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Navegação Intuitiva**: Botão de voltar no cabeçalho
- **Links Interativos**: E-mail e website da ANPD clicáveis
- **Scroll Suave**: Navegação fluida pelo conteúdo
- **Estilo Consistente**: Mantém a identidade visual do app

### Recursos Técnicos
- **LinearGradient**: Cabeçalho com gradiente roxo
- **SafeAreaView**: Respeita as áreas seguras do dispositivo
- **ScrollView**: Permite rolagem do conteúdo longo
- **Linking**: Abre e-mail e links externos

## 🎨 Personalização

### Cores e Estilos
As cores principais podem ser personalizadas editando:

```javascript
// Cores principais
const primaryColor = '#A020F0'; // Roxo principal
const secondaryColor = '#8A2BE2'; // Roxo secundário
const backgroundColor = '#f5f5f5'; // Fundo cinza claro
```

### Conteúdo
Para atualizar o conteúdo da política:

1. **Editar o texto**: Modifique as strings no arquivo `PrivacyPolicyScreen.js`
2. **Adicionar seções**: Crie novos `View` com `Text` components
3. **Atualizar contatos**: Modifique os dados de contato na seção 12

## 📋 Conformidade Legal

### LGPD - Lei Geral de Proteção de Dados
A política foi desenvolvida seguindo os princípios da LGPD:

- **Transparência**: Informações claras sobre coleta e uso de dados
- **Finalidade**: Uso específico e legítimo dos dados
- **Minimização**: Coleta apenas dados necessários
- **Adequação**: Compatibilidade com as finalidades declaradas
- **Qualidade**: Dados precisos e atualizados
- **Não Discriminação**: Não discriminação por uso de dados
- **Responsabilização**: Demonstração de conformidade
- **Segurança**: Proteção adequada dos dados

### Direitos do Usuário
A política garante os seguintes direitos:

- **Acesso**: Visualizar dados pessoais
- **Correção**: Corrigir dados incorretos
- **Exclusão**: Solicitar remoção de dados
- **Portabilidade**: Transferir dados para outro serviço
- **Revogação**: Cancelar consentimento

## 🔧 Manutenção

### Atualizações Regulares
- Revisar a política a cada 6 meses
- Atualizar a data de "última atualização"
- Verificar conformidade com novas regulamentações

### Versionamento
- Manter versões anteriores para referência
- Documentar mudanças significativas
- Notificar usuários sobre atualizações importantes

## 📞 Suporte

Para dúvidas sobre a implementação ou conteúdo da Política de Privacidade:

- **E-mail**: privacidade@conexaonet.com.br
- **Telefone**: (67) 9999-9999
- **Endereço**: Rua Exemplo, 123 - Campo Grande/MS

## 📄 Documentação Adicional

### Arquivos Relacionados
- `POLITICA_PRIVACIDADE.md`: Versão Markdown
- `POLITICA_PRIVACIDADE.html`: Versão Web
- `src/screens/PrivacyPolicyScreen.js`: Tela do App

### Recursos Externos
- [Lei Geral de Proteção de Dados (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Autoridade Nacional de Proteção de Dados (ANPD)](https://www.gov.br/anpd)
- [Guia de Implementação da LGPD](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-guia-de-implementacao-da-lgpd)

---

**Conexão Net** - Campo Grande/MS, Brasil
*Última atualização: Janeiro de 2025* 