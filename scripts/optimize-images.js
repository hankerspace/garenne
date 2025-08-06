import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';
import { promises as fs } from 'fs';
import path from 'path';

async function optimizeImages() {
  const inputDir = 'src/assets';
  const outputDir = 'src/assets/optimized';
  
  try {
    // Créer le dossier de sortie s'il n'existe pas
    await fs.mkdir(outputDir, { recursive: true });
    
    // Optimiser PNG avec pngquant
    await imagemin([`${inputDir}/*.png`], {
      destination: outputDir,
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });
    
    // Générer des versions WebP
    await imagemin([`${inputDir}/*.png`], {
      destination: outputDir,
      plugins: [
        imageminWebp({
          quality: 80
        })
      ]
    });
    
    // Générer des versions AVIF
    await imagemin([`${inputDir}/*.png`], {
      destination: outputDir,
      plugins: [
        imageminAvif({
          quality: 70
        })
      ]
    });
    
    console.log('Images optimized successfully!');
    
    // Afficher les tailles des fichiers
    const files = await fs.readdir(outputDir);
    for (const file of files) {
      const stats = await fs.stat(path.join(outputDir, file));
      console.log(`${file}: ${(stats.size / 1024).toFixed(1)} KB`);
    }
    
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();