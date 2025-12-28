1| # Tech Challenge Fiap 3
2| ##### Repositorio para mobile
3| 
4| ## Tecnologias utilizadas no projeto
5| 
6| #### • Node version 20.19.0
7| #### • React Native
8| #### • Figma
9| #### • Firebase
10| 
11| ---------------------------------------------------------------
12| 
13| # Orietações para execução do projeto
14| 
15| Para executar o projeto, siga os passos abaixo:
16| 
17| **instalação de dependencia abra o terminal e execute o comando abaixo**
18| 
19| - npm install
20| 
21| **Subida do projeto no expo abra o terminal e execute o comando abaixo**
22| 
23| - npm run start
24| 
25| *O projeto será executado na porta 8081*
26| 
27| 
28| Voce pode acessar via web na porta indicada , ou no aplicativo Expo dev . Instale o aplicativo no seu app strore e depois de instalado aponte a campera do celular no qr code para que a aplicaçao [...]
29| 
30| Para que o app possa rodar dentro do celular , voce precisa pegar o ip da sua maquina 
31| 
32| apertando windows + r e depois digite no prompt ipconfig 
33| 
34| pegue o IPV4 correspondente siga o caminho
35| 
36| 
37| AppBytebank >> financeiro >> util.services.tsx
38| 
39| 
40| e coloque o ip da sua maquina na constante *const LOCAL_IP*
41| 
42| **Também é possível rodar o projeto via Emulador do VisualStudio**
43| 
44| - npm run start
45| - Opção "a" (Android)
46| 
47| Obs: É necessário ter o visual studo instalado e o emulador devidamente configurado em sua máquina.
48| 
49| 
50| **O projeto já possui um usuário criado para testes, para realizar o login, utilize o usuário de teste abaixo**
51| 
52| usuario: teste@email.com
53| senha: 123456
54|
55| ---
56|
57| ## Estrutura do projeto
58|
59| Abaixo uma visão geral das pastas e arquivos mais importantes. Isso ajuda a entender onde cada responsabilidade está localizada.
60|
61| ```mermaid
62| %% Diagrama de árvore de pastas simplificado
63| graph TD
64|   A[tech-challenge-3-fiap-react-native]
65|   A --> src
66|   A --> assets
67|   A --> .expo
68|   A --> package.json
69|   src --> components
70|   src --> screens
71|   src --> navigation
72|   src --> services
73|   src --> hooks
74|   src --> contexts
75|   src --> utils
76|   screens --> LoginScreen
77|   screens --> HomeScreen
78|   services --> firebase
79|   services --> api
80|   components --> Header
81|   components --> Button
82| ```
83|
84| ## Arquitetura e fluxos
85|
86| O app está organizado com separação por responsabilidades: UI (components/screens), navegação (navigation), serviços (services) e lógica compartilhada (hooks/contexts). Abaixo um fluxo simplificado de autenticação.
87|
88| ```mermaid
89| %% Fluxo de autenticação simplificado
90| flowchart LR
91|   A[Usuário abre app] --> B[Tela de Login]
92|   B --> C{Credenciais válidas?}
93|   C -- Sim --> D[Chama Firebase Auth]
94|   D --> E[Recebe Token]
95|   E --> F[Salva contexto de usuário e navega para Home]
96|   C -- Não --> G[Mostra erro]
97| ```
98|
99| ## Principais pastas e responsabilidades
100|
101| - src/components: componentes reutilizáveis (Botões, Inputs, Headers)
102| - src/screens: telas da aplicação (Login, Home, Perfil, etc.)
103| - src/navigation: configuração do React Navigation e rotas
104| - src/services: integração com Firebase e APIs externas
105| - src/contexts: providers de contexto (AuthContext, ThemeContext)
106| - src/hooks: hooks customizados utilizados pela aplicação
107| - src/utils: funções utilitárias e constantes (ex: LOCAL_IP)
108| - assets: imagens, fontes e arquivos estáticos
109|
110| ## Scripts úteis
111|
112| - npm install: instala dependências
113| - npm run start: inicia o Metro/Expo
114| - npm run android (se configurado): abre no emulador Android
115| - npm run ios (se configurado): abre no simulador iOS
116|
117| Ajuste: alguns scripts podem depender da configuração local do Expo/React Native — verifique package.json para a lista completa.
118|
119| ## Configuração do Firebase
120|
121| Se o projeto depende do Firebase, verifique os arquivos dentro de src/services/firebase. Para configurar o Firebase em sua máquina:
122|
123| 1. Crie um projeto no console do Firebase
124| 2. Adicione um app (Android/iOS/Web) e copie as credenciais (apiKey, authDomain, projectId, etc.)
125| 3. Coloque as credenciais no arquivo de configuração indicado em src/services/firebase/config.js (ou .ts). NÃO commit essas chaves em repositórios públicos — use variáveis de ambiente quando possível.
126|
127| ## Variáveis de ambiente
128|
129| - LOCAL_IP: IP da sua máquina para uso em chamadas locais (conforme instruções existentes)
130| - FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, etc.: credenciais do Firebase
131|
132| Recomendo criar um arquivo .env.local (adicionado ao .gitignore) com essas chaves em desenvolvimento.
133|
134| ## Testes e qualidade
135|
136| - Se existirem testes (jest, testing-library), execute com: npm test
137| - Utilize linters (eslint, prettier) se estiverem configurados: npm run lint
138|
139| ## Boas práticas para contribuições
140|
141| - Abra uma issue descrevendo a feature/bug antes de iniciar trabalho
142| - Crie branches de feature com nomes claros: feat/<descrição> ou fix/<descrição>
143| - Faça commits pequenos e com mensagens descritivas
144| - Adicione reviewers no PR e descreva o que foi alterado
145|
146| ## Observações adicionais
147|
148| - Mantenha o arquivo src/utils/util.services.tsx atualizado com o LOCAL_IP quando trabalhar com dispositivo físico
149| - Verifique a versão do Node indicada (20.19.0) para evitar incompatibilidades
150|
151| ## Contato / Suporte
152|
153| Para dúvidas sobre o projeto, contate o mantenedor do repositório.
154|
155| ---
156|
157| **O projeto já possui um usuário criado para testes, para realizar o login, utilize o usuário de teste abaixo**
158|
159| usuario: teste@email.com
160| senha: 123456
161|
162|