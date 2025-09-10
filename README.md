# app-rastreamento-v2 (pt-br)

Um aplicativo móvel para rastreamento, monitoramento e sincronização de localizações em segundo plano, construído com Expo, React Native, TypeScript e SQLite.

## Funcionalidades
- Autenticação e autorização de usuários
- Rastreamento e registro de localização
- Rastreamento de localização em segundo plano
- Visualização interativa de mapa
- Componentes de UI personalizados
- Integração com banco de dados local (Expo SQLite)
- Utilitários para decodificação JWT
- Estratégia offline-first para dados de localização
- Navegação por abas e Expo Router
- Serviços de API com instâncias distintas

## Estrutura do Projeto
```
app/
  Telas principais e layouts do aplicativo (Expo Router, navegação por abas)
components/
  Componentes de UI reutilizáveis
constants/
  Constantes globais do app
Providers/
  Providers de contexto (ex: AuthProvider)
database/
  Lógica do banco de dados local (Expo SQLite)
hooks/
  Hooks personalizados do React
services/
  Serviços de API e monitoramento (instâncias separadas de axios)
types/
  Definições de tipos TypeScript
utils/
  Funções utilitárias (ex: decodificação JWT)
assets/
  Fontes e imagens
```

## Primeiros Passos

### Pré-requisitos
- Node.js
- pnpm
- Expo CLI
- Android Studio ou dispositivo físico

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/teamneocity/app-rastreamento-v2.git
   cd app-rastreamento-v2
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Crie a pasta android:
   ```bash
   pnpm prebuild
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm android
   ```

### Executando no Dispositivo/Emulador
- Use um emulador ou dispositivo físico para visualizar o aplicativo.

## Banco de Dados Local (Expo SQLite)
- O app utiliza Expo SQLite para armazenamento local dos dados de localização (`database/locationDb.ts`).
- Os dados são armazenados offline e sincronizados com o servidor.
- Isso permite uma estratégia offline-first, garantindo o funcionamento do rastreamento mesmo sem internet.

## Serviços & API
- As requisições de API são feitas por instâncias distintas de axios (`axios-config.ts`).
- A lógica dos serviços está separada na pasta `services/` (ex: `MonitoringService.ts`).
- Autenticação e dados de localização são gerenciados de forma independente para melhor manutenção.

## Navegação (Expo Router & Abas)
- O app utiliza Expo Router para navegação e gerenciamento de telas (`app/_layout.tsx`).
- A navegação por abas é implementada em `app/(tabs)/_layout.tsx` para uma experiência moderna.
- O fluxo de autenticação e rotas protegidas são tratados via providers de contexto.

## Estratégia Offline-First
- Os dados de localização são salvos localmente e marcados como enviados/não enviados (camada de sincronização).
- Quando online, os dados não enviados são sincronizados com o servidor.
- O app permanece funcional e rastreia localizações mesmo offline.

## Scripts
- `npx expo prebuild` — Cria a pasta android
- `pnpm android` — Compila o app de desenvolvimento e inicia o servidor Expo
- `pnpm start` — Inicia o servidor de desenvolvimento Expo

## O que está por vir
- **Integração com Drizzle ORM** para melhor gerenciamento do banco de dados local e segurança de tipos.
- **Notificações push** para atualizações e alertas em tempo real.
- **Dashboard analítico avançado** para histórico de atividades e localizações.
- **Melhorias no tratamento de erros e logs** para maior confiabilidade.

---

# app-rastreamento-v2

A mobile application for tracking, monitoring and sync locations in background, built with Expo, React Native, TypeScript and SQLite.

## Features
- User authentication and authorization
- Location tracking and registration
- Background location tracking
- Interactive map view
- Custom UI components
- Local database integration (Expo SQLite)
- JWT decoding utilities
- Offline-first strategy for location data
- Tab navigation and Expo Router
- API services with distinct instances

## Project Structure
```
app/
  Main application screens and layouts (Expo Router, tab navigation)
components/
  Reusable UI components
constants/
  App-wide constants
Providers/
  Context providers (e.g., AuthProvider)
database/
  Local database logic (Expo SQLite)
hooks/
  Custom React hooks
services/
  API and monitoring services (separate axios instances)
types/
  TypeScript type definitions
utils/
  Utility functions (e.g., JWT decoding)
assets/
  Fonts and images
```

## Getting Started

### Prerequisites
- Node.js
- pnpm
- Expo CLI
- Android Studio or physical device

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/teamneocity/app-rastreamento-v2.git
   cd app-rastreamento-v2
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create the android folder:
   ```bash
   pnpm prebuild
   ```
4. Start the development server:
   ```bash
   pnpm android
   ```

### Running on Device/Emulator
- Use an emulator or physical device to preview the application.

## Local Database (Expo SQLite)
- The app uses Expo SQLite for local storage of location data (`database/locationDb.ts`).
- Data is stored offline and synchronized with the server.
- This enables an offline-first strategy, ensuring location tracking works even without internet.

## Services & API
- API requests are handled via distinct axios instances (`axios-config.ts`).
- Service logic is separated in the `services/` folder (e.g., `MonitoringService.ts`).
- Authentication and location data are managed independently for better maintainability.

## Navigation (Expo Router & Tabs)
- The app uses Expo Router for navigation and screen management (`app/_layout.tsx`).
- Tab navigation is implemented in `app/(tabs)/_layout.tsx` for a modern mobile experience.
- Auth flow and protected routes are handled via context providers.

## Offline-First Strategy
- Location data is saved locally and marked as sent/unsent (Sync layer).
- When online, unsent data is synced to the server.
- The app remains functional and tracks locations even when offline.

## Scripts
- `npx expo prebuild` — Create the android folder
- `pnpm android` — Build the development app and start the Expo development server
- `pnpm start` — Start Expo development server

## What's Coming
- **Drizzle ORM integration** for improved local database management and type safety.
- **Push notifications** for real-time updates and alerts.
- **Advanced analytics dashboard** for user activity and location history.
- **Improved error handling and logging** for better reliability.