# Garenne - Application de Gestion d'Élevage

[![Build Status](https://github.com/hankerspace/garenne/workflows/CI/badge.svg)](https://github.com/hankerspace/garenne/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-blue?style=flat)](https://web.dev/progressive-web-apps/)

![Garenne Dashboard](https://github.com/user-attachments/assets/0bdaeae5-688f-4941-9bd9-8ec4230c4fa4)

**Garenne** est une application web moderne et complète pour la gestion d'élevage de lapins, développée avec React 19, TypeScript, et Material-UI v5. Elle offre aux éleveurs une solution professionnelle pour gérer efficacement leurs animaux, portées, pesées, traitements et bien plus encore, le tout en mode hors-ligne avec stockage local sécurisé.

## 🌟 Fonctionnalités Principales

### 🐰 Gestion Complète des Animaux
- ✅ **CRUD complet** : Créer, consulter, modifier et supprimer des animaux
- ✅ **Fiche détaillée** : Vue exhaustive avec onglets (Aperçu, Reproduction, Pesées, Santé)
- ✅ **Recherche avancée** : Par nom, identifiant, race, statut et sexe avec filtres combinés
- ✅ **Gestion de la parenté** : Liaison mère/père avec validation automatique et arbre généalogique
- ✅ **Statuts multiples** : Croissance, Reproducteur, Retraité, Décédé avec transitions automatiques
- ✅ **Identifiants uniques** : Support tatouage, QR codes et identifiants personnalisés

### 📊 Suivi des Données de Performance
- ✅ **Pesées complètes** : Suivi du poids avec historique, graphiques de croissance
- ✅ **Traitements médicaux** : Gestion des soins avec délais d'attente automatiques
- ✅ **Portées détaillées** : Enregistrement naissances, sevrage, mortalité
- ✅ **Statistiques KPI** : Tableaux de bord avec métriques clés
- ✅ **Export/Import** : Sauvegarde et restauration des données
- ✅ **Données d'exemple** : Génération automatique pour découverte rapide

### 🎨 Interface Utilisateur Moderne
- ✅ **Design responsive** : Optimisé mobile, tablette et desktop
- ✅ **Material Design 3** : Interface moderne suivant les dernières guidelines
- ✅ **Thèmes adaptatifs** : Support clair/sombre avec détection système automatique
- ✅ **Navigation intuitive** : Barre de navigation adaptative avec raccourcis
- ✅ **PWA complète** : Installable comme application native, fonctionne hors-ligne
- ✅ **Accessibilité** : Support lecteurs d'écran et navigation clavier

### 🔒 Sécurité et Performance
- ✅ **Stockage local sécurisé** : Données chiffrées et compressées
- ✅ **Mode hors-ligne** : Fonctionnement complet sans connexion internet
- ✅ **Performance optimisée** : Chargement rapide, code splitting automatique
- ✅ **Validation robuste** : Contrôles de cohérence et intégrité des données

## 🚀 Installation et Démarrage Rapide

### Prérequis Système
- **Node.js** 18.0+ ([télécharger ici](https://nodejs.org/))
- **npm** 8+ ou **yarn** 1.22+
- **Git** pour le clonage du repository
- **Navigateur moderne** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation Rapide

```bash
# 1. Cloner le repository
git clone https://github.com/hankerspace/garenne.git
cd garenne

# 2. Installer les dépendances
npm install

# 3. Démarrer l'application en développement
npm run dev

# 4. Ouvrir dans le navigateur
# L'application sera accessible à http://localhost:5173
```

### Scripts Disponibles

```bash
# 🔧 Développement
npm run dev          # Démarrer le serveur de développement avec hot-reload
npm run test         # Lancer les tests en mode watch
npm run test:ui      # Interface graphique pour les tests

# 🏗️ Build et Production  
npm run build        # Construire pour la production (dossier dist/)
npm run preview      # Prévisualiser le build de production
npm run test:run     # Exécuter tous les tests une fois
npm run test:coverage # Rapport de couverture des tests

# 📋 Qualité de Code
npm run lint         # Analyser le code avec ESLint
npm run lint:fix     # Corriger automatiquement les erreurs ESLint
npm run type-check   # Vérification TypeScript sans build
```

### Installation en Production

Pour déployer l'application, consultez notre [Guide de Déploiement](DEPLOYMENT.md) qui couvre :
- GitHub Pages
- Netlify / Vercel
- Docker
- Configuration PWA
- Optimisations performance

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

### Stack Technologique Moderne
- **Frontend** : React 19 + TypeScript 5.8+ (strict mode)
- **UI Framework** : Material-UI v5 avec Material Design 3
- **État Global** : Zustand v5 (store simple et performant)  
- **Routage** : React Router v7 avec data loading
- **Validation** : Zod + React Hook Form pour forms type-safe
- **Build Tool** : Vite 7.0+ avec HMR ultra-rapide
- **PWA** : Vite PWA Plugin avec Workbox
- **Tests** : Vitest + Testing Library + jsdom
- **Linting** : ESLint 9 + TypeScript ESLint

### Architecture des Données

```
Stockage Local (LocalStorage + LZ-String compression)
├── animals[]        # Registre des animaux avec généalogie
├── weights[]        # Historique des pesées  
├── treatments[]     # Traitements et délais d'attente
├── litters[]        # Portées et performances reproduction
├── breedings[]      # Saillies et planning reproduction
└── settings         # Préférences utilisateur
```

### Structure du Projet

```
src/
├── 📁 components/          # Composants réutilisables
│   ├── forms/             # Formulaires avec validation
│   ├── charts/            # Graphiques (Recharts)
│   ├── ui/                # Composants UI de base
│   └── layout/            # Layout et navigation
├── 📁 pages/              # Pages principales de l'application
│   ├── Animals/           # 🐰 Gestion des animaux
│   ├── Litters/           # 👶 Gestion des portées  
│   ├── Treatments/        # 💊 Gestion des traitements
│   └── Settings/          # ⚙️ Configuration
├── 📁 services/           # Services métier et génération de données
├── 📁 state/             # Store Zustand et sélecteurs
├── 📁 utils/             # Utilitaires (dates, validation, storage)
├── 📁 models/            # Types TypeScript et interfaces
└── 📁 test/              # Tests unitaires et d'intégration
```

### Gestion des Données

#### Stockage et Persistance
- **LocalStorage** avec compression automatique LZ-String (réduction ~60%)
- **Sauvegarde automatique** à chaque modification d'état
- **Backup et restauration** via export/import JSON
- **Validation de cohérence** au chargement des données
- **Migration automatique** lors des mises à jour de schéma

#### Performance et Optimisation
- **Code splitting** automatique par route
- **Lazy loading** des composants lourds
- **Memoization** avec React.memo et useMemo stratégiques
- **Virtual scrolling** pour les listes de grande taille
- **Debouncing** des recherches et filtres

### Patterns et Conventions

#### État Global (Zustand)
```typescript
interface AppState {
  // Données
  animals: Animal[];
  treatments: Treatment[];
  weights: Weight[];
  
  // Actions
  addAnimal: (data: CreateAnimalData) => Animal;
  updateAnimal: (id: UUID, data: Partial<Animal>) => void;
  
  // Sélecteurs memoïzés
  getActiveAnimals: () => Animal[];
  getAnimalsByStatus: (status: Status) => Animal[];
}
```

#### Validation avec Zod
```typescript
const animalSchema = z.object({
  name: z.string().min(1).max(50),
  sex: z.nativeEnum(Sex),
  birthDate: z.string().datetime().optional(),
}).refine((data) => {
  // Validation métier complexe
});
```

## 🛠️ Guide de Développement

### Configuration de l'Environnement

#### Extensions VSCode Recommandées
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next", 
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-react-javascript-snippets"
  ]
}
```

#### Configuration ESLint et TypeScript
- **TypeScript strict mode** activé avec toutes les vérifications
- **ESLint 9** avec configuration moderne et React rules
- **Path mapping** configuré pour imports absolus
- **Auto-fix** au save configuré

### Workflow de Développement

Pour des guidelines détaillées, consultez [CONTRIBUTING.md](CONTRIBUTING.md).

#### 1. Standards de Code
```typescript
// ✅ Bonnes pratiques
interface AnimalCardProps {
  animal: Animal;
  onEdit: (id: UUID) => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onEdit }) => {
  const handleEdit = useCallback(() => onEdit(animal.id), [onEdit, animal.id]);
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{animal.name}</Typography>
      </CardContent>
    </Card>
  );
};
```

#### 2. Ajouter une Nouvelle Fonctionnalité

##### Modèles de Données
```typescript
// src/models/types.ts
export interface MonNouveauType {
  id: UUID;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

##### État Global  
```typescript
// src/state/store.ts - Ajouter au store
interface AppState {
  monNouveauType: MonNouveauType[];
  addMonNouveauType: (data: CreateData) => MonNouveauType;
  updateMonNouveauType: (id: UUID, data: UpdateData) => void;
}
```

##### Pages et Composants
```
src/pages/MonNouveauType/
├── MonNouveauTypeListPage.tsx      # Liste avec filtres
├── MonNouveauTypeDetailPage.tsx    # Vue détaillée  
├── MonNouveauTypeFormPage.tsx      # Formulaire création/édition
└── components/                     # Composants spécifiques
    ├── MonNouveauTypeCard.tsx
    └── MonNouveauTypeForm.tsx
```

##### Tests
```typescript
// src/test/monNouveauType.test.ts
describe('MonNouveauType Store', () => {
  beforeEach(() => {
    useAppStore.getState().clearAllData();
  });

  it('should add item correctly', () => {
    const { addMonNouveauType } = useAppStore.getState();
    const item = addMonNouveauType({ name: 'Test' });
    expect(item.id).toBeDefined();
    expect(item.name).toBe('Test');
  });
});
```

### Testing Strategy

#### Types de Tests
- **Unit Tests** : Utils, services, store actions (90%+ coverage)
- **Component Tests** : Rendu, interactions, props (80%+ coverage)  
- **Integration Tests** : Flows utilisateur complets (70%+ coverage)

#### Commandes de Test
```bash
npm run test              # Mode watch pour développement
npm run test:ui           # Interface graphique Vitest  
npm run test:run          # Exécution complète CI/CD
npm run test:coverage     # Rapport de couverture détaillé
```

#### Exemple de Test Composant
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimalCard } from './AnimalCard';

const mockAnimal: Animal = {
  id: 'test-id',
  name: 'Test Animal',
  sex: Sex.Female,
  status: Status.Grow,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('AnimalCard', () => {
  it('should render animal information', () => {
    render(<AnimalCard animal={mockAnimal} onEdit={jest.fn()} />);
    
    expect(screen.getByText('Test Animal')).toBeInTheDocument();
    expect(screen.getByText('Femelle')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<AnimalCard animal={mockAnimal} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /modifier/i }));
    expect(onEdit).toHaveBeenCalledWith('test-id');
  });
});
```

## 📚 Documentation Complète

### Guides Utilisateur
- **[Guide d'Utilisation](#-utilisation)** - Comment utiliser toutes les fonctionnalités
- **[Screenshots et Démos](#captures-décran)** - Aperçu visuel de l'interface

### Documentation Technique  
- **[API Reference](API.md)** - Documentation complète des APIs et modèles de données
- **[Guide de Contribution](CONTRIBUTING.md)** - Workflow de développement et standards
- **[Guide de Déploiement](DEPLOYMENT.md)** - Instructions de déploiement production

### Référence API Rapide

#### Store Actions Principales
```typescript
// Gestion des animaux
const animal = addAnimal({ name: "Fluffy", sex: Sex.Female, status: Status.Grow });
updateAnimal(animal.id, { status: Status.Reproducer });
deleteAnimal(animal.id);

// Pesées
const weight = addWeight({ animalId: animal.id, weight: 1200, date: "2024-01-01" });

// Traitements  
const treatment = addTreatment({
  animalId: animal.id,
  treatmentType: "Vaccination",
  waitingPeriod: 28
});

// Export/Import
const backup = exportData(); // JSON string
importData(backup);          // Restore from backup
```

#### Sélecteurs Utiles
```typescript
// KPIs et statistiques
const kpis = getKPIs(state);              // Métriques principales
const activeAnimals = getActiveAnimals(); // Animaux vivants  
const breeders = getBreeders();           // Reproducteurs

// Filtres et recherches
const females = getAnimalsByStatus(Status.Reproducer);
const recent = getRecentWeights(30);      // 30 derniers jours
const alerts = getActiveAlerts();         // Délais d'attente actifs
```

Pour la documentation complète, consultez [API.md](API.md).

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

## 📝 Roadmap et Évolution

### Version Actuelle (v0.8-beta)
- [x] 🐰 **Gestion complète des animaux** avec CRUD, parenté, statuts
- [x] 📊 **Pesées et courbes de croissance** avec graphiques interactifs  
- [x] 💊 **Traitements et délais d'attente** avec alertes automatiques
- [x] 👶 **Portées et reproduction** avec statistiques de performance
- [x] 🎨 **Interface responsive** Material Design 3 avec thèmes
- [x] 💾 **Stockage local robuste** avec compression et validation
- [x] 📱 **PWA complète** installable et fonctionnant hors-ligne
- [x] 🧪 **Tests automatisés** avec couverture >80%

### Version 1.0 - Production Ready (Q2 2024)
- [ ] 🔄 **Export/Import avancé** : Excel, CSV, formats standards élevage
- [ ] 📈 **Statistiques avancées** : Graphiques de performance, comparaisons
- [ ] 🔍 **Recherche intelligente** : Filtres complexes, recherche floue
- [ ] 🏷️ **Système d'étiquettes** : Organisation personnalisée
- [ ] 📋 **Templates et modèles** : Configurations prédéfinies par race
- [ ] 🌐 **Internationalisation** : Support multilingue (FR, EN, ES)

### Version 1.1 - Fonctionnalités Avancées (Q3 2024)
- [ ] 🧬 **Généalogie avancée** : Coefficients de consanguinité, lignées
- [ ] 📅 **Planning reproduction** : Calendrier intelligent, rappels
- [ ] 📊 **Tableaux de bord personnalisables** : Widgets configurables
- [ ] 🔔 **Système de notifications** : Alertes personnalisées, rappels
- [ ] 📦 **Plugin système** : Extensions tierces
- [ ] 🎯 **Objectifs et suivi** : Goals tracking, métriques cibles

### Version 1.2 - Collaboration (Q4 2024)
- [ ] ☁️ **Synchronisation cloud** : Backup automatique optionnel
- [ ] 👥 **Multi-utilisateurs** : Partage familial, permissions
- [ ] 🔗 **Intégrations** : APIs externes, services vétérinaires
- [ ] 📱 **App mobile native** : iOS/Android avec synchronisation
- [ ] 🏪 **Marketplace** : Partage de configurations, templates

### Améliorations Techniques Continues
- [ ] ⚡ **Performance** : Virtual scrolling, lazy loading amélioré
- [ ] 🔒 **Sécurité** : Chiffrement bout-à-bout, audit trails
- [ ] 🧪 **Tests** : E2E testing, visual regression testing
- [ ] 📊 **Monitoring** : Analytics d'usage, error tracking
- [ ] 🎯 **Accessibilité** : WCAG 2.1 AAA compliance
- [ ] 🌍 **Éco-responsabilité** : Optimisations carbones, green coding

### Contributions Communautaires Recherchées
- 🌍 **Traductions** : Aide pour l'internationalisation
- 🎨 **Design** : Amélioration UX/UI, icons personnalisés
- 🧪 **Tests** : Cas d'usage réels, tests manuels
- 📚 **Documentation** : Guides utilisateur, vidéos tutoriels
- 🐛 **Bug hunting** : Signalement et reproduction de bugs
- 💡 **Idées** : Suggestions de fonctionnalités, feedbacks utilisateur

Pour contribuer, consultez [CONTRIBUTING.md](CONTRIBUTING.md) et rejoignez notre communauté !

## 🚀 Performance et Optimisation

### Métriques de Performance
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s  
- **First Input Delay** : < 100ms
- **Cumulative Layout Shift** : < 0.1
- **Bundle Size** : < 1MB (gzipped)

### Optimisations Implémentées
- ⚡ **Code Splitting** automatique par route
- 🎯 **Lazy Loading** des composants lourds (charts, modals)
- 🧠 **Memoization** stratégique avec React.memo et useMemo
- 💾 **Compression LZ-String** pour le stockage (-60% d'espace)
- 🔄 **Virtual Scrolling** pour les listes de grande taille
- ⏱️ **Debouncing** des recherches et filtres (300ms)
- 📱 **Service Worker** avec cache intelligent

### Monitoring Production
```typescript
// Performance monitoring
performance.mark('app-start');
// ... app logic
performance.mark('app-ready');
performance.measure('app-boot', 'app-start', 'app-ready');
```

## 🛠️ Troubleshooting

### Problèmes Courants

#### Application ne se charge pas
```bash
# Vérifier Node.js version
node --version  # Doit être >= 18

# Clear cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Vérifier ports
lsof -i :5173  # Port par défaut Vite
```

#### Données perdues après fermeture navigateur
```javascript
// Vérifier LocalStorage
console.log(localStorage.getItem('garenne-app-state'));

// Vérifier quota storage
navigator.storage.estimate().then(estimate => {
  console.log(`Used: ${estimate.usage} / ${estimate.quota}`);
});
```

#### Performance dégradée
```bash
# Analyser bundle size
npm run build -- --mode analyze

# Profile React components
# Utiliser React DevTools Profiler
```

#### PWA ne s'installe pas
- ✅ Vérifier que l'application est servie en HTTPS
- ✅ Valider manifest.json dans DevTools
- ✅ Confirmer le Service Worker est actif
- ✅ Tester critères d'installabilité PWA

### Debug Mode

Activer le mode debug en ajoutant à l'URL :
```
http://localhost:5173/?debug=true
```

Cela affiche :
- 🐛 Logs détaillés du store
- 📊 Métriques de performance  
- 🔍 Informations de debug dans la console

### Logs et Diagnostics

```typescript
// En développement - logs détaillés
if (import.meta.env.DEV) {
  console.log('Store state:', useAppStore.getState());
}

// Production - error tracking
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
});
```

### Support et Aide

- 📋 **Issues GitHub** : [Signaler un bug](https://github.com/hankerspace/garenne/issues/new?template=bug_report.md)
- 💬 **Discussions** : [Questions & Support](https://github.com/hankerspace/garenne/discussions)
- 📧 **Contact** : garenne-support@hankerspace.com
- 📚 **Wiki** : [Documentation étendue](https://github.com/hankerspace/garenne/wiki)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Material-UI** pour le framework UI
- **React Team** pour React et les outils de développement
- **Zustand** pour la gestion d'état simple et efficace
- **Vite** pour l'outillage de développement rapide

---

**Développé avec ❤️ pour la communauté des éleveurs**
