#!/usr/bin/env node
/**
 * Script pour identifier les dépendances inutilisées et les optimisations de bundle
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lire package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Configuration des patterns de recherche
const searchPatterns = {
  react: ['import.*from [\'"]react[\'"]', 'import.*React'],
  'react-dom': ['import.*from [\'"]react-dom[\'"]'],
  '@mui/material': ['import.*from [\'"]@mui/material[\'"]', 'import.*@mui/material'],
  '@mui/icons-material': ['import.*from [\'"]@mui/icons-material[\'"]'],
  'recharts': ['import.*from [\'"]recharts[\'"]'],
  'react-router-dom': ['import.*from [\'"]react-router-dom[\'"]'],
  'zustand': ['import.*from [\'"]zustand[\'"]'],
  'react-hook-form': ['import.*from [\'"]react-hook-form[\'"]'],
  'date-fns': ['import.*from [\'"]date-fns[\'"]'],
  'qrcode': ['import.*from [\'"]qrcode[\'"]'],
  'uuid': ['import.*from [\'"]uuid[\'"]'],
  'zod': ['import.*from [\'"]zod[\'"]'],
  'file-saver': ['import.*from [\'"]file-saver[\'"]'],
  'lz-string': ['import.*from [\'"]lz-string[\'"]']
};

function searchInFiles(directory, patterns) {
  const results = {};
  
  try {
    const grepCommand = `find ${directory} -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -1000`;
    const files = execSync(grepCommand, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    
    for (const [dep, patternList] of Object.entries(patterns)) {
      results[dep] = false;
      
      for (const pattern of patternList) {
        try {
          const command = `grep -l "${pattern}" ${files.join(' ')} 2>/dev/null || true`;
          const found = execSync(command, { encoding: 'utf8' }).trim();
          if (found) {
            results[dep] = true;
            break;
          }
        } catch (error) {
          // Continue si grep échoue
        }
      }
    }
  } catch (error) {
    console.warn('Erreur lors de la recherche:', error.message);
  }
  
  return results;
}

function analyzeBundle() {
  console.log('🔍 Analyse des dépendances du bundle...\n');
  
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  // Rechercher l'utilisation des dépendances dans le code source
  const srcPath = path.join(__dirname, '..', 'src');
  const usage = searchInFiles(srcPath, searchPatterns);
  
  console.log('📦 Analyse des dépendances de production:\n');
  
  const unusedDeps = [];
  const usedDeps = [];
  
  for (const [dep, version] of Object.entries(dependencies)) {
    const isUsed = usage[dep] !== false;
    
    if (isUsed) {
      usedDeps.push({ name: dep, version, size: 'Analysing...' });
      console.log(`✅ ${dep}@${version} - Utilisé`);
    } else {
      unusedDeps.push({ name: dep, version });
      console.log(`❌ ${dep}@${version} - Non utilisé ou non détecté`);
    }
  }
  
  console.log('\n📊 Résumé:\n');
  console.log(`Total des dépendances: ${Object.keys(dependencies).length}`);
  console.log(`Dépendances utilisées: ${usedDeps.length}`);
  console.log(`Dépendances potentiellement inutilisées: ${unusedDeps.length}`);
  
  if (unusedDeps.length > 0) {
    console.log('\n⚠️  Dépendances potentiellement inutilisées:');
    unusedDeps.forEach(dep => {
      console.log(`   - ${dep.name}@${dep.version}`);
    });
    
    console.log('\n💡 Suggestions:');
    console.log('   1. Vérifiez manuellement ces dépendances avant de les supprimer');
    console.log('   2. Utilisez `npm uninstall <package>` pour les supprimer');
    console.log('   3. Testez l\'application après suppression');
  }
  
  // Suggestions d'optimisation spécifiques
  console.log('\n🎯 Suggestions d\'optimisation:');
  
  if (dependencies['@mui/material']) {
    console.log('   📦 Material-UI:');
    console.log('      - Utilisez les imports spécifiques: import Button from "@mui/material/Button"');
    console.log('      - Configurez babel-plugin-import pour le tree shaking');
  }
  
  if (dependencies['recharts']) {
    console.log('   📊 Recharts:');
    console.log('      - Lazy load les composants de graphiques');
    console.log('      - Considérez une alternative plus légère pour les graphiques simples');
  }
  
  if (dependencies['date-fns']) {
    console.log('   📅 date-fns:');
    console.log('      - Utilisez les imports spécifiques: import format from "date-fns/format"');
    console.log('      - Configurez babel-plugin-date-fns pour le tree shaking');
  }
  
  console.log('\n🚀 Prochaines étapes:');
  console.log('   1. npm run build pour voir l\'impact sur la taille du bundle');
  console.log('   2. npm run analyze-bundle pour l\'analyse détaillée');
  console.log('   3. Implémentez le lazy loading pour les gros composants');
}

// Exécuter l'analyse
analyzeBundle();