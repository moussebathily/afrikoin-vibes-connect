#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Vérification stricte des types JavaScript/TypeScript...\n');

const commands = [
  {
    name: 'TypeScript Strict Check',
    cmd: 'npx tsc --project tsconfig.strict.json --noEmit --pretty --listFiles',
    description: 'Vérification stricte avec rapport d'erreurs étendu'
  },
  {
    name: 'JavaScript Check',
    cmd: 'npx tsc --allowJs --checkJs --noEmit --target es2020 --moduleResolution node src/**/*.js src/**/*.jsx',
    description: 'Vérification des fichiers JavaScript'
  },
  {
    name: 'ESLint TypeScript',
    cmd: 'npx eslint "src/**/*.{ts,tsx,js,jsx}" --ext .ts,.tsx,.js,.jsx',
    description: 'Vérification des règles de code'
  }
];

let hasErrors = false;

commands.forEach(({ name, cmd, description }) => {
  try {
    console.log(`📋 ${name}`);
    console.log(`   ${description}`);
    console.log(`   Commande: ${cmd}\n`);
    
    const output = execSync(cmd, { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    
    if (output.trim()) {
      console.log(output);
    }
    console.log(`✅ ${name} - Terminé avec succès\n`);
    
  } catch (error) {
    hasErrors = true;
    console.error(`❌ ${name} - Erreurs détectées:`);
    console.error(error.stdout || error.message);
    console.error('');
  }
});

if (hasErrors) {
  console.log('🚨 Des erreurs ont été détectées dans les fichiers JavaScript/TypeScript');
  console.log('💡 Utilisez la configuration stricte pour un meilleur développement');
  process.exit(1);
} else {
  console.log('🎉 Aucune erreur détectée - Code validé !');
  process.exit(0);
}