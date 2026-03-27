// ══════════════════════════════════════════════════════════════
// controllers/authController.js
// Logique métier pour l'inscription et la connexion.
// ══════════════════════════════════════════════════════════════

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Fonction utilitaire : génère un token JWT ─────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/register — Créer un nouveau compte
// Body : { firstName, lastName, email, phone, password, newsletter }
// ══════════════════════════════════════════════════════════════
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, newsletter } = req.body;

    // ── Validation des champs obligatoires ──────────────────
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Prénom, nom, email et mot de passe sont obligatoires.',
      });
    }

    // ── Vérifier si l'email est déjà utilisé ────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà. Veuillez vous connecter.',
      });
    }

    // ── Créer l'utilisateur (le mot de passe est haché par le middleware pre-save) ──
    const user = await User.create({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.toLowerCase().trim(),
      phone:     phone?.trim() || '',
      password,
      newsletter: newsletter || false,
    });

    // ── Générer le token JWT ─────────────────────────────────
    const token = generateToken(user._id);

    console.log(`✅ Nouveau compte : ${user.email}`);

    // ── Réponse avec le profil public (sans mot de passe) ───
    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès !',
      token,
      user: user.toPublicJSON(),
    });

  } catch (err) {
    // Erreur de validation Mongoose (ex: email invalide)
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' ') });
    }
    console.error('❌ Erreur register :', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur. Veuillez réessayer plus tard.',
    });
  }
};

// ══════════════════════════════════════════════════════════════
// POST /api/auth/login — Connexion
// Body : { email, password }
// ══════════════════════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validation ───────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont requis.',
      });
    }

    // ── Chercher l'utilisateur (on inclut le password pour la vérification) ──
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      // Message générique pour éviter de révéler si l'email existe
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // ── Comparer le mot de passe avec bcrypt ────────────────
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // ── Générer le token JWT ─────────────────────────────────
    const token = generateToken(user._id);

    console.log(`✅ Connexion : ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: user.toPublicJSON(),
    });

  } catch (err) {
    console.error('❌ Erreur login :', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur. Veuillez réessayer plus tard.',
    });
  }
};

// ══════════════════════════════════════════════════════════════
// GET /api/auth/me — Profil de l'utilisateur connecté
// (Route protégée — nécessite un token valide)
// ══════════════════════════════════════════════════════════════
const getMe = async (req, res) => {
  // req.user est injecté par le middleware `protect`
  return res.status(200).json({
    success: true,
    user: req.user.toPublicJSON(),
  });
};

// ══════════════════════════════════════════════════════════════
// PUT /api/auth/me — Mise à jour du profil
// Body : { firstName, lastName, phone, newsletter }
// ══════════════════════════════════════════════════════════════
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, newsletter } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone, newsletter },
      { new: true, runValidators: true } // new: retourne le doc mis à jour
    );

    return res.status(200).json({
      success: true,
      message: 'Profil mis à jour.',
      user: updatedUser.toPublicJSON(),
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' ') });
    }
    console.error('❌ Erreur updateProfile :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/auth/change-password — Changer le mot de passe
// Body : { currentPassword, newPassword }
// ══════════════════════════════════════════════════════════════
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Ancien et nouveau mot de passe requis.',
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
      });
    }

    // Charger le user avec son password hashé
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect.',
      });
    }

    // Le middleware pre-save va re-hacher automatiquement
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
    });

  } catch (err) {
    console.error('❌ Erreur changePassword :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
