# Contributing to Garenne

Merci de votre intérêt pour contribuer à Garenne ! Ce guide vous aidera à comprendre comment participer au développement de cette application de gestion d'élevage.

## Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de l'Environnement](#configuration-de-lenvironnement)
- [Workflow de Développement](#workflow-de-développement)
- [Standards de Code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Soumission des Pull Requests](#soumission-des-pull-requests)

## Code de Conduite

Ce projet adhère au [Contributor Covenant](https://www.contributor-covenant.org/). En participant, vous acceptez de respecter ce code.

## Comment Contribuer

### Types de Contributions

- 🐛 **Corrections de bugs** : Signalez ou corrigez des problèmes
- ✨ **Nouvelles fonctionnalités** : Proposez ou développez de nouvelles features
- 📚 **Documentation** : Améliorez la documentation existante
- 🎨 **UI/UX** : Améliorations de l'interface utilisateur
- ⚡ **Performance** : Optimisations de performance
- 🧪 **Tests** : Ajout ou amélioration des tests

### Signaler un Bug

1. Vérifiez que le bug n'est pas déjà signalé dans les [Issues](https://github.com/hankerspace/garenne/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description détaillée du problème
   - Étapes de reproduction
   - Comportement attendu vs observé
   - Screenshots si pertinent
   - Informations sur l'environnement (OS, navigateur, version)

### Proposer une Fonctionnalité

1. Créez une issue avec le template "Feature Request"
2. Décrivez :
   - Le besoin ou problème à résoudre
   - La solution proposée
   - Les alternatives considérées
   - L'impact sur l'existant
3. Attendez les retours avant de commencer le développement

## Configuration de l'Environnement

### Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **Git**
- **VSCode** (recommandé) avec les extensions :
  - TypeScript
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets

### Installation

```bash
# Fork et clone du repository
git clone https://github.com/VOTRE_USERNAME/garenne.git
cd garenne

# Installation des dépendances
npm install

# Démarrage en développement
npm run dev
```

### Configuration VSCode

Créez `.vscode/settings.json` :

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Workflow de Développement

### 1. Créer une Branche

```bash
# Créer une branche pour votre feature/fix
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-du-bug
```

### 2. Conventions de Nommage

#### Branches
- `feature/description-courte` : Nouvelles fonctionnalités
- `fix/description-courte` : Corrections de bugs
- `docs/description-courte` : Modifications de documentation
- `refactor/description-courte` : Refactoring
- `test/description-courte` : Ajout/modification de tests

#### Commits
Format : `type(scope): description`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatting, sans changement de code
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

Exemples :
```bash
git commit -m "feat(animals): ajouter filtrage par race"
git commit -m "fix(weights): corriger validation du poids"
git commit -m "docs(readme): mise à jour installation"
```

### 3. Développement

#### Structure des Fichiers

```
src/
├── components/          # Composants réutilisables
│   ├── forms/          # Formulaires
│   ├── charts/         # Graphiques
│   └── ui/             # Composants UI de base
├── pages/              # Pages de l'application
│   ├── Animals/        # Gestion des animaux
│   ├── Litters/        # Gestion des portées
│   └── Settings/       # Configuration
├── services/           # Services métier
├── state/             # Gestion d'état Zustand
├── utils/             # Utilitaires
├── models/            # Types TypeScript
└── test/              # Tests
```

#### Ajout d'une Nouvelle Page

1. Créer le dossier dans `src/pages/`
2. Créer les composants :
   - `[Name]ListPage.tsx` - Liste des éléments
   - `[Name]DetailPage.tsx` - Détails d'un élément
   - `[Name]FormPage.tsx` - Formulaire de création/édition
3. Ajouter les routes dans `src/router.tsx`
4. Ajouter la navigation si nécessaire

#### Ajout d'un Nouveau Modèle de Données

1. Définir le type dans `src/models/types.ts`
2. Ajouter les actions au store dans `src/state/store.ts`
3. Créer le schéma de validation dans `src/utils/validation.ts`
4. Ajouter les sélecteurs si nécessaire dans `src/state/selectors.ts`
5. Créer les tests correspondants

## Standards de Code

### TypeScript

- **Mode strict** activé
- Types explicites pour les props et retours de fonction
- Interfaces préférées aux types pour les objets
- Éviter `any`, utiliser `unknown` si nécessaire

```typescript
// ✅ Bon
interface AnimalProps {
  animal: Animal;
  onEdit: (id: UUID) => void;
}

// ❌ Éviter
function AnimalCard(props: any) { ... }
```

### React

- **Composants fonctionnels** uniquement
- **Hooks** pour la logique d'état
- **Memoization** avec `useMemo` et `useCallback` quand nécessaire
- **Props destructuring** au niveau des paramètres

```typescript
// ✅ Bon
const AnimalCard: React.FC<AnimalProps> = ({ animal, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(animal.id);
  }, [onEdit, animal.id]);

  return (
    <Card>
      {/* ... */}
    </Card>
  );
};
```

### Material-UI

- Utiliser le système de thème pour les couleurs et espacements
- Composants responsive avec `useMediaQuery`
- Accessibilité avec les props ARIA appropriées

### État Global (Zustand)

- Actions immutables avec Immer si nécessaire
- Sélecteurs memoïzés pour les calculs complexes
- Séparation claire entre état et actions

## Tests

### Structure

```
src/test/
├── components/         # Tests de composants
├── utils/             # Tests d'utilitaires
├── state/             # Tests du store
└── integration/       # Tests d'intégration
```

### Types de Tests

#### Tests Unitaires
```typescript
// utils/dates.test.ts
import { describe, it, expect } from 'vitest';
import { calculateAge } from '../utils/dates';

describe('calculateAge', () => {
  it('should calculate correct age in months', () => {
    const birthDate = '2024-01-01';
    const age = calculateAge(birthDate);
    expect(age).toMatch(/\d+ mois/);
  });
});
```

#### Tests de Composants
```typescript
// components/AnimalCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimalCard } from './AnimalCard';

describe('AnimalCard', () => {
  it('should render animal name', () => {
    const mockAnimal = { /* ... */ };
    render(<AnimalCard animal={mockAnimal} />);
    expect(screen.getByText(mockAnimal.name)).toBeInTheDocument();
  });
});
```

#### Tests du Store
```typescript
// state/store.test.ts
import { useAppStore } from '../state/store';

describe('Animal Store', () => {
  beforeEach(() => {
    useAppStore.getState().clearAllData();
  });

  it('should add animal correctly', () => {
    const { addAnimal, animals } = useAppStore.getState();
    const animal = addAnimal({ /* ... */ });
    expect(animals).toContain(animal);
  });
});
```

### Commandes de Test

```bash
# Lancer tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec interface UI
npm run test:ui

# Coverage
npm run test:coverage
```

### Couverture de Tests

Objectifs :
- **Utilitaires** : 90%+
- **Store/Services** : 85%+
- **Composants** : 75%+

## Documentation

### Code Documentation

- **JSDoc** pour les fonctions complexes
- **Commentaires** pour la logique métier non évidente
- **README** à jour pour les nouveaux modules

### Types de Documentation

1. **Code Comments** : Expliquer le "pourquoi", pas le "quoi"
2. **JSDoc** : Pour les fonctions publiques
3. **README** : Pour les modules complexes
4. **API.md** : Pour les APIs publiques

## Soumission des Pull Requests

### Checklist

Avant de soumettre :

- [ ] Tests passent (`npm run test:run`)
- [ ] Build fonctionne (`npm run build`)
- [ ] Linting propre (`npm run lint`)
- [ ] Code formaté selon les standards
- [ ] Documentation mise à jour si nécessaire
- [ ] Commits avec messages descriptifs
- [ ] Branche à jour avec `main`

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
Étapes pour reproduire/tester les changements

## Screenshots
Si applicable, ajoutez des screenshots

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Backward compatibility maintenue
```

### Review Process

1. **Auto-checks** : GitHub Actions vérifient build/tests/linting
2. **Review** : Au moins un maintainer review le code
3. **Discussion** : Feedback et ajustements si nécessaire
4. **Merge** : Squash merge vers `main`

## Questions et Support

- **Issues** : Pour bugs et features
- **Discussions** : Pour questions générales
- **Email** : [maintainers@garenne.app] pour questions privées

Merci de contribuer à Garenne ! 🐰❤️