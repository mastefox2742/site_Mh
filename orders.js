// ══════════════════════════════════════════════════════════════
// routes/orders.js — Endpoints commandes
// Base : /api/orders
// ══════════════════════════════════════════════════════════════

const express = require('express');
const router  = express.Router();
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// POST /api/orders — Créer une commande (connecté OU invité)
router.post('/', optionalAuth, createOrder);

// GET  /api/orders/my — Historique du client connecté (🔒)
router.get('/my', protect, getMyOrders);

// GET  /api/orders/:id — Détail d'une commande (🔒)
router.get('/:id', protect, getOrderById);

// ── Routes ADMIN ─────────────────────────────────────────────

// GET   /api/orders/admin/all — Toutes les commandes (🔒 admin)
router.get('/admin/all', protect, adminOnly, getAllOrders);

// PATCH /api/orders/admin/:id/status — Changer le statut (🔒 admin)
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
