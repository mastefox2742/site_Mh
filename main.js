/* ============================================================
   MAIN.JS — Shared JavaScript for cart, navigation, utilities
   ============================================================ */

// ══════════════════════════════════════════════════════════════
// TARIFICATION PAR FORMAT (FCFA)
// Prix de base affiché = A3 (15 000 FCFA)
// Modifiez ces valeurs selon vos tarifs
// ══════════════════════════════════════════════════════════════
const SIZE_PRICES = {
  A5: 3500,   // 3 500 FCFA
  A4: 7000,   // 7 000 FCFA
  A3: 15000,  // 15 000 FCFA  ← prix affiché par défaut sur les cartes
  A2: 25000,  // 25 000 FCFA
};

// Format affiché par défaut sur toutes les cartes produit
const DEFAULT_SIZE = 'A3';

// Taux de change FCFA → EUR (pour compatibilité panier/checkout en €)
// 1 EUR ≈ 655.957 FCFA — mettez à jour selon le taux du moment
const FCFA_TO_EUR = 1 / 655.957;

/** Convertit un prix FCFA en EUR arrondi à 2 décimales */
function fcfaToEur(fcfa) {
  return Math.round(fcfa * FCFA_TO_EUR * 100) / 100;
}

/** Formate un prix FCFA pour l'affichage : "15 000 FCFA" */
function fmtFcfa(fcfa) {
  return fcfa.toLocaleString('fr-FR') + ' FCFA';
}

/** Retourne le prix FCFA d'un format donné */
function getPriceFcfa(size) {
  return SIZE_PRICES[size] ?? SIZE_PRICES[DEFAULT_SIZE];
}

// ── PRODUCT DATA (shared across pages) ──────────────────────
// Note : le champ `price` est maintenant EN EUROS (converti depuis FCFA)
//        et correspond au format A3 par défaut.
//        `priceFcfa` stocke le prix FCFA du format par défaut.
const PRODUCTS = [
  {
    id: 1,
    name: "Luc 18:1 – Toujours Prier",
    collection: "Évangiles",
    // Prix A3 par défaut (calculé automatiquement depuis SIZE_PRICES)
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: "Nouveau",
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "image01.jpg",
    colors: ["#D4C4A8", "#8B7355", "#2C2C2A"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "Une affiche biblique de haute qualité illustrant Luc 18:1. Impression premium sur papier mat 250g."
  },
  {
    id: 2,
    name: "Exode 14:21-22 – La Mer s'Ouvre",
    collection: "Ancien Testament",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: "Promo",
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images02.jpg",
    colors: ["#4A7FA5", "#1A3A5C", "#A8C4D4"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "La traversée de la mer Rouge, un moment de foi et de délivrance."
  },
  {
    id: 3,
    name: "Psaumes 23:1 – Mon Berger",
    collection: "Psaumes",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: null,
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images03.jpg",
    colors: ["#4A6A8A", "#2C3E50", "#7FA8C4"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "L'Éternel est mon berger, je ne manquerai de rien. Psaumes 23:1"
  },
  {
    id: 4,
    name: "3 Jean 1:2 – Prospère",
    collection: "Nouveau Testament",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: "Nouveau",
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images04.jpg",
    colors: ["#6B8F71", "#2D5A3D", "#A8C4A2"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "Bien-aimé, je souhaite que tu prospères à tous égards."
  },
  {
    id: 5,
    name: "Psaumes 23:2 – Verts Pâturages",
    collection: "Psaumes",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: null,
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images05.jpg",
    colors: ["#5A8A5A", "#2C5C2C", "#8AB48A"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "Il me fait reposer dans de verts pâturages."
  },
  {
    id: 6,
    name: "Psaumes 1:1-3 – Arbre Planté",
    collection: "Psaumes",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: null,
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images06.jpg",
    colors: ["#4A8A4A", "#1C5C1C", "#7AB47A"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "Il est comme un arbre planté près des ruisseaux."
  },
  {
    id: 7,
    name: "Psaumes 93:4 – L'Éternel est Puissant",
    collection: "Psaumes",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: null,
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images07.jpg",
    colors: ["#2A4A8A", "#1A2C5C", "#4A6AB4"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "Plus que la voix des grandes eaux, l'Éternel est puissant dans les lieux célestes."
  },
  {
    id: 8,
    name: "Psaumes 23:1 – Le Berger Fidèle",
    collection: "Psaumes",
    price: fcfaToEur(SIZE_PRICES[DEFAULT_SIZE]),
    priceFcfa: SIZE_PRICES[DEFAULT_SIZE],
    originalPrice: null,
    badge: null,
    // <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
    img: "images08.jpg",
    colors: ["#3A5A8A", "#1A3A5C", "#6A8AB4"],
    sizes: ["A5", "A4", "A3", "A2"],
    description: "L'Éternel est mon berger — version encadrée classique."
  }
];

// ══════════════════════════════════════════════════════════════
// AUTH — Gestion des comptes utilisateur (localStorage)
//
// ★ EN PRODUCTION : Remplacez les méthodes par des appels API
//   Exemple : fetch('/api/login', { method:'POST', body:... })
//
// Les données sont stockées dans localStorage sous la clé
// 'hosarah_users' (liste) et 'hosarah_session' (session active).
// ══════════════════════════════════════════════════════════════
const Auth = {

  /* ── Clés de stockage ── */
  USERS_KEY:   'MH_users',
  SESSION_KEY: 'MH_session',
  ORDERS_KEY:  '_orders',

  /* ── Récupère tous les utilisateurs enregistrés ── */
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  /* ── Sauvegarde la liste d'utilisateurs ── */
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  /* ── Retourne l'utilisateur actuellement connecté (ou null) ── */
  getUser() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    try { return JSON.parse(session); } catch { return null; }
  },

  /* ── Vérifie si un utilisateur est connecté ── */
  isLoggedIn() {
    return this.getUser() !== null;
  },

  /* ────────────────────────────────────────────────
     INSCRIPTION — Crée un nouveau compte
     Paramètres : { firstName, lastName, email,
                    phone, password, newsletter }
     Retourne : { success: bool, message: string, user: obj }
  ──────────────────────────────────────────────── */
  register({ firstName, lastName, email, phone, password, newsletter }) {
    const users = this.getUsers();

    // Vérifier si l'email existe déjà
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Un compte avec cet email existe déjà. Connectez-vous.' };
    }

    // Créer le compte
    const newUser = {
      id:         'USR-' + Date.now(),
      firstName:  firstName.trim(),
      lastName:   lastName.trim(),
      email:      email.toLowerCase().trim(),
      phone:      phone || '',
      // ⚠️ PRODUCTION : Ne jamais stocker le mot de passe en clair.
      // Utilisez bcrypt côté serveur. Ici c'est une simulation locale.
      passwordHash: this._simpleHash(password),
      newsletter:   newsletter || false,
      addresses:    [],
      createdAt:    new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Ouvrir la session automatiquement
    const sessionUser = this._sanitize(newUser);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));

    console.log('✅ Compte créé :', sessionUser.email);
    // PRODUCTION : Envoyer un email de bienvenue ici
    return { success: true, user: sessionUser };
  },

  /* ────────────────────────────────────────────────
     CONNEXION — Vérifie les identifiants
     Retourne : { success: bool, message: string, user: obj }
  ──────────────────────────────────────────────── */
  login(email, password) {
    const users = this.getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return { success: false, message: 'Aucun compte trouvé avec cet email.' };
    }
    if (user.passwordHash !== this._simpleHash(password)) {
      return { success: false, message: 'Mot de passe incorrect. Réessayez.' };
    }

    const sessionUser = this._sanitize(user);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
    console.log('✅ Connecté :', sessionUser.email);
    return { success: true, user: sessionUser };
  },

  /* ── DÉCONNEXION ── */
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    console.log('👋 Déconnecté');
  },

  /* ── MISE À JOUR DU PROFIL ── */
  updateUser(updatedData) {
    const users = this.getUsers();
    const idx   = users.findIndex(u => u.email === updatedData.email);
    if (idx === -1) return;
    // Merge (ne touche pas au mot de passe)
    users[idx] = { ...users[idx], ...updatedData };
    this.saveUsers(users);
    // Mettre à jour la session
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(this._sanitize(users[idx])));
  },

  /* ── VÉRIFIER LE MOT DE PASSE ACTUEL ── */
  checkPassword(password) {
    const user = this.getUser();
    if (!user) return false;
    const users = this.getUsers();
    const dbUser = users.find(u => u.email === user.email);
    return dbUser && dbUser.passwordHash === this._simpleHash(password);
  },

  /* ── CHANGER LE MOT DE PASSE ── */
  updatePassword(newPassword) {
    const user  = this.getUser();
    if (!user) return;
    const users = this.getUsers();
    const idx   = users.findIndex(u => u.email === user.email);
    if (idx === -1) return;
    users[idx].passwordHash = this._simpleHash(newPassword);
    this.saveUsers(users);
    console.log('🔑 Mot de passe mis à jour');
    // PRODUCTION : Invalider tous les tokens de session ici
  },

  /* ── SUPPRIMER LE COMPTE ── */
  deleteAccount() {
    const user  = this.getUser();
    if (!user) return;
    const users = this.getUsers().filter(u => u.email !== user.email);
    this.saveUsers(users);
    localStorage.removeItem(this.SESSION_KEY);
    // Supprimer aussi les commandes liées
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '{}');
    delete orders[user.email];
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    console.log('🗑️ Compte supprimé :', user.email);
  },

  /* ── SAUVEGARDER UNE COMMANDE liée au compte ── */
  saveOrder(orderData) {
    const user = this.getUser();
    const email = user ? user.email : (orderData.customer?.email || 'guest');
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '{}');
    if (!orders[email]) orders[email] = [];
    orders[email].unshift({
      ...orderData,
      status: 'confirmed',
      date: new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })
    });
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  },

  /* ── RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR ── */
  getOrders(email) {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '{}');
    return orders[email] || [];
  },

  /* ── Retire le mot de passe de l'objet session ── */
  _sanitize(user) {
    const { passwordHash, ...clean } = user;
    return clean;
  },

  /* ── Hash simple (SIMULATION LOCALE UNIQUEMENT) ──
     ⚠️ EN PRODUCTION : Utilisez bcrypt côté serveur !
     Ce hash basique sert uniquement pour la démo localStorage. */
  _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16) + '_' + str.length;
  },
};

// ── CART MANAGEMENT ─────────────────────────────────────────
const Cart = {
  getItems() {
    return JSON.parse(localStorage.getItem('hosarah_cart') || '[]');
  },
  saveItems(items) {
    localStorage.setItem('hosarah_cart', JSON.stringify(items));
    this.updateBadge();
  },
  addItem(productId, qty = 1, variant = DEFAULT_SIZE) {
    const items = this.getItems();
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Récupère le format depuis le variant (ex: "A3", "A4 + Cadre" → "A4")
    const sizeKey = variant.split(' ')[0]; // extrait "A3" de "A3 + Cadre"
    const priceFcfa = getPriceFcfa(sizeKey);
    const priceEur  = fcfaToEur(priceFcfa);

    const key = `${productId}-${variant}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        key, id: productId, qty, variant,
        name: product.name,
        collection: product.collection,
        price: priceEur,       // en € pour le checkout Stripe/PayPal
        priceFcfa: priceFcfa,  // en FCFA pour l'affichage
        img: product.img
      });
    }
    this.saveItems(items);
    showToast(`"${product.name}" (${variant}) — ${fmtFcfa(priceFcfa)} ajouté au panier ✓`);
    renderCartSidebar();
  },
  removeItem(key) {
    const items = this.getItems().filter(i => i.key !== key);
    this.saveItems(items);
    renderCartSidebar();
  },
  updateQty(key, delta) {
    const items = this.getItems();
    const item = items.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    this.saveItems(items);
    renderCartSidebar();
  },
  getTotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },
  clear() {
    this.saveItems([]);
    renderCartSidebar();
  },
  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count === 0 ? 'none' : 'flex';
    });
  }
};

// ── RENDER CART SIDEBAR ─────────────────────────────────────
function renderCartSidebar() {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  const items = Cart.getItems();

  if (!body) return;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-msg">
        <div class="empty-icon">🛒</div>
        <p>Votre panier est vide.<br>Découvrez nos affiches bibliques.</p>
      </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  body.innerHTML = items.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → product image -->
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.style.background='#EDE9DC';this.removeAttribute('src')">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant} · ${item.collection}</div>
        <div class="cart-item-price">${fmtFcfa((item.priceFcfa || Math.round(item.price / FCFA_TO_EUR)) * item.qty)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="Cart.updateQty('${item.key}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="Cart.updateQty('${item.key}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="Cart.removeItem('${item.key}')" title="Supprimer">✕</button>
    </div>
  `).join('');

  if (foot) {
    foot.style.display = 'block';
    const totalFcfa = items.reduce((sum, i) => sum + (i.priceFcfa || Math.round(i.price / FCFA_TO_EUR)) * i.qty, 0);
    const totalEur  = Cart.getTotal();
    document.getElementById('cart-subtotal').textContent = fmtFcfa(totalFcfa);
    document.getElementById('cart-total-amt').textContent = fmtFcfa(totalFcfa);
  }
}

// ── RENDER PRODUCT CARD ─────────────────────────────────────
// Affiche le prix A3 par défaut + sélecteur de format interactif
function renderProductCard(product) {
  const defaultPriceFcfa = getPriceFcfa(DEFAULT_SIZE);
  const swatches = product.colors.map((c, i) =>
    `<div class="swatch${i === 0 ? ' active' : ''}" style="background:${c}" title="Couleur ${i+1}"></div>`
  ).join('');

  // Boutons de format avec attribut data-price
  const sizeBtns = product.sizes.map(s => {
    const pFcfa = getPriceFcfa(s);
    return `<button
      class="card-size-btn${s === DEFAULT_SIZE ? ' active' : ''}"
      data-size="${s}"
      data-price="${pFcfa}"
      data-product="${product.id}"
      onclick="event.stopPropagation(); cardSelectSize(this, ${product.id})"
      title="${fmtFcfa(pFcfa)}"
    >${s}</button>`;
  }).join('');

  return `
    <div class="product-card" onclick="window.location='produit.html?id=${product.id}'">
      <div class="card-img-wrap">
        <!-- REPLACE: src="PLACEHOLDER_IMAGE_URL" → votre URL d'image produit -->
        <img class="card-img" src="${product.img}" alt="${product.name}"
             onerror="this.parentElement.style.background='#EDE9DC';this.style.display='none'">
        ${product.badge ? `<span class="card-badge ${product.badge === 'Nouveau' ? 'new' : ''}">${product.badge}</span>` : ''}
        <div class="card-actions">
          <button class="btn-add-card"
            onclick="event.stopPropagation(); cardAddToCart(${product.id}, this.closest('.product-card'))">
            Ajouter au panier
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-collection">${product.collection}</div>
        <div class="card-name">${product.name}</div>

        <!-- Sélecteur de format — le prix change au clic -->
        <div class="card-sizes">${sizeBtns}</div>

        <!-- Prix affiché — mis à jour dynamiquement -->
        <div class="card-price" id="card-price-${product.id}">
          <span class="card-price-fcfa">${fmtFcfa(defaultPriceFcfa)}</span>
          <span class="card-price-size-label"> · ${DEFAULT_SIZE}</span>
        </div>

        <div class="color-swatches">${swatches}</div>
      </div>
    </div>`;
}

/**
 * Appelé quand l'utilisateur clique sur un format sur la carte produit.
 * Met à jour le prix affiché sans recharger la page.
 */
function cardSelectSize(btn, productId) {
  const card = btn.closest('.product-card');
  // Désactiver tous les boutons de cette carte
  card.querySelectorAll('.card-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Mettre à jour le prix affiché
  const priceFcfa = parseInt(btn.dataset.price, 10);
  const size      = btn.dataset.size;
  const priceEl   = document.getElementById('card-price-' + productId);
  if (priceEl) {
    priceEl.innerHTML = `<span class="card-price-fcfa">${fmtFcfa(priceFcfa)}</span><span class="card-price-size-label"> · ${size}</span>`;
  }
}

/**
 * Ajoute au panier en tenant compte du format sélectionné sur la carte.
 */
function cardAddToCart(productId, card) {
  const activeBtn = card?.querySelector('.card-size-btn.active');
  const size      = activeBtn ? activeBtn.dataset.size : DEFAULT_SIZE;
  Cart.addItem(productId, 1, size);
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── DRAWER / CART TOGGLE ─────────────────────────────────────
function toggleDrawer(open) {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('nav-drawer');
  if (!overlay || !drawer) return;
  const isOpen = drawer.classList.contains('open');
  const shouldOpen = open !== undefined ? open : !isOpen;
  overlay.classList.toggle('open', shouldOpen);
  drawer.classList.toggle('open', shouldOpen);
  document.body.style.overflow = shouldOpen ? 'hidden' : '';
}

function toggleCart(open) {
  const overlay = document.getElementById('drawer-overlay');
  const cart = document.getElementById('cart-sidebar');
  if (!cart) return;
  const isOpen = cart.classList.contains('open');
  const shouldOpen = open !== undefined ? open : !isOpen;
  if (overlay) overlay.classList.toggle('open', shouldOpen);
  cart.classList.toggle('open', shouldOpen);
  document.body.style.overflow = shouldOpen ? 'hidden' : '';
  if (shouldOpen) renderCartSidebar();
}

// ── CHECKOUT / ORDER FLOW ────────────────────────────────────
function openCheckout() {
  const items = Cart.getItems();
  if (items.length === 0) return;

  const modal = document.getElementById('checkout-modal');
  if (!modal) {
    buildCheckoutModal();
    return;
  }
  document.getElementById('checkout-modal').classList.add('open');
}

function buildCheckoutModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'checkout-modal';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width:600px">
      <button class="modal-close" onclick="document.getElementById('checkout-modal').classList.remove('open')">✕</button>
      <p class="label-caps" style="margin-bottom:8px">Finaliser la commande</p>
      <h2 style="font-family:var(--font-display);font-size:26px;margin-bottom:24px">Vos informations</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div>
          <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Prénom *</label>
          <input id="co-fname" type="text" placeholder="Marie" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
        </div>
        <div>
          <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Nom *</label>
          <input id="co-lname" type="text" placeholder="Dupont" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
        </div>
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Email *</label>
        <input id="co-email" type="email" placeholder="marie@exemple.fr" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
      </div>
      <div style="margin-bottom:14px">
        <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Adresse *</label>
        <input id="co-address" type="text" placeholder="12 rue des Oliviers" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px">
        <div>
          <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Code postal *</label>
          <input id="co-zip" type="text" placeholder="75001" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
        </div>
        <div>
          <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;display:block;margin-bottom:6px">Ville *</label>
          <input id="co-city" type="text" placeholder="Paris" style="width:100%;padding:11px 14px;border:1px solid var(--border);background:var(--white);font-family:var(--font-body);font-size:13px;outline:none">
        </div>
      </div>
      <button onclick="submitOrder()" class="btn btn-dark" style="width:100%;padding:15px;font-size:11px;letter-spacing:3px">
        Confirmer la commande
      </button>
      <p style="font-size:11px;color:var(--gray);text-align:center;margin-top:12px">
        Paiement sécurisé — Livraison 3-5 jours ouvrés
      </p>
    </div>`;
  document.body.appendChild(overlay);
  overlay.classList.add('open');
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
}

function submitOrder() {
  const fname  = document.getElementById('co-fname')?.value.trim();
  const lname  = document.getElementById('co-lname')?.value.trim();
  const email  = document.getElementById('co-email')?.value.trim();
  const address= document.getElementById('co-address')?.value.trim();
  const zip    = document.getElementById('co-zip')?.value.trim();
  const city   = document.getElementById('co-city')?.value.trim();

  if (!fname || !lname || !email || !address || !zip || !city) {
    showToast('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  const order = {
    id: 'CMD-' + Date.now(),
    date: new Date().toLocaleString('fr-FR'),
    customer: { firstName: fname, lastName: lname, email, address, zip, city },
    items: Cart.getItems(),
    total: Cart.getTotal().toFixed(2) + ' €'
  };

  // ── sendOrderNotification: simule l'envoi au vendeur ──
  sendOrderNotification(order);

  // Confirmation
  document.getElementById('checkout-modal').innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:48px;margin-bottom:20px">✓</div>
      <p class="label-caps" style="margin-bottom:8px;color:var(--olive-dark)">Commande confirmée</p>
      <h2 style="font-family:var(--font-display);font-size:26px;margin-bottom:16px">Merci, ${fname} !</h2>
      <p style="font-size:14px;color:var(--gray);line-height:1.7">Votre commande <strong>${order.id}</strong> a bien été reçue.<br>Un email de confirmation vous sera envoyé à <strong>${email}</strong>.</p>
      <button onclick="document.getElementById('checkout-modal').classList.remove('open');Cart.clear();" class="btn btn-olive" style="margin-top:32px">Fermer</button>
    </div>`;

  console.log('📦 Commande générée :', JSON.stringify(order, null, 2));
}

/**
 * sendOrderNotification — Simule l'envoi d'un email de commande au vendeur.
 * En production : remplacez ce corps par un appel à votre API (ex: EmailJS, SendGrid, etc.)
 * Sauvegarde également la commande dans le compte client connecté.
 */
function sendOrderNotification(order) {
  console.log('📧 sendOrderNotification appelé');
  console.log('Destinataire vendeur: votre-email@domaine.com');
  console.log('Objet: Nouvelle commande ' + order.id);
  console.log('Commande:', order);

  // ✅ Sauvegarde la commande dans le compte client (si connecté)
  if (typeof Auth !== 'undefined') {
    Auth.saveOrder(order);
  }

  // EXEMPLE avec EmailJS (décommentez et configurez):
  emailjs.send('service_l81hj3q', 'template_f1ufy3l', {  
   order_id: order.id,
  customer_name: order.customer.firstName + ' ' + order.customer.lastName,
  customer_email: order.customer.email,
  order_details: JSON.stringify(order.items),
  total: order.total
  });
}

// ── NEWSLETTER ────────────────────────────────────────────────
function subscribeNewsletter(email, formEl) {
  if (!email || !email.includes('@')) {
    showToast('Veuillez entrer un email valide.');
    return;
  }
  // REPLACE: Connectez ici à votre service email (Mailchimp, Klaviyo, etc.)
  const subscribers = JSON.parse(localStorage.getItem('MH_subscribers') || '[]');
  if (subscribers.includes(email)) {
    showToast('Vous êtes déjà inscrit(e) !');
    return;
  }
  subscribers.push(email);
  localStorage.setItem('MH_subscribers', JSON.stringify(subscribers));
  console.log('📧 Nouvel inscrit newsletter :', email);
  if (formEl) {
    formEl.innerHTML = `<p style="font-size:14px;color:var(--olive-dark);font-weight:600">✓ Merci ! Bienvenue dans la famille MH PICTURE.</p>`;
  }
}

// ── SHARED NAV HTML ──────────────────────────────────────────
function buildSharedNav(activePage) {
  return `
  <div class="announcement-bar">
    ✦ Livraison gratuite à partir de 50€ · Impression haute qualité · Encadrée ou sans cadre ✦
  </div>
  <header class="site-header">
    <div class="nav-inner">
      <div class="nav-left">
        <button class="burger-btn" onclick="toggleDrawer()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <a href="index.html" class="site-logo">MH<em>PI</em>CTURE</a>
      <div class="nav-right">
        <button class="icon-btn" title="Rechercher" onclick="showToast('Recherche bientôt disponible…')">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button class="icon-btn" title="Mon compte" onclick="goToAccount()">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </button>
        <button class="icon-btn" title="Panier" onclick="toggleCart()">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-badge" style="display:none">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- DRAWER OVERLAY -->
  <div class="drawer-overlay" id="drawer-overlay" onclick="closeAll()"></div>

  <!-- NAV DRAWER (burger menu) -->
  <nav class="nav-drawer" id="nav-drawer">
    <div class="drawer-head">
      <a href="index.html" class="site-logo">Ho<em>s</em>arah</a>
      <button class="drawer-close" onclick="toggleDrawer()">✕</button>
    </div>
    <div class="drawer-links">
      <a href="index.html" class="${activePage==='home'?'active':''}">Accueil</a>
      <a href="catalogue.html" class="${activePage==='catalogue'?'active':''}">Boutique</a>
      <a href="catalogue.html?cat=psaumes">Psaumes</a>
      <a href="catalogue.html?cat=evangiles">Évangiles</a>
      <a href="catalogue.html?cat=ancien">Ancien Testament</a>
      <a href="contact.html" class="${activePage==='contact'?'active':''}">Contact</a>
    </div>
    <div style="padding:0 28px 28px;margin-top:auto;border-top:1px solid var(--border);padding-top:24px">
      <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--olive-dark);font-weight:600;margin-bottom:16px">Suivez-nous</p>
      <div class="social-row">
        <a href="#" class="social-btn">📷</a>
        <a href="#" class="social-btn">📘</a>
        <a href="#" class="social-btn">🎵</a>
      </div>
    </div>
  </nav>

  <!-- CART SIDEBAR -->
  <aside class="cart-sidebar" id="cart-sidebar">
    <div class="cart-head">
      <div>
        <p class="label-caps">Mon panier</p>
        <h3>Votre sélection</h3>
      </div>
      <button class="cart-close" onclick="toggleCart()">✕</button>
    </div>
    <div class="cart-body" id="cart-body"></div>
    <div class="cart-foot" id="cart-foot" style="display:none">
      <div class="cart-subtotal">
        <span>Sous-total</span>
        <span id="cart-subtotal">0,00 €</span>
      </div>
      <div class="cart-subtotal">
        <span>Livraison</span>
        <span>Calculée à la commande</span>
      </div>
      <div class="cart-subtotal total">
        <span>Total</span>
        <strong id="cart-total-amt">0,00 €</strong>
      </div>
      <p class="shipping-note">✓ Livraison gratuite dès 50€ d'achat</p>
      <button class="btn-checkout" onclick="window.location.href='checkout.html'">Commander maintenant</button>
      <button class="btn-continue" onclick="toggleCart(false)">Continuer les achats</button>
    </div>
  </aside>`;
}

function buildSharedFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="site-logo">MH<em>PI</em>CTURE</a>
          <p>Des affiches bibliques d'art imprimées avec soin, pour orner votre intérieur de la Parole de Dieu.</p>
          <div class="social-row">
            <a href="#" class="social-btn" title="Instagram">📷</a>
            <a href="#" class="social-btn" title="Facebook">📘</a>
            <a href="#" class="social-btn" title="TikTok">🎵</a>
            <a href="#" class="social-btn" title="Pinterest">📌</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Boutique</h5>
          <a href="catalogue.html">Toutes les affiches</a>
          <a href="catalogue.html?cat=psaumes">Psaumes</a>
          <a href="catalogue.html?cat=evangiles">Évangiles</a>
          <a href="catalogue.html?cat=ancien">Ancien Testament</a>
          <a href="catalogue.html?cat=nouveau">Nouveau Testament</a>
        </div>
        <div class="footer-col">
          <h5>Aide</h5>
          <a href="#">Livraison & retours</a>
          <a href="#">Suivi de commande</a>
          <a href="#">FAQ</a>
          <a href="contact.html">Nous contacter</a>
          <a href="#">Guide des tailles</a>
        </div>
        <div class="footer-col">
          <h5>Légal</h5>
          <a href="#">Mentions légales</a>
          <a href="#">CGV</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Politique de cookies</a>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="footer-bottom">
        <span>©PUER DEI— Tous droits réservés</span>
        <div>
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="#">CGV</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function closeAll() {
  toggleDrawer(false);
  toggleCart(false);
  document.body.style.overflow = '';
}

/* ── ACCOUNT REDIRECT ────────────────────────────────────────
   Redirige vers compte.html
   Si connecté → ouvre directement le profil
   Si non connecté → ouvre le formulaire de connexion
────────────────────────────────────────────────────────── */
function goToAccount() {
  window.location.href = 'compte.html';
}

// ── INIT ON LOAD ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();

  // Afficher le prénom dans la nav si connecté
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  if (user) {
    const accountBtns = document.querySelectorAll('[title="Mon compte"]');
    accountBtns.forEach(btn => {
      btn.title = user.firstName + ' — Mon compte';
    });
  }
});