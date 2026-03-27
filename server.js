// ══════════════════════════════════════════════════════════════
// server.js — Point d'entrée principal de l'API MH PICTURE
// Stack : Node.js · Express · MongoDB (Mongoose)
// ══════════════════════════════════════════════════════════════

// ── Chargement des variables d'environnement (.env) ──────────


// ══════════════════════════════════════════════════════════════
// CONNEXION À MONGODB
// ══════════════════════════════════════════════════════════════
const express = require('express');
const Datastore = require('nedb');
const path = require('path');
const app = express();

// On crée nos "fichiers-bases"
const usersDB = new Datastore({ filename: 'users.db', autoload: true });
const ordersDB = new Datastore({ filename: 'orders.db', autoload: true });

app.use(express.json());
app.use(express.static('public'));

// Exemple pour l'inscription
app.post('/api/auth/register', (req, res) => {
    const newUser = req.body;
    usersDB.insert(newUser, (err, doc) => {
        if (err) return res.status(500).send(err);
        res.status(201).json(doc);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));


// ══════════════════════════════════════════════════════════════
// MIDDLEWARES GLOBAUX
// ══════════════════════════════════════════════════════════════

// ── Sécurité HTTP (headers protecteurs) ──────────────────────
app.use(helmet());

// ── CORS — Autoriser uniquement l'origine du frontend ────────
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ── Parsing JSON & URL-encoded ────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Limite la taille des requêtes
app.use(express.urlencoded({ extended: true }));

// ── Logs HTTP (désactivé en test, utile en dev/prod) ─────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Rate Limiting — Protection contre les attaques par force brute ──
// Limite à 100 requêtes par fenêtre de 15 minutes par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette adresse IP. Réessayez dans 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Limiteur plus strict sur les routes d'auth (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      15,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez patienter 15 minutes.',
  },
});

app.use('/api', limiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════
app.use('/api/auth',   authRoutes);
app.use('/api/orders', orderRoutes);

// ── Route de santé — pour vérifier que l'API tourne ──────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status:  'OK',
    message: 'API MH PICTURE opérationnelle',
    env:     process.env.NODE_ENV,
    uptime:  Math.floor(process.uptime()) + 's',
  });
});

// ══════════════════════════════════════════════════════════════
// GESTION DES ROUTES INCONNUES (404)
// ══════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable : ${req.method} ${req.originalUrl}`,
  });
});

// ══════════════════════════════════════════════════════════════
// GESTIONNAIRE D'ERREURS GLOBAL (500)
// Doit être déclaré EN DERNIER, après toutes les routes.
// ══════════════════════════════════════════════════════════════
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥 Erreur non gérée :', err.stack);

  // Ne pas exposer les détails en production
  const isDev = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur.',
    ...(isDev && { stack: err.stack }), // Stack trace uniquement en dev
  });
});

// ══════════════════════════════════════════════════════════════
// DÉMARRAGE DU SERVEUR
// ══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 Serveur MH PICTURE démarré sur http://localhost:${PORT}`);
  console.log(`   Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS autorisé : ${corsOptions.origin}`);
});

module.exports = app; // Exporté pour les tests (Jest, etc.)

const path = require('path');

// Indique à Express où se trouvent tes fichiers HTML/CSS
app.use(express.static(path.join(__dirname, 'public')));

// Route pour envoyer le fichier index.html par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

