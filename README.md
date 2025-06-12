# Dentefier Native - Sistema Forense Odontológico Móvel

![Dentefier Logo](assets/logo_dentefier.png)

Dentefier Native é um aplicativo móvel completo para gerenciamento forense odontológico, permitindo o cadastro, acompanhamento e análise de casos médicos-forenses com foco em odontologia legal.

## ✨ Funcionalidades Principais

- **Gestão Completa de Casos**:
  - Cadastro multi-etapas com geolocalização
  - Filtros por status (Em andamento, Finalizado, Arquivado) e tipo
  - Visualização detalhada de casos

- **Gerenciamento de Evidências**:
  - Upload de imagens e documentos
  - Associação de evidências a casos específicos
  - Edição e exclusão de evidências

- **Dashboard Analítico**:
  - Gráficos estatísticos (Pizza, Barras)
  - Resumo de casos por status e responsável
  - Visualização de casos recentes

- **Autenticação Segura**:
  - Sistema de login com roles (admin, assistente)
  - Proteção de rotas sensíveis

- **Formulário de Contato**:
  - Comunicação direta com a equipe técnica

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework**: React Native (Expo)
- **Linguagem**: TypeScript
- **UI**: React Native Paper + Tailwind (twrnc)
- **Navegação**: React Navigation (Stack + Tabs)
- **Gráficos**: React Native Chart Kit
- **Mapas**: React Native Maps
- **Ícones**: Lucide React Native

### Backend
- **API**: [backend-dentefier.onrender.com](https://backend-dentefier.onrender.com)
- **Autenticação**: JWT com cookies
- **Armazenamento**: AsyncStorage

### Bibliotecas Principais
```json
"dependencies": {
  "@react-native-async-storage/async-storage": "2.1.2",
  "@react-native-picker/picker": "^2.11.0",
  "@react-navigation/native": "^7.1.10",
  "expo": "~53.0.9",
  "react-native-chart-kit": "^6.12.0",
  "react-native-paper": "^5.14.5",
  "react-native-maps": "1.20.1",
  "expo-location": "~18.1.5",
  "expo-image-picker": "~16.1.4",
  "twrnc": "^4.8.0"
}
```

## 📂 Estrutura do Projeto

```
dentefier-native/
├── assets/                  # Recursos visuais
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── logo_dentefier.png
│   ├── placeholder-image.png
│   └── splash-icon.png
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── MapPicker.tsx
│   ├── contexts/            # Gerenciamento de estado
│   │   └── AuthContext.tsx
│   ├── navigation/          # Configuração de rotas
│   │   └── MainAppTabs.tsx
│   ├── screens/             # Telas do aplicativo
│   │   ├── CadastroCaso.tsx
│   │   ├── CadastroEvidencia.tsx
│   │   ├── ContactScreen.tsx
│   │   ├── EditEvidenciaModal.tsx
│   │   ├── EvidenciasList.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── listaEvidencias.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── MeusCasos.tsx
│   │   └── Splash.tsx
│   ├── services/            # Integração com API
│   │   ├── auth.ts
│   │   ├── casos.ts
│   │   ├── evidencias.ts
│   │   └── users.ts
│   ├── App.tsx              # Ponto de entrada
│   └── index.ts             # Registro do app
├── .gitignore
├── app.json                 # Configuração do Expo
├── package.json             # Dependências
├── tsconfig.json            # Configuração do TypeScript
└── README.md
```

## ⚙️ Pré-requisitos

- Node.js v16+
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo físico com [Expo Go](https://expo.dev/client) ou emulador Android/iOS

## 🛠 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dentefier-native.git
cd dentefier-native
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Escaneie o QR code com o aplicativo Expo Go ou execute em um emulador:
```bash
# Android
npm run android

# iOS
npm run ios
```

## 🔒 Fluxo de Autenticação

![Fluxo de Autenticação](fluxo.png)

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Dentefier Native** © 2023 - Sistema para Gerenciamento de Casos Odontológico-Forenses
