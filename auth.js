// ══════════════════════════════════════════════════════════════
// routes/auth.js — Endpoints d'authentification
// Base : /api/auth
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

// POST /api/auth/register — Créer un compte
router.post('/register', register);

// POST /api/auth/login — Se connecter
router.post('/login', login);

// GET  /api/auth/me — Profil de l'utilisateur connecté (🔒 protégé)
router.get('/me', protect, getMe);

// PUT  /api/auth/me — Mettre à jour le profil (🔒 protégé)
router.put('/me', protect, updateProfile);

// PUT  /api/auth/change-password — Changer le mot de passe (🔒 protégé)
router.put('/change-password', protect, changePassword);

module.exports = router;
