/* ============================================================
   MAIN.JS — Objet Auth mis à jour pour le backend Node.js
   Remplace l'objet Auth localStorage par des appels API réels.
   
   INSTRUCTIONS D'INTÉGRATION :
   1. Remplacez l'ancien bloc `const Auth = { ... }` dans votre
      main.js par le bloc ci-dessous.
   2. Assurez-vous que API_BASE_URL pointe vers votre serveur.
   ============================================================ */

// ══════════════════════════════════════════════════════════════
// CONFIGURATION — URL du backend
// En développement : 'http://localhost:5000'
// En production    : 'https://api.votre-domaine.com'
// ══════════════════════════════════════════════════════════════
const API_BASE_URL = 'http://localhost:5000';

// ══════════════════════════════════════════════════════════════
// AUTH — Objet principal d'authentification
// Communique avec le backend via fetch() + JWT
// ══════════════════════════════════════════════════════════════
const Auth = {

  // ── Clés de stockage (localStorage) ──────────────────────
  TOKEN_KEY:   'MH_jwt_token',
  SESSION_KEY: 'MH_session',

  // ── Récupère le token JWT stocké ─────────────────────────
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  // ── Retourne l'utilisateur depuis la session locale ───────
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY));
    } catch {
      return null;
    }
  },

  // ── Vérifie si un utilisateur est connecté ────────────────
  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  // ── Construit les headers HTTP communs ────────────────────
  _headers(withAuth = false) {
    const h = { 'Content-Type': 'application/json' };
    if (withAuth) {
      const token = this.getToken();
      if (token) h['Authorization'] = 'Bearer ' + token;
    }
    return h;
  },

  // ── Sauvegarde token + session après login/register ───────
  _saveSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY,   token);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  },

  // ── Efface la session ─────────────────────────────────────
  _clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  },

  // ════════════════════════════════════════════════════════
  // INSCRIPTION — POST /api/auth/register
  // Paramètres : { firstName, lastName, email, phone,
  //                password, newsletter }
  // Retourne   : { success, message, user }
  // ════════════════════════════════════════════════════════
  async register({ firstName, lastName, email, phone, password, newsletter }) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method:  'POST',
        headers: this._headers(),
        body:    JSON.stringify({ firstName, lastName, email, phone, password, newsletter }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Le serveur a renvoyé une erreur (400, 409, 500…)
        return { success: false, message: data.message || 'Erreur lors de la création du compte.' };
      }

      // ✅ Succès — sauvegarder le token et la session
      this._saveSession(data.token, data.user);
      console.log('✅ Compte créé :', data.user.email);
      return { success: true, user: data.user };

    } catch (err) {
      console.error('❌ register() — Erreur réseau :', err);
      return { success: false, message: 'Impossible de joindre le serveur. Vérifiez votre connexion.' };
    }
  },

  // ════════════════════════════════════════════════════════
  // CONNEXION — POST /api/auth/login
  // Paramètres : email (string), password (string)
  // Retourne   : { success, message, user }
  // ════════════════════════════════════════════════════════
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method:  'POST',
        headers: this._headers(),
        body:    JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Email ou mot de passe incorrect.' };
      }

      this._saveSession(data.token, data.user);
      console.log('✅ Connecté :', data.user.email);
      return { success: true, user: data.user };

    } catch (err) {
      console.error('❌ login() — Erreur réseau :', err);
      return { success: false, message: 'Impossible de joindre le serveur. Vérifiez votre connexion.' };
    }
  },

  // ════════════════════════════════════════════════════════
  // DÉCONNEXION — Côté client uniquement (supprime le token)
  // ════════════════════════════════════════════════════════
  logout() {
    this._clearSession();
    console.log('👋 Déconnecté');
    // Rediriger vers l'accueil ou recharger la page
    window.location.href = 'index.html';
  },

  // ════════════════════════════════════════════════════════
  // PROFIL — GET /api/auth/me (🔒)
  // Récupère les données fraîches depuis le serveur.
  // ════════════════════════════════════════════════════════
  async fetchProfile() {
    if (!this.isLoggedIn()) return null;
    try {
      const res  = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: this._headers(true),
      });
      const data = await res.json();
      if (res.ok) {
        // Mettre à jour la session locale avec les données fraîches
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(data.user));
        return data.user;
      }
      // Token expiré → déconnexion automatique
      if (res.status === 401) this._clearSession();
      return null;
    } catch (err) {
      console.error('❌ fetchProfile() :', err);
      return null;
    }
  },

  // ════════════════════════════════════════════════════════
  // MISE À JOUR DU PROFIL — PUT /api/auth/me (🔒)
  // Paramètres : { firstName, lastName, phone, newsletter }
  // ════════════════════════════════════════════════════════
  async updateUser(updatedData) {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method:  'PUT',
        headers: this._headers(true),
        body:    JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('❌ updateUser() :', err);
      return { success: false, message: 'Erreur réseau.' };
    }
  },

  // ════════════════════════════════════════════════════════
  // CHANGER LE MOT DE PASSE — PUT /api/auth/change-password (🔒)
  // Paramètres : currentPassword, newPassword
  // ════════════════════════════════════════════════════════
  async changePassword(currentPassword, newPassword) {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method:  'PUT',
        headers: this._headers(true),
        body:    JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch (err) {
      console.error('❌ changePassword() :', err);
      return { success: false, message: 'Erreur réseau.' };
    }
  },

  // ════════════════════════════════════════════════════════
  // ENREGISTRER UNE COMMANDE — POST /api/orders (🔒 ou invité)
  // Appelé automatiquement après un paiement réussi.
  // Paramètres : orderData (objet commande du frontend)
  // ════════════════════════════════════════════════════════
  async saveOrder(orderData) {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/orders`, {
        method:  'POST',
        headers: this._headers(true), // Envoie le token si connecté (optionnel côté serveur)
        body:    JSON.stringify(orderData),
      });
      const data = await res.json();

      if (res.ok) {
        console.log('📦 Commande enregistrée en base :', data.order?.orderNumber);
        return { success: true, order: data.order };
      }
      console.warn('⚠️ Erreur enregistrement commande :', data.message);
      return { success: false, message: data.message };

    } catch (err) {
      console.error('❌ saveOrder() — Erreur réseau :', err);
      return { success: false, message: 'Erreur réseau lors de la sauvegarde de commande.' };
    }
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE DES COMMANDES — GET /api/orders/my (🔒)
  // Retourne : { success, orders, total, pages }
  // ════════════════════════════════════════════════════════
  async getOrders(page = 1) {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/orders/my?page=${page}&limit=10`, {
        headers: this._headers(true),
      });
      const data = await res.json();
      if (res.ok) return { success: true, ...data };
      return { success: false, orders: [], message: data.message };
    } catch (err) {
      console.error('❌ getOrders() :', err);
      return { success: false, orders: [], message: 'Erreur réseau.' };
    }
  },
};

// ══════════════════════════════════════════════════════════════
// INTÉGRATION PAIEMENT — Enregistrement automatique de commande
// À appeler depuis checkout.html après un paiement confirmé.
//
// USAGE dans checkout.html :
//   const result = await processPaymentAndSaveOrder(orderPayload);
//
// Le `orderPayload` doit respecter ce format :
// {
//   items: Cart.getItems(),          // Articles du panier
//   totalFcfa: <nombre>,             // Total en FCFA
//   totalEur: <nombre>,              // Total en EUR
//   shippingAddress: {               // Adresse renseignée dans le form
//     firstName, lastName, address,
//     zip, city, email, phone
//   },
//   shippingMethod: 'standard',      // 'standard' | 'express' | 'retrait'
//   paymentMethod: 'stripe',         // 'stripe' | 'paypal' | 'momo_mtn' | 'airtel_money'
//   transactionId: '<stripe_pi_id>', // ID de transaction Stripe / PayPal
// }
// ══════════════════════════════════════════════════════════════
async function processPaymentAndSaveOrder(orderPayload) {
  // 1. Enregistrer la commande en base de données
  const result = await Auth.saveOrder(orderPayload);

  if (result.success) {
    // 2. Vider le panier local
    Cart.clear();
    console.log('✅ Flux paiement + commande terminé :', result.order?.orderNumber);
  } else {
    // La commande n'a pas pu être sauvegardée — à loguer côté serveur
    console.error('❌ Échec sauvegarde commande :', result.message);
    // Ne pas bloquer l'utilisateur — la commande peut être récupérée via Stripe webhooks
  }

  return result;
}

// ── Exemple d'appel depuis le bouton "Payer" de checkout.html ──
// (Décommentez et adaptez à votre logique de paiement Stripe)
/*
async function handleStripePayment() {
  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: cardElement }
  });

  if (error) {
    showToast('Paiement refusé : ' + error.message);
    return;
  }

  if (paymentIntent.status === 'succeeded') {
    // Construire le payload depuis les champs du formulaire
    const payload = {
      items:          Cart.getItems(),
      totalFcfa:      getTotalFcfa(),  // votre fonction
      totalEur:       Cart.getTotal(),
      shippingAddress: {
        firstName: document.getElementById('co-fname').value,
        lastName:  document.getElementById('co-lname').value,
        address:   document.getElementById('co-address').value,
        zip:       document.getElementById('co-zip').value,
        city:      document.getElementById('co-city').value,
        email:     document.getElementById('co-email').value,
        phone:     document.getElementById('co-phone')?.value || '',
      },
      shippingMethod: 'standard',
      paymentMethod:  'stripe',
      transactionId:  paymentIntent.id,
    };

    await processPaymentAndSaveOrder(payload);
    // Afficher la confirmation à l'utilisateur
    showConfirmationScreen(paymentIntent.id);
  }
}
*/
