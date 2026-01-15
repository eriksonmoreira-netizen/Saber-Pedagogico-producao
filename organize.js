
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const scriptName = path.basename(__filename);

// Lista de arquivos/pastas críticos que indicam a raiz do projeto Next.js
const CRITICAL_FILES = ['package.json', 'next.config.mjs', 'next.config.js'];

function findProjectRoot(dir) {
  const files = fs.readdirSync(dir);
  
  // Se encontrar package.json E next.config, achamos o projeto
  const hasPackageJson = files.includes('package.json');
  const hasNextConfig = files.includes('next.config.mjs') || files.includes('next.config.js');

  if (hasPackageJson && hasNextConfig) {
    return dir;
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Ignora node_modules e .git para performance
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      const found = findProjectRoot(fullPath);
      if (found) return found;
    }
  }
  return null;
}

function moveFilesToRoot(sourceDir) {
  console.log(`\n🔍 Projeto encontrado em: ${sourceDir}`);
  console.log('🚀 Iniciando migração para a raiz...\n');

  const files = fs.readdirSync(sourceDir);

  files.forEach(file => {
    if (file === 'node_modules') {
      console.log('🗑️  Removendo node_modules antigo para evitar conflitos (será necessário reinstalar)...');
      fs.rmSync(path.join(sourceDir, file), { recursive: true, force: true });
      return;
    }

    const oldPath = path.join(sourceDir, file);
    const newPath = path.join(rootDir, file);

    // Evita sobrescrever o próprio script ou a pasta .git da raiz se já existir
    if (file === scriptName || file === '.git') return;

    try {
      if (fs.existsSync(newPath)) {
        console.warn(`⚠️  Aviso: ${file} já existe na raiz. Substituindo...`);
        fs.rmSync(newPath, { recursive: true, force: true });
      }
      
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Movido: ${file}`);
    } catch (err) {
      console.error(`❌ Erro ao mover ${file}:`, err.message);
    }
  });
}

function updatePackageJson() {
  const pkgPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('❌ package.json não encontrado na raiz após mover arquivos.');
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    console.log('\n⚙️  Atualizando scripts para Hostinger...');
    
    // Configurações específicas para Hostinger
    pkg.scripts = {
      ...pkg.scripts,
      "dev": "next dev",
      // Prisma generate é vital antes do build
      "build": "prisma generate && next build",
      // Comando exato que a Hostinger precisa para modo standalone
      "start": "node .next/standalone/server.js",
      "postinstall": "prisma generate"
    };

    // Garante engines
    if (!pkg.engines) pkg.engines = {};
    pkg.engines.node = ">=18.17.0";

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('✅ package.json atualizado com sucesso.');
  } catch (e) {
    console.error('Erro ao atualizar package.json:', e);
  }
}

function cleanupEmptyDirs(dir) {
  // Não remove a própria raiz ou .git
  if (dir === rootDir || dir.includes('.git')) return;

  const files = fs.readdirSync(dir);
  
  if (files.length > 0) {
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        cleanupEmptyDirs(fullPath);
      }
    });
  }

  // Verifica novamente se ficou vazia após limpar subpastas
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log(`🧹 Pasta vazia removida: ${dir}`);
  }
}

// Execução Principal
const projectSource = findProjectRoot(rootDir);

if (!projectSource) {
  console.log('❌ Nenhum projeto Next.js (package.json + next.config) encontrado em subpastas.');
} else if (projectSource === rootDir) {
  console.log('✅ O projeto já está na raiz. Atualizando apenas o package.json...');
  updatePackageJson();
} else {
  moveFilesToRoot(projectSource);
  updatePackageJson();
  console.log('\n🧹 Limpando pastas vazias antigas...');
  cleanupEmptyDirs(projectSource); // Tenta limpar a árvore antiga
  
  console.log('\n🎉 SUCESSO! Projeto movido para a raiz.');
  console.log('👉 Próximos passos:');
  console.log('1. Rode "npm install"');
  console.log('2. Teste com "npm run build"');
  console.log('3. Faça o commit e push.');
}
