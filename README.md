# Formatura RSVP

Site em Next.js para confirmação de presença na formatura de Beatriz Almeida Rocha.

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` para acessar a aplicação.

Para iniciar o MongoDB local com Docker:

```bash
docker compose up -d
cp .env.example .env.local
npm run dev
```

No Railway, configure `MONGODB_URI=${{MongoDB.MONGO_URL}}` no serviço da aplicação e faça um novo deploy.

## MongoDB

Crie um serviço MongoDB no mesmo projeto do Railway e adicione estas variáveis ao serviço Next.js:

```bash
MONGODB_URI=${{MongoDB.MONGO_URL}}
MONGODB_DB=formatura
```

O nome exato da referência pode variar conforme o nome dado ao serviço no Railway. Localmente, copie `.env.example` para `.env.local` e informe a conexão.

## Funcionalidades

- convite responsivo e formulário de RSVP;
- fluxo de confirmação e correção da resposta;
- painel protegido por senha;
- indicadores, gráficos, busca e filtros;
- cópia e compartilhamento do link do convite;
- exportação da lista em CSV.
- persistência das respostas e configurações no MongoDB.
