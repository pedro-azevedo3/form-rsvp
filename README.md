# Formatura RSVP

Site em Next.js para confirmação de presença na formatura de Beatriz Almeida Rocha.

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. O painel do formando usa a senha de demonstração `formatura2026`.

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
