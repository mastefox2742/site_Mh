// ══════════════════════════════════════════════════════════════
// controllers/orderController.js
// Logique métier pour la gestion des commandes.
// ══════════════════════════════════════════════════════════════

const Order = require('../models/Order');

// ══════════════════════════════════════════════════════════════
// POST /api/orders — Créer une nouvelle commande
// Accessible : clients connectés ET invités (optionalAuth)
// Body : { items, totalFcfa, totalEur, shippingAddress,
//          shippingMethod, paymentMethod, transactionId, customerNote }
// ══════════════════════════════════════════════════════════════
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalFcfa,
      totalEur,
      shippingAddress,
      shippingMethod,
      shippingCost,
      paymentMethod,
      transactionId,
      customerNote,
    } = req.body;

    // ── Validations de base ─────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La commande doit contenir au moins un article.',
      });
    }
    if (!totalFcfa || totalFcfa <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le montant total est invalide.',
      });
    }
    if (!shippingAddress?.firstName || !shippingAddress?.address || !shippingAddress?.city) {
      return res.status(400).json({
        success: false,
        message: "L'adresse de livraison est incomplète.",
      });
    }

    // ── Email de contact ─────────────────────────────────────
    // Priorité : utilisateur connecté > email fourni dans shippingAddress
    const customerEmail = req.user
      ? req.user.email
      : (shippingAddress.email || '').toLowerCase().trim();

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "L'email de contact est requis pour les commandes invité.",
      });
    }

    // ── Création de la commande ──────────────────────────────
    const order = await Order.create({
      user:          req.user?._id || null, // null si invité
      customerEmail,
      items,
      totalFcfa,
      totalEur:      totalEur || null,
      shippingAddress,
      shippingMethod: shippingMethod || 'standard',
      shippingCost:   shippingCost   || 0,
      paymentMethod:  paymentMethod  || 'non_defini',
      transactionId:  transactionId  || '',
      customerNote:   customerNote   || '',
      status:        'confirmee',
    });

    console.log(`📦 Commande créée : ${order.orderNumber} — ${customerEmail}`);

    return res.status(201).json({
      success: true,
      message: 'Commande enregistrée avec succès.',
      order: {
        id:          order._id,
        orderNumber: order.orderNumber,
        status:      order.status,
        totalFcfa:   order.totalFcfa,
        createdAt:   order.createdAt,
      },
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(' ') });
    }
    console.error('❌ Erreur createOrder :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// GET /api/orders/my — Historique du client connecté
// (Route protégée)
// Query params: ?page=1&limit=10
// ══════════════════════════════════════════════════════════════
const getMyOrders = async (req, res) => {
  try {
    // Pagination simple
    const page  = parseInt(req.query.page,  10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 }) // Plus récentes en premier
        .skip(skip)
        .limit(limit)
        .select('-statusHistory -__v'), // Retire les champs inutiles pour le frontend
      Order.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages:  Math.ceil(total / limit),
      orders,
    });

  } catch (err) {
    console.error('❌ Erreur getMyOrders :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// GET /api/orders/:id — Détail d'une commande
// (Route protégée — le client ne peut voir que SES commandes)
// ══════════════════════════════════════════════════════════════
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    // Vérification : la commande appartient bien à ce client (ou admin)
    const isOwner = order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Cette commande ne vous appartient pas.',
      });
    }

    return res.status(200).json({ success: true, order });

  } catch (err) {
    console.error('❌ Erreur getOrderById :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// GET /api/orders/admin/all — ADMIN : Toutes les commandes
// (Route protégée + adminOnly)
// ══════════════════════════════════════════════════════════════
const getAllOrders = async (req, res) => {
  try {
    const page   = parseInt(req.query.page,   10) || 1;
    const limit  = parseInt(req.query.limit,  10) || 20;
    const status = req.query.status; // filtre optionnel
    const skip   = (page - 1) * limit;

    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email phone'), // joins avec User
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, total, page, pages: Math.ceil(total / limit), orders });

  } catch (err) {
    console.error('❌ Erreur getAllOrders :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ══════════════════════════════════════════════════════════════
// PATCH /api/orders/admin/:id/status — ADMIN : Changer le statut
// Body : { status, note }
// ══════════════════════════════════════════════════════════════
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['en_attente','confirmee','en_preparation','expediee','livree','annulee','remboursee'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Statut invalide.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande introuvable.' });
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Statut mis à jour : ${status}`,
      order: { id: order._id, orderNumber: order.orderNumber, status },
    });

  } catch (err) {
    console.error('❌ Erreur updateOrderStatus :', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
