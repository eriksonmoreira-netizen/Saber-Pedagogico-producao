import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './src/lib/prisma'; // Importa o singleton estável

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// HostGator injeta a porta automaticamente via process.env.PORT
const port = process.env.PORT || 3000;

// Middleware (Casting para 'any' resolve conflitos de tipagem do Express v5 beta vs types v4)
app.use(cors() as any);
app.use(express.json() as any);

// --- Servir Frontend (Vite Build) ---
// Em produção, o server.js compilado estará dentro da pasta 'dist'.
// Os arquivos estáticos (index.html, assets) também estarão lá.
app.use(express.static(__dirname) as any);

// --- Middleware de Logs ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- API ROUTES ---

// Auth Sync
app.post('/api/auth/sync', async (req, res) => {
  try {
    const { email, full_name, photo_url } = req.body;
    const isMaster = email.toLowerCase().trim() === 'erikson.moreira@gmail.com';
    
    console.log(`[Auth] Sync: ${email}`);

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        last_login: new Date(),
        ...(isMaster ? { role: 'SUPER_ADM', plan: 'GESTOR', full_name: 'Erikson Moreira', status: 'ativo' } : {})
      },
      create: {
        email: email.toLowerCase(),
        full_name: full_name,
        photo_url: photo_url,
        role: isMaster ? 'SUPER_ADM' : 'TEACHER',
        plan: isMaster ? 'GESTOR' : 'SEMENTE',
        status: 'ativo'
      }
    });
    res.json(user);
  } catch (error) {
    console.error('Auth Error:', error);
    // Fallback gracioso se o banco cair
    res.status(200).json({
        id: 'offline-user',
        email: req.body.email,
        full_name: req.body.full_name,
        role: 'TEACHER',
        plan: 'SEMENTE',
        status: 'ativo'
    });
  }
});

// Classes Routes
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.schoolClass.findMany();
    res.json(classes);
  } catch (e) { res.json([]); }
});

app.post('/api/classes', async (req, res) => {
  try {
    const newClass = await prisma.schoolClass.create({ data: req.body });
    res.json(newClass);
  } catch (e) { res.status(500).json({error: 'Erro ao criar turma'}); }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await prisma.schoolClass.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir." });
  }
});

app.patch('/api/classes/:id', async (req, res) => {
  try {
    const updated = await prisma.schoolClass.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar." });
  }
});

// Dashboard Data
app.get('/admin/dashboard-data', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      kpis: {
        totalUsers: users.length,
        activeSubscribers: users.filter((u: any) => u.plan !== 'SEMENTE').length,
        inactiveUsers: 0,
        estimatedRevenue: 1000
      },
      users: users
    });
  } catch (e) {
    res.status(500).json({error: 'Erro admin'});
  }
});

// --- SPA Fallback ---
// Qualquer rota não capturada acima retorna o index.html para o React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`[Server] Rodando na porta ${port}`);
});