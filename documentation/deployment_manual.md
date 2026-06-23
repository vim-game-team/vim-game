---
title: "Deployment Manual – Vim Game"
version: 1.0
date: 2026-06-22
project: Vim Game
---

<div align="center">

# Vim Game
## Deployment Manual

---

**Project:** Vim Game  
**Study Year:** SS2026 – Semester 2  
**Version:** 1.0  
**Date:** 2026-06-22  

---

### Project Team

| Name | Role |
|------|------|
| Angelo Wang | Project Lead |
| Ana Florea | Developer |
| Yannik Moussong | Developer |
| Lia Arjona Ochoa | Developer |
| Supjan Jakumov | Developer |

</div>

---

## Table of Contents

1. [Overview](#1-overview)
2. [Dependencies](#2-dependencies)
3. [Prerequisites](#3-prerequisites)
4. [Environment Configuration](#4-environment-configuration)
5. [Local Deployment](#5-local-deployment)
6. [Production Build](#6-production-build)
7. [Firebase Deployment](#7-firebase-deployment)

---

## 1. Overview

Vim Game is a browser-based Angular application with Firebase as its backend. There is no custom server — the frontend is served as a static build, and all backend functionality (authentication, data storage) is handled by Firebase.

**Architecture:**

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21 |
| Auth & Database | Firebase (Authentication + Firestore) |
| Hosting | Firebase Hosting (recommended) or any static host |
| Language | TypeScript 5.9 |

---

## 2. Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/common` | ^21.2.0 | Angular core modules |
| `@angular/router` | ^21.2.0 | Client-side routing |
| `@angular/material` | ^21.2.10 | UI components |
| `firebase` | ^12.12.1 | Authentication & data storage |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/cli` | ^21.2.3 | Build & serve tooling |
| `@angular/build` | ^21.2.3 | esbuild-based bundler |
| `typescript` | ~5.9.2 | TypeScript compiler |
| `vitest` | ^4.0.8 | Unit testing |

### External Services

| Service | Purpose | Required |
|---------|---------|---------|
| Firebase Authentication | User login & registration | Yes |
| Firebase Firestore | Storing user progress | Yes |
| Google Fonts | Press Start 2P pixel font | No (degrades gracefully) |

---

## 3. Prerequisites

The following must be installed on the deployment machine:

| Tool | Minimum Version | Install |
|------|----------------|---------|
| Node.js | 18 | [nodejs.org](https://nodejs.org) |
| npm | 10.8.2 | Included with Node.js |
| Angular CLI | 21 | `npm install -g @angular/cli` |

Verify installations:
```bash
node --version
npm --version
ng version
```

---

## 4. Environment Configuration

The application requires a Firebase configuration file that is **not** included in the repository (listed in `.gitignore` for security).

Create the file `src/environments/environment.ts` with the following structure:

```typescript
export const environment = {
  production: false,        // set to true for production builds
  skipAuthGuard: false,     // set to true only for local dev without login
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

The actual values can be found in the Firebase Console under **Project Settings → Your Apps**.

> ⚠️ Never commit `environment.ts` to the repository. It contains sensitive API keys.

---

## 5. Local Deployment

```bash
# 1. Clone the repository
git clone <repository-url>
cd vim-game

# 2. Install dependencies
npm install

# 3. Create environment file (see Section 4)

# 4. Start the development server
ng serve
```

The application is available at `http://localhost:4200`.

---

## 6. Production Build

To build an optimized production bundle:

```bash
ng build --configuration production
```

The output is generated in the `dist/` folder. This folder contains all static files (HTML, CSS, JS) that can be served by any static web host.

> Set `production: true` and `skipAuthGuard: false` in `environment.ts` before building.

---

## 7. Firebase Deployment

Firebase Hosting is the recommended deployment target as the project already uses Firebase for auth and data.

### Setup (first time only)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting in the project root
firebase init hosting
```

During `firebase init`:
- Select the existing Firebase project (`vim-game-dev`)
- Set public directory to `dist/vim-game/browser`
- Configure as single-page app: **Yes**
- Do not overwrite `index.html`: **No**

### Deploy

```bash
ng build --configuration production
firebase deploy --only hosting
```

After deployment, Firebase provides a live URL in the format:
`https://vim-game-dev.web.app`

---

*Vim Game · Deployment Manual · v1.0 · SS2026*