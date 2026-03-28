// ══════════════════════════════════════════════════════════════
// server.js — Point d'entrée principal de l'API MH PICTURE
// Stack : Node.js · Express · MongoDB (Mongoose)
// Compatible Railway : PORT dynamique, CORS configurable via .env
// ══════════════════════════════════════════════════════════════

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

// Import des routes
const authRoutes  = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app  = express();

// ── PORT : Railway injecte automatiquement process.env.PORT ──
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════════
// CONNEXION À MONGODB
// ══════════════════════════════════════════════════════════════
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB avec succès !'))
  .catch(err => {
    console.error('💥 Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });

// ══════════════════════════════════════════════════════════════
// MIDDLEWARES GLOBAUX
// ══════════════════════════════════════════════════════════════

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── CORS ─────────────────────────────────────────────────────
// En développement : ALLOWED_ORIGIN=* dans .env
// En production    : ALLOWED_ORIGIN=https://ton-username.github.io
const allowedOrigins = (process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin(origin, callback) {
    // Autorise les requêtes sans origine (Postman, apps mobiles)
    if (!origin) return callback(null, true);
    // Autorise tout si '*' est dans la liste
    if (allowedOrigins.includes('*')) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origine non autorisée par CORS : ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ── Logs HTTP (désactivés en test) ───────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Rate Limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Trop de requêtes. Réessayez plus tard.' }
});
app.use('/api', limiter);

// Limite stricte sur l'auth (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Trop de tentatives. Réessayez dans 15 minutes.' }
});

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

app.use('/api/auth',   authLimiter, authRoutes);
app.use('/api/orders', orderRoutes);

// Route de santé — utile pour Railway Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'API MH PICTURE opérationnelle',
    environment: process.env.NODE_ENV || 'development',
    uptime:      Math.floor(process.uptime()) + 's',
  });
});

// ══════════════════════════════════════════════════════════════
// GESTION DES ERREURS
// ══════════════════════════════════════════════════════════════

// 404 — Route introuvable
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable.' });
});

// 500 — Erreur globale
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥 Erreur :', err.stack || err.message);

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur.'
      : err.message,
  });
});

// ══════════════════════════════════════════════════════════════
// DÉMARRAGE
// ══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS autorisé : ${allowedOrigins.join(', ')}`);
});

module.exports = app;
