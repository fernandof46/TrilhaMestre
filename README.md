# TrilhaMestre

Aplicativo mobile em React Native e Expo para receber orientação de aprendizagem em qualquer área, acompanhar etapas e consultar materiais de estudo.

## Requisitos

- Node.js e npm
- Android Studio/SDK para executar no Android
- macOS com Xcode para executar localmente no iOS
- Projeto Firebase para autenticação e Cloud Functions

## Instalação e execução

```bash
npm install
npm --prefix functions install
```

O Google Sign-In usa código nativo e não funciona no Expo Go. Depois de configurar o Firebase e o OAuth Google, gere um novo build nativo:

```bash
npx expo prebuild
npm run android
# no macOS:
npm run ios
```

## Configuração do Firebase e Google

1. Crie um projeto no Firebase Console e habilite **Authentication > Sign-in method > E-mail/senha** e **Google**.
2. Em **Configurações do projeto > Seus apps**, registre o Android (`com.fernandobf.TrilhaMestre`) e o iOS (`com.fernandobf.TrilhaMestre`).
3. Configure os clientes OAuth no Google Cloud/Firebase. Para Android, cadastre os fingerprints SHA-1 das chaves de desenvolvimento e publicação. Para iOS, use o URL scheme reverso do cliente OAuth.
4. Copie `.env.example` para `.env` e preencha as variáveis `EXPO_PUBLIC_FIREBASE_*` e `EXPO_PUBLIC_GOOGLE_*`. As configurações do app Firebase são identificadores de cliente, não chaves privadas; restrinja a API key no Google Cloud.
5. Se o Firebase fornecer `google-services.json` e `GoogleService-Info.plist`, coloque-os no caminho definido por `GOOGLE_SERVICES_JSON_PATH` e `GOOGLE_SERVICE_INFO_PLIST_PATH`. Proteja esses arquivos conforme sua política de repositório/CI.
6. Reinicie o Expo após mudar `.env`. A tela de entrada permite cadastro, login, recuperação de senha e Google. Os caminhos principais exigem sessão Firebase.
7. Crie o banco Cloud Firestore na mesma região da função para armazenar os contadores de uso; as regras do projeto bloqueiam acesso direto dos clientes a esses registros.

As trilhas ficam no AsyncStorage e são separadas por conta neste aparelho; não há sincronização entre dispositivos. Dados locais da versão anterior são migrados para a primeira conta que entrar neste aparelho.

## API de orientação com IA

A orientação é executada em uma callable Cloud Function autenticada. As chaves dos modelos ficam em Firebase Secret Manager e nunca são incluídas no aplicativo. A função aceita provedores configurados em ordem de preferência e tenta o próximo se um falhar:

- Gemini
- Groq
- OpenRouter (inclui o roteador de modelos gratuitos)

As cotas gratuitas e os modelos disponíveis variam por provedor e podem mudar; cada provedor pode exigir conta, chave e limites próprios. A função limita cada conta a 10 pedidos por dia e aceita no máximo 5 instâncias simultâneas. Para executar/deployar Cloud Functions, o Firebase exige plano Blaze e faturamento ativo. Configure alertas de orçamento e limites de gastos antes do deploy.

Configure pelo menos um provedor como segredo, informando JSON no prompt interativo (não coloque chaves no código nem no histórico do terminal):

```json
{
  "order": ["gemini", "groq", "openrouter"],
  "providers": {
    "gemini": { "apiKey": "CHAVE", "model": "gemini-2.5-flash" },
    "groq": { "apiKey": "CHAVE", "model": "llama-3.3-70b-versatile" },
    "openrouter": { "apiKey": "CHAVE", "model": "openrouter/free" }
  }
}
```

Selecione o projeto e faça o deploy das regras e da função:

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools functions:secrets:set AI_PROVIDER_CONFIG
npx firebase-tools deploy --only functions,firestore:rules
```

As buscas de materiais são geradas pelo app e não representam links verificados pela IA. O botão **Criar trilha sem IA** continua disponível para uso local.
O tema, objetivo e contexto digitados para uma orientação são enviados ao provedor de IA escolhido; não inclua dados pessoais sensíveis. Antes de publicar no iOS, confira as regras atuais da App Store para aplicativos que oferecem login Google.

## Funcionalidades

- Cadastro, login e recuperação de senha com Firebase Authentication (Google ou e-mail/senha).
- Orientação por IA em temas de qualquer área, com fallback entre provedores configurados no servidor.
- Geração local de trilhas quando o usuário optar por não chamar IA.
- Persistência das trilhas e do progresso no dispositivo com AsyncStorage.
- Busca e filtros por status no histórico.
- Acompanhamento e atualização do status de cada trilha.
- Abertura dos materiais de estudo no navegador do dispositivo.
- Exportação da trilha em PDF e compartilhamento pelo menu nativo do sistema.

## Verificações

```bash
npm run lint
npm run typecheck
npm run test:functions
npx expo install --check
npx expo-doctor
```

As pastas nativas são geradas pelo Expo Prebuild. Execute `npx expo prebuild` novamente depois de alterar plugins ou configurações OAuth nativas.
