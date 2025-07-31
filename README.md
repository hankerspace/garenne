# Garenne - Application de Gestion d'Élevage

![Garenne Dashboard](https://github.com/user-attachments/assets/0bdaeae5-688f-4941-9bd9-8ec4230c4fa4)

Garenne est une application web moderne de gestion d'élevage de lapins, développée avec React, TypeScript, et Material-UI. Elle permet aux éleveurs de gérer efficacement leurs animaux, portées, pesées, traitements et plus encore.

## 🌟 Fonctionnalités

### Gestion des Animaux
- ✅ **CRUD complet** : Créer, consulter, modifier et supprimer des animaux
- ✅ **Fiche détaillée** : Vue complète avec onglets (Aperçu, Reproduction, Pesées, Santé)
- ✅ **Recherche et filtres** : Par nom, identifiant, race, statut et sexe
- ✅ **Gestion de la parenté** : Liaison mère/père avec validation
- ✅ **Statuts multiples** : Croissance, Reproducteur, Retraité, Décédé

### Gestion des Données
- ✅ **Pesées** : Suivi du poids avec historique
- ✅ **Traitements** : Gestion des soins avec délais d'attente
- ✅ **Portées** : Enregistrement des naissances et sevrage
- ✅ **Données d'exemple** : Génération automatique pour découvrir l'app

### Interface Utilisateur
- ✅ **Design responsive** : Optimisé mobile et desktop
- ✅ **Material Design** : Interface moderne et intuitive
- ✅ **Thèmes** : Support clair/sombre avec détection système
- ✅ **Navigation intuitive** : Barre de navigation adaptative
- ✅ **PWA Ready** : Installable comme application native

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/hankerspace/garenne.git
cd garenne

# Installer les dépendances
npm install

# Démarrer l'application en développement
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Scripts Disponibles
```bash
# Développement
npm run dev          # Démarrer le serveur de développement

# Build et Production
npm run build        # Construire pour la production
npm run preview      # Prévisualiser le build de production

# Qualité de Code
npm run lint         # Analyser le code avec ESLint
```

## 📱 Utilisation

### Premier Démarrage
1. **Données d'exemple** : Cliquez sur "Charger des données d'exemple" pour découvrir l'application
2. **Premier animal** : Ou créez directement votre premier animal

### Gestion des Animaux

#### Créer un Animal
1. Cliquez sur le bouton "+" en bas à droite
2. Remplissez les informations de base (nom, identifiant, sexe, etc.)
3. Définissez l'origine (né ici/acheté) et la parenté si applicable
4. Sauvegardez

![Formulaire Animal](https://github.com/user-attachments/assets/3257e878-4427-4423-b7c9-c3ec1212cf14)

#### Consulter les Détails
1. Cliquez sur "Détails" sur la carte d'un animal
2. Naviguez entre les onglets :
   - **Aperçu** : Informations générales et parenté
   - **Reproduction** : Historique des saillies (à venir)
   - **Pesées** : Suivi du poids
   - **Santé** : Traitements et délais d'attente

![Détails Animal](https://github.com/user-attachments/assets/c730bcf3-5282-4619-991f-987d57bdc042)

#### Modifier un Animal
1. Cliquez sur "Modifier" sur la carte ou dans les détails
2. Modifiez les champs souhaités
3. Sauvegardez les modifications

### Recherche et Filtres
- **Barre de recherche** : Recherche par nom, identifiant ou race
- **Filtre par statut** : Tous, Reproducteurs, Croissance, Retraités
- **Filtre par sexe** : Tous, Femelles, Mâles

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : React 19 + TypeScript
- **UI Framework** : Material-UI v5
- **État Global** : Zustand
- **Routing** : React Router v7
- **Validation** : Zod + React Hook Form
- **Build Tool** : Vite
- **PWA** : Vite PWA Plugin

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
│   ├── Animals/        # Gestion des animaux
│   ├── Litters/        # Gestion des portées
│   └── Settings/       # Configuration
├── services/           # Services métier
├── state/             # Gestion d'état Zustand
├── utils/             # Utilitaires
└── models/            # Types TypeScript
```

### Gestion des Données
- **Stockage local** : LocalStorage avec compression LZ-String
- **Sauvegarde automatique** : À chaque modification
- **Export/Import** : Système de sauvegarde JSON (à venir)

## 🛠️ Développement

### Conventions de Code
- **TypeScript strict** activé
- **ESLint** pour la qualité de code
- **Naming** : camelCase pour JS/TS, kebab-case pour les fichiers
- **Commits** : Messages descriptifs en français

### Ajouter une Fonctionnalité

#### 1. Modèles de Données
Définir les types dans `src/models/types.ts` :
```typescript
export interface MonNouveauType {
  id: UUID;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 2. État Global
Ajouter au store Zustand dans `src/state/store.ts` :
```typescript
// Ajouter au state
monNouveauType: MonNouveauType[];

// Ajouter les actions
addMonNouveauType: (data: Omit<MonNouveauType, 'id' | 'createdAt' | 'updatedAt'>) => MonNouveauType;
```

#### 3. Pages et Composants
Créer les composants dans `src/pages/MonNouveauType/` :
- `MonNouveauTypeListPage.tsx`
- `MonNouveauTypeDetailPage.tsx` 
- `MonNouveauTypeFormPage.tsx`

#### 4. Routing
Ajouter les routes dans `src/router.tsx`

## 🔒 Sécurité et Données

### Protection des Données
- **Stockage local uniquement** : Aucune donnée envoyée sur internet
- **Pas d'authentification** : Application mono-utilisateur locale
- **Sauvegarde recommandée** : Export régulier des données

### Délais d'Attente
L'application surveille automatiquement les délais d'attente des traitements et affiche des alertes appropriées.

## 🚀 Déploiement

### GitHub Pages (à venir)
Le déploiement automatique sur GitHub Pages sera configuré via GitHub Actions.

### Build de Production
```bash
npm run build
```
Les fichiers seront générés dans le dossier `dist/`.

## 🤝 Contribution

### Signaler un Bug
1. Vérifiez que le bug n'est pas déjà signalé
2. Créez une issue avec :
   - Description détaillée
   - Étapes de reproduction
   - Screenshots si pertinent

### Proposer une Fonctionnalité
1. Créez une issue avec le label "enhancement"
2. Décrivez le besoin et la solution proposée
3. Attendez les retours avant de commencer le développement

### Pull Requests
1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos modifications
4. Créez une pull request avec description détaillée

## 📝 Roadmap

### Version Actuelle (v0.1)
- [x] Gestion complète des animaux
- [x] Interface responsive
- [x] Stockage local des données

### Prochaines Versions
- [ ] Gestion complète des traitements
- [ ] Gestion des portées et sevrage
- [ ] Graphiques et statistiques
- [ ] Export/Import des données
- [ ] Tests automatisés
- [ ] Déploiement automatique
- [ ] Mode hors ligne complet
- [ ] Backup cloud optionnel

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Material-UI** pour le framework UI
- **React Team** pour React et les outils de développement
- **Zustand** pour la gestion d'état simple et efficace
- **Vite** pour l'outillage de développement rapide

---

**Développé avec ❤️ pour la communauté des éleveurs**
