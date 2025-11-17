# Finanças Pessoais - App Mobile

Aplicativo mobile React Native com Expo para gerenciamento de finanças pessoais.

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação
- **Axios** - Cliente HTTP
- **Expo Secure Store** - Armazenamento seguro
- **Context API** - Gerenciamento de estado

## 📱 Funcionalidades

- ✅ Login e Cadastro de usuários
- ✅ Dashboard com resumo financeiro
- ✅ CRUD completo de transações
- ✅ CRUD completo de categorias
- ✅ CRUD completo de usuário
- ✅ Perfil do usuário
- ✅ Design moderno e responsivo

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar URL da API

Edite o arquivo `src/config/api.js` e altere a URL base:

```javascript
const API_BASE_URL = "http://SEU_IP:3000/api";
```

**Importante:** Para testar no emulador Android:

- Use `http://10.0.2.2:3000/api` (emulador Android)
- Ou use `http://localhost:3000/api` (Expo Go na mesma rede)

Para testar no dispositivo físico:

- Use o IP da sua máquina na rede local: `http://192.168.x.x:3000/api`

### 3. Iniciar o servidor

```bash
npm start
```

Ou para plataforma específica:

```bash
npm run android  # Android
npm run web     # Web
```

## 📱 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── config/          # Configurações (API)
│   ├── context/         # Context API (Auth)
│   ├── navigation/      # Navegação
│   ├── screens/         # Telas do app
│   └── services/        # Serviços (API, Storage)
├── App.js               # Componente principal
└── package.json
```

## 🎨 Telas

- **Login** - Autenticação
- **Cadastro** - Criação de conta
- **Home** - Dashboard com resumo
- **Transações** - Lista de transações
- **Categorias** - Lista de categorias
- **Perfil** - Informações do usuário
- **Nova/Editar Transação** - Formulários
- **Nova/Editar Categoria** - Formulários

## 📝 Notas

- O token JWT é armazenado de forma segura
- Todas as requisições incluem autenticação automática
- Design responsivo e moderno

## 🔧 Troubleshooting

### Erro de conexão com API

1. Verifique se o backend está rodando
2. Verifique a URL no `src/config/api.js`
3. Para dispositivo físico, use o IP da máquina na rede local
4. Verifique se há firewall bloqueando a porta 3000

### Erro ao instalar dependências

```bash
npm cache clean --force
rm -rf node_modules
npm install
```
