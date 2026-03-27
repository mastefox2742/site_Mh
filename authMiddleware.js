// ══════════════════════════════════════════════════════════════
// middleware/authMiddleware.js
// Vérifie le token JWT avant d'accéder aux routes protégées.
// ══════════════════════════════════════════════════════════════

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── protect — Route accessible uniquement si connecté ─────────
const protect = async (req, res, next) => {
  let token;

  // 1. Lire le token depuis le header Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Refuser si aucun token n'est fourni
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Vous devez être connecté.',
    });
  }

  try {
    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Charger l'utilisateur depuis la base (sans le mot de passe)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable. Token invalide.',
      });
    }

    // 5. Attacher l'utilisateur à la requête pour les prochains middlewares
    req.user = user;
    next();

  } catch (err) {
    // Token expiré, falsifié ou malformé
    console.error('❌ Erreur JWT :', err.message);
    return res.status(401).json({
      success: false,
      message: 'Session expirée ou token invalide. Veuillez vous reconnecter.',
    });
  }
};

// ── adminOnly — Réservé aux administrateurs ───────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Accès refusé. Droits administrateur requis.',
  });
};

// ── optionalAuth — Route accessible à tous, mais enrichit req.user si connecté ──
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null; // Pas connecté, mais on continue quand même
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    req.user = null; // Token invalide → on traite comme invité
  }

  next();
};

module.exports = { protect, adminOnly, optionalAuth };
