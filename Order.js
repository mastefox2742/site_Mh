// ══════════════════════════════════════════════════════════════
// models/Order.js — Schéma commande (Mongoose)
// ══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

// ── Sous-schéma : un article du panier ───────────────────────
const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },   // ID produit frontend
    name:      { type: String, required: true },   // Nom de l'affiche
    variant:   { type: String, required: true },   // Format : "A3", "A4", etc.
    collection:{ type: String },                   // Catégorie : "Psaumes", etc.
    qty:       { type: Number, required: true, min: 1 },
    priceFcfa: { type: Number, required: true },   // Prix unitaire en FCFA
    priceEur:  { type: Number },                   // Prix unitaire en EUR
    img:       { type: String },                   // Chemin de l'image
  },
  { _id: false } // Pas besoin d'_id sur chaque article
);

// ── Sous-schéma : adresse de livraison ────────────────────────
const ShippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName:  { type: String },
    address:   { type: String },
    zip:       { type: String },
    city:      { type: String },
    country:   { type: String, default: 'Congo' },
    phone:     { type: String },
  },
  { _id: false }
);

// ── Schéma principal : Commande ───────────────────────────────
const OrderSchema = new mongoose.Schema(
  {
    // Référence au client (null si invité)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      default: null,
    },

    // Email de contact (pour les invités et les notifications)
    customerEmail: {
      type:     String,
      required: true,
      lowercase: true,
      trim:     true,
    },

    // Numéro de commande lisible (ex: CMD-1749483920000)
    orderNumber: {
      type:    String,
      unique:  true,
      default: () => 'CMD-' + Date.now(),
    },

    // Liste des articles commandés
    items: {
      type:     [OrderItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message:   'La commande doit contenir au moins un article.',
      },
    },

    // Totaux
    totalFcfa: { type: Number, required: true }, // Total en FCFA
    totalEur:  { type: Number },                 // Total en EUR

    // Livraison
    shippingAddress: { type: ShippingAddressSchema },
    shippingMethod:  {
      type:    String,
      enum:    ['standard', 'express', 'retrait'],
      default: 'standard',
    },
    shippingCost: { type: Number, default: 0 },

    // Mode de paiement choisi
    paymentMethod: {
      type:    String,
      enum:    ['stripe', 'paypal', 'momo_mtn', 'airtel_money', 'non_defini'],
      default: 'non_defini',
    },

    // Référence de transaction (Stripe PaymentIntent ID, etc.)
    transactionId: { type: String, default: '' },

    // Statut de la commande (cycle de vie)
    status: {
      type:    String,
      enum:    ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee', 'remboursee'],
      default: 'en_attente',
    },

    // Historique des changements de statut (pour le suivi)
    statusHistory: [
      {
        status:    { type: String },
        changedAt: { type: Date, default: Date.now },
        note:      { type: String },
      },
    ],

    // Notes internes ou message du client
    customerNote: { type: String, default: '' },
  },
  {
    timestamps: true, // createdAt, updatedAt automatiques
  }
);

// ══════════════════════════════════════════════════════════════
// INDEX — Accélère les requêtes fréquentes
// ══════════════════════════════════════════════════════════════
OrderSchema.index({ user: 1, createdAt: -1 });       // Commandes d'un client
OrderSchema.index({ customerEmail: 1, createdAt: -1 }); // Commandes par email
OrderSchema.index({ orderNumber: 1 });               // Recherche par numéro

// ══════════════════════════════════════════════════════════════
// MIDDLEWARE PRE-SAVE — Enregistre le premier statut dans l'historique
// ══════════════════════════════════════════════════════════════
OrderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, note: 'Commande créée' });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
