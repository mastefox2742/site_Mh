// ══════════════════════════════════════════════════════════════
// models/User.js — Schéma utilisateur (Mongoose)
// ══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // ── Informations personnelles ────────────────────────────
    firstName: {
      type:     String,
      required: [true, 'Le prénom est obligatoire.'],
      trim:     true,
      maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères.'],
    },
    lastName: {
      type:     String,
      required: [true, 'Le nom est obligatoire.'],
      trim:     true,
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères.'],
    },
    email: {
      type:     String,
      required: [true, "L'email est obligatoire."],
      unique:   true,   // index unique — MongoDB rejette les doublons
      lowercase: true,
      trim:     true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Veuillez fournir un email valide.',
      ],
    },
    phone: {
      type:  String,
      trim:  true,
      default: '',
    },

    // ── Sécurité ──────────────────────────────────────────────
    password: {
      type:     String,
      required: [true, 'Le mot de passe est obligatoire.'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.'],
      select:   false, // ← Jamais renvoyé dans les requêtes par défaut
    },

    // ── Préférences ───────────────────────────────────────────
    newsletter: {
      type:    Boolean,
      default: false,
    },

    // ── Rôle (pour une future administration) ─────────────────
    role: {
      type:    String,
      enum:    ['client', 'admin'],
      default: 'client',
    },

    // ── Adresses de livraison sauvegardées ────────────────────
    addresses: [
      {
        label:    { type: String, default: 'Domicile' },
        address:  { type: String },
        zip:      { type: String },
        city:     { type: String },
        country:  { type: String, default: 'France' },
        isDefault:{ type: Boolean, default: false },
      },
    ],
  },
  {
    // Ajoute automatiquement `createdAt` et `updatedAt`
    timestamps: true,
  }
);

// ══════════════════════════════════════════════════════════════
// MIDDLEWARE PRE-SAVE — Hachage du mot de passe avec bcrypt
// Déclenché uniquement si le champ `password` a été modifié.
// ══════════════════════════════════════════════════════════════
UserSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas changé, on ne re-hache pas
  if (!this.isModified('password')) return next();

  // Coût de hachage : 12 (bon équilibre sécurité / performance)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ══════════════════════════════════════════════════════════════
// MÉTHODE D'INSTANCE — Vérification du mot de passe
// Usage : const ok = await user.comparePassword(motDePasseSaisi);
// ══════════════════════════════════════════════════════════════
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ══════════════════════════════════════════════════════════════
// MÉTHODE D'INSTANCE — Retourne un objet propre (sans password)
// ══════════════════════════════════════════════════════════════
UserSchema.methods.toPublicJSON = function () {
  return {
    id:         this._id,
    firstName:  this.firstName,
    lastName:   this.lastName,
    email:      this.email,
    phone:      this.phone,
    newsletter: this.newsletter,
    role:       this.role,
    createdAt:  this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
