#!/usr/bin/env node
/**
 * Bundle Size Analyzer
 * 
 * This script analyzes the build output to identify large dependencies
 * and suggests optimizations for reducing bundle size.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

/**
 * Analyze bundle sizes
 */
function analyzeBundles() {
  console.log('🔍 Analyzing bundle sizes...\n');

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found. Please run `npm run build` first.');
    process.exit(1);
  }

  const files = fs.readdirSync(ASSETS_DIR);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));

  console.log('📊 JavaScript Bundles:');
  console.log('=======================');

  const jsAnalysis = jsFiles.map(file => {
    const filepath = path.join(ASSETS_DIR, file);
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    
    // Identify bundle type based on filename patterns
    let type = 'Unknown';
    let suggestions = [];
    
    if (file.includes('vendor')) {
      type = 'Vendor Dependencies';
      if (sizeKB > 500) {
        suggestions.push('Consider code splitting vendor dependencies');
        suggestions.push('Review if all vendor dependencies are necessary');
      }
    } else if (file.includes('mui')) {
      type = 'Material-UI';
      if (sizeKB > 400) {
        suggestions.push('Use tree shaking for MUI components');
        suggestions.push('Consider using MUI component imports individually');
      }
    } else if (file.includes('charts')) {
      type = 'Charts Library';
      if (sizeKB > 300) {
        suggestions.push('Lazy load chart components');
        suggestions.push('Consider lighter chart libraries');
      }
    } else if (file.includes('index')) {
      type = 'Main Application';
      if (sizeKB > 300) {
        suggestions.push('Implement more aggressive code splitting');
        suggestions.push('Move non-critical code to lazy chunks');
      }
    } else if (file.includes('qrcode')) {
      type = 'QR Code Library';
      suggestions.push('Lazy load QR code functionality');
    } else {
      type = 'Page/Component';
    }

    return { file, sizeKB, type, suggestions };
  }).sort((a, b) => b.sizeKB - a.sizeKB);

  jsAnalysis.forEach(({ file, sizeKB, type, suggestions }) => {
    console.log(`📦 ${file}`);
    console.log(`   Size: ${sizeKB} KB`);
    console.log(`   Type: ${type}`);
    if (suggestions.length > 0) {
      console.log(`   💡 Suggestions:`);
      suggestions.forEach(suggestion => {
        console.log(`      - ${suggestion}`);
      });
    }
    console.log('');
  });

  console.log('🎨 CSS Bundles:');
  console.log('================');

  cssFiles.forEach(file => {
    const filepath = path.join(ASSETS_DIR, file);
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`📄 ${file}: ${sizeKB} KB`);
  });

  console.log('\n📈 Bundle Analysis Summary:');
  console.log('============================');

  const totalJsSize = jsAnalysis.reduce((sum, { sizeKB }) => sum + sizeKB, 0);
  const totalCssSize = cssFiles.reduce((sum, file) => {
    const filepath = path.join(ASSETS_DIR, file);
    return sum + Math.round(fs.statSync(filepath).size / 1024);
  }, 0);

  console.log(`Total JS Size: ${totalJsSize} KB`);
  console.log(`Total CSS Size: ${totalCssSize} KB`);
  console.log(`Total Size: ${totalJsSize + totalCssSize} KB`);

  // Provide general recommendations
  console.log('\n🎯 General Recommendations:');
  console.log('=============================');

  if (totalJsSize > 1000) {
    console.log('⚠️  Large bundle size detected (>1MB)');
    console.log('   Consider implementing more aggressive code splitting');
  }

  if (jsAnalysis.some(({ sizeKB }) => sizeKB > 500)) {
    console.log('⚠️  Large individual chunks detected');
    console.log('   Break down large chunks into smaller pieces');
  }

  console.log('✅ Use dynamic imports for feature-based code splitting');
  console.log('✅ Implement lazy loading for non-critical components');
  console.log('✅ Use tree shaking to eliminate unused code');
  console.log('✅ Consider using webpack-bundle-analyzer for detailed analysis');

  console.log('\n💡 Next Steps:');
  console.log('===============');
  console.log('1. Run `npm run analyze` to see detailed bundle composition');
  console.log('2. Implement suggested optimizations');
  console.log('3. Monitor bundle size changes in CI/CD pipeline');
}

analyzeBundles();

export { analyzeBundles };