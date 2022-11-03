const orderId = recuperationId();
ajoutNumeroCommande(orderId);
suppressionCache();

/**
 * Je récupère l'orderId avec l'url envoyé de la page cart.js
 */
function recuperationId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("orderId");
}

/**
 * J'ajoute le numero de commande avec l'orderId et remercie pour l'achat
 *  @param {string} orderId
 */
function ajoutNumeroCommande(orderId) {
  const numeroCommande = document.getElementById("orderId");
  numeroCommande.innerHTML = `<br/><br/>${orderId}<br/><p>Merci pour votre achat<br/><br/>À bientôt !</p>`;
}

/**
 * Je supprime le localStorage après validation de la commande
 */
function suppressionCache() {
  const cache = window.localStorage;
  cache.clear();
}
