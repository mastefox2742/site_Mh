// ══════════════════════════════════════════════════════════════
// server.js — Point d'entrée principal de l'API MH PICTURE
// Stack : Node.js · Express · MongoDB (Mongoose)
// ══════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import des routes (Assure-toi que ces fichiers existent dans le dossier /routes)
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════════
// CONNEXION À MONGODB
// ══════════════════════════════════════════════════════════════
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB avec succès !'))
  .catch(err => {
    console.error('💥 Erreur de connexion MongoDB :', err.message);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });

// ══════════════════════════════════════════════════════════════
// MIDDLEWARES GLOBAUX
// ══════════════════════════════════════════════════════════════

app.use(helmet()); // Sécurité des headers HTTP
app.use(express.json({ limit: '10kb' })); // Parsing JSON
app.use(express.urlencoded({ extended: true }));

// Configuration CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*', // '*' autorise tout, change le par ton URL frontend plus tard
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev')); // Logs des requêtes
}

// Limiteur de requêtes (Protection Anti-Spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { success: false, message: 'Trop de requêtes. Réessayez plus tard.' }
});
app.use('/api', limiter);

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API MH PICTURE opérationnelle',
    uptime: Math.floor(process.uptime()) + 's'
  });
});

// Gestion 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

// Gestionnaire d'erreurs global (500)
app.use((err, req, res, next) => {
  console.error('💥 Erreur :', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur.'
  });
});

// ══════════════════════════════════════════════════════════════
// DÉMARRAGE
// ══════════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
