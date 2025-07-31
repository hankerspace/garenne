# Guide de Déploiement - Garenne

Ce guide détaille les différentes options de déploiement pour l'application Garenne.

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Build de Production](#build-de-production)
- [Déploiement GitHub Pages](#déploiement-github-pages)
- [Déploiement Netlify](#déploiement-netlify)
- [Déploiement Vercel](#déploiement-vercel)
- [Déploiement Docker](#déploiement-docker)
- [Configuration PWA](#configuration-pwa)
- [Optimisations Production](#optimisations-production)
- [Monitoring](#monitoring)

## Vue d'ensemble

Garenne est une Single Page Application (SPA) React qui peut être déployée sur n'importe quel serveur web statique. L'application fonctionne entièrement côté client avec stockage local des données.

### Caractéristiques du Déploiement

- **Application statique** : Pas de backend requis
- **PWA** : Support Progressive Web App
- **Stockage local** : Toutes les données en localStorage
- **Responsive** : Optimisé mobile et desktop
- **Thèmes** : Support clair/sombre automatique

## Prérequis

- Node.js 18+
- npm ou yarn
- Git
- Compte sur la plateforme de déploiement choisie

## Build de Production

### Configuration de Base

```bash
# Installation des dépendances
npm install

# Build de production
npm run build

# Vérification du build
npm run preview
```

### Variables d'Environnement

Créer `.env.production` si nécessaire :

```env
# Base URL pour déploiement en sous-dossier
VITE_BASE_URL=/garenne/

# Mode de production
NODE_ENV=production

# Configuration PWA
VITE_PWA_NAME=Garenne
VITE_PWA_SHORT_NAME=Garenne
```

### Optimisation du Build

Le build génère :
- `dist/index.html` : Point d'entrée
- `dist/assets/` : JS/CSS optimisés et minifiés
- `dist/manifest.webmanifest` : Manifest PWA
- `dist/sw.js` : Service Worker
- `dist/favicon.png` : Icône de l'app

## Déploiement GitHub Pages

### Configuration Automatique

1. **Activer GitHub Pages** dans les settings du repository
2. **Configurer GitHub Actions** (`.github/workflows/deploy.yml`) :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:run
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Configuration Manuelle

```bash
# Build avec base path correct
npm run build

# Deploy vers gh-pages branch
npx gh-pages -d dist
```

### Accès

L'application sera accessible à :
`https://hankerspace.github.io/garenne/`

## Déploiement Netlify

### Via Git (Recommandé)

1. **Connecter le repository** sur Netlify
2. **Configurer le build** :
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   VITE_BASE_URL=/
   ```

### Via Netlify CLI

```bash
# Installation
npm install -g netlify-cli

# Login
netlify login

# Build et deploy
npm run build
netlify deploy --prod --dir=dist
```

### Configuration Custom Domain

1. **Ajouter le domaine** dans Netlify settings
2. **Configurer DNS** chez votre registrar :
   ```
   CNAME garenne.votre-domaine.com -> inspiring-app-123456.netlify.app
   ```
3. **SSL automatique** géré par Netlify

## Déploiement Vercel

### Via Git

1. **Importer le projet** sur Vercel
2. **Configuration automatique** détectée
3. **Variables d'environnement** si nécessaire

### Via Vercel CLI

```bash
# Installation
npm install -g vercel

# Deploy
vercel --prod
```

### Configuration `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Déploiement Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # PWA files
    location = /manifest.webmanifest {
        expires 1y;
        add_header Cache-Control "public";
    }

    location = /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### Build et Run

```bash
# Build image
docker build -t garenne .

# Run container
docker run -p 8080:80 garenne
```

## Configuration PWA

### Manifest.json

Configuré automatiquement via Vite PWA plugin dans `vite.config.ts` :

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.png', 'robots.txt'],
  manifest: {
    name: 'Garenne - Gestion d\'Élevage',
    short_name: 'Garenne',
    description: 'Application de gestion d\'élevage de lapins',
    theme_color: '#1976d2',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: 'favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
})
```

### Service Worker

- **Cache First** : Assets statiques
- **Network First** : API calls (si applicable)
- **Update automatique** : Notification utilisateur

## Optimisations Production

### Performance

1. **Code Splitting** automatique avec Vite
2. **Tree Shaking** pour réduire la taille du bundle
3. **Minification** JS/CSS
4. **Compression Gzip** côté serveur

### Bundle Analysis

```bash
# Analyser la taille du bundle
npm run build -- --mode analyze

# Ou avec webpack-bundle-analyzer
npx vite-bundle-analyzer dist
```

### Optimisations Images

Les images sont automatiquement optimisées au build :
- Format WebP si supporté
- Lazy loading
- Responsive images

### Métriques Cibles

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **First Input Delay** : < 100ms
- **Cumulative Layout Shift** : < 0.1

## Monitoring

### Google Analytics (Optionnel)

Si activé, ajouter dans `index.html` :

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Pour un suivi des erreurs en production :

```bash
npm install @sentry/react
```

Configuration dans `main.tsx` :

```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: "production",
  });
}
```

### Health Checks

Pour surveiller la disponibilité :

```javascript
// health-check.js
fetch('/manifest.webmanifest')
  .then(response => {
    if (response.ok) {
      console.log('App is healthy');
    } else {
      console.error('App health check failed');
    }
  });
```

## Sécurité

### Headers de Sécurité

Configurer les headers HTTP de sécurité :

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS

- **Obligatoire** pour PWA
- **Certificat SSL** automatique sur Netlify/Vercel
- **HSTS** recommandé en production

## Troubleshooting

### Problèmes Courants

**404 sur rafraîchissement de page** :
- Configurer le fallback vers `index.html` sur le serveur

**Service Worker pas mis à jour** :
- Vérifier les headers de cache
- Forcer le rafraîchissement du SW

**PWA pas installable** :
- Vérifier HTTPS
- Valider le manifest.json
- Confirmer la présence du Service Worker

### Logs et Debug

```bash
# Logs de build détaillés
npm run build -- --mode development

# Serveur de preview avec logs
npm run preview -- --host --port 3000
```

Pour plus d'aide, consultez les [Issues GitHub](https://github.com/hankerspace/garenne/issues).