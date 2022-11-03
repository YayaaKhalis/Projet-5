// je déclare les variables globales

const panier = [];
let prixProduit = 0;
let urlImageLocal, altTxtLocal, nomProduit;

/**
 * requete vers l'API, recuperation des données de tous les produits
 */
function recuperationDesCanapes() {
  return fetch(`http://localhost:3000/api/products/`)
    .then((reponse) => reponse.json())
    .then((api) => (tousLesCanapes = api))
    .catch((erreur) => {
      document.querySelector("h1").innerHTML = "<h1>erreur 404</h1>";
      console.log("Erreur d'API :" + erreur);
    });
}
/**
 * Je recupère les données des canapes de manière croisé avec le localStorage et l'API
 */
async function recuperationCache() {
  let canapesLocalStorage = JSON.parse(localStorage.getItem("canapesStockes"));

  // si le localStorage est vide, quantie et prix 0 et affichage texte panier vide
  if (!canapesLocalStorage) {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML = "Votre panier est vide";
    return;
  }
  // utilisation de la propriete await (requete fetch sur recuperationDesCanapes donc attente de réponse)
  let canapesAPI = await recuperationDesCanapes();
  // je fais une boucle sur les canapes du localStorage
  canapesLocalStorage.forEach(function (canape) {
    // Je récupere la position du canape dans l'index de l'API avec la propriete findIndex et
    // recupere les donnees si l'id des canapes de l'API correspond à l'id des canapes du localStorage
    const canapIndex = canapesAPI.findIndex((item) => item._id === canape.id);
    // je garde les canapes qui correspondent entre l'API et le localStorage et je fusionne les donnees des objet avec Object.assign
    const canapeAGarder = Object.assign(canape, canapesAPI[canapIndex]);
    // je push les donnees dans le panier
    panier.push(canapeAGarder);
  });

  // j'affiche tout les elements avec la boucle forEach
  panier.forEach((produit) => ajoutProduit(produit));
}
recuperationCache();
// console.log("PANIER :", panier);

/**
 * J'ajoute les produits dans le panier
 * @param {Object} produit
 */
function ajoutProduit(produit) {
  const article = ajoutArticle(produit);
  const divImage = ajoutImage(produit);
  article.appendChild(divImage);

  const elementProduit = ajoutContenuPanier(produit);
  article.appendChild(elementProduit);
  affichageArticle(article);
  affichageQuantiteTotal();
  affichagePrixTotal();
}

/**
 * Je calcul la quantité total à afficher
 */
function affichageQuantiteTotal() {
  const quantiteTotal = document.querySelector("#totalQuantity");

  //transforme l'array panier en une seule valeur total
  const total = panier.reduce((total, produit) => total + produit.quantity, 0);
  quantiteTotal.textContent = total;
}

/**
 * Je calcul le prix total à afficher
 */
function affichagePrixTotal() {
  const prixTotal = document.querySelector("#totalPrice");

  //je transforme l'array panier en une seule valeur total
  const total = panier.reduce(
    (total, produit) => total + produit.price * produit.quantity,
    0
  );
  prixTotal.textContent = total;
}

/**
 * J'ajoute une div avec la class .cart__item__content dans laquelle j'affcihe la description et ses paramètres
 * @param {Object} produit
 */
function ajoutContenuPanier(produit) {
  const elementProduit = document.createElement("div");
  elementProduit.classList.add("cart__item__content");
  const description = ajoutDescription(produit);
  const settings = ajoutSettings(produit);

  elementProduit.appendChild(description);
  elementProduit.appendChild(settings);
  return elementProduit;
}

/**
 * J'ajoute aux paramètres la quantité et le bouton supprimer
 * @param {Object} produit
 */
function ajoutSettings(produit) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  ajoutQuantite(settings, produit);
  ajoutSupprimer(settings, produit);
  return settings;
}

/**
 * Je créer le bouton supprimer avec une div et un addEventListener qui joue la fonction suppressionProduit() au clic
 * @param {Object} settings
 * @param {Object} produit
 */
function ajoutSupprimer(settings, produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => suppressionProduit(produit));

  const p = document.createElement("p");
  p.textContent = "supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

/**
 * Je créer la fonction suppressionProduit avec un findIndex sur l'id et la couleur
 *
 * @param {Object} produit
 */
function suppressionProduit(produit) {
  const suppressionProduit = panier.findIndex(
    (item) => item.id === produit.id && item.color === produit.color
  );

  // avec .splice je supprime des éléments du tableau panier puis j'affiche les informations mis à jours,
  // je sauvegarde le panier dans le localStorage et supprime la div du produit cliqué
  panier.splice(suppressionProduit, 1);
  affichageQuantiteTotal();
  affichagePrixTotal();
  suppressionDansPanier(produit);
  suppressionArticlePagePanier(produit);
}

/**
 * Je supprime la div du produit cliqué qui à un id et une couleur identique
 @param {Object} produit
*/
function suppressionArticlePagePanier(produit) {
  const articleSupprime = document.querySelector(
    `article[data-id="${produit.id}"][data-color="${produit.color}"]`
  );
  articleSupprime.remove();
}

/**
 * J'ajoute la quantité sur chaque produit avec un mini 1 et maxi 100, si autre afficher message erreur
 * @param {Object} settings
 * @param {Object} produit
 */
function ajoutQuantite(settings, produit) {
  const quantite = document.createElement("div");
  quantite.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantite.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = produit.quantity;
  input.addEventListener("change", () => {
    const quantite = input.value;
    if (quantite == 0 || quantite < 0 || quantite > 100) {
      alert("Choisissez un nombre d'article entre 1 et 100");
      return;
    }
    // une fois la quantité ajouté, j'affiche la quantité et le prix total du panier
    gestionQuantitePrix(quantite, produit);
  });

  quantite.appendChild(input);
  settings.appendChild(quantite);
}

/**
 * Je créer une fonction pour actualiser les produit dans le panier et afficher les nouvelles données prix, quantité
 * @param {string} nouvelleValeur
 * @param {Object} produit
 */
function gestionQuantitePrix(nouvelleValeur, produit) {
  const produitActualise = panier.find(
    (item) => item.id === produit.id && item.color === produit.color
  );
  produitActualise.quantity = Number(nouvelleValeur);
  produit.quantity = produitActualise.quantity;
  affichageQuantiteTotal();
  affichagePrixTotal();
  sauvegardePanier(produitActualise);
}

/**
 * fonction de sauvegarde du panier dans le localStorage
 */
function sauvegardePanier(produit) {
  const donneesStockes = JSON.parse(localStorage.getItem("canapesStockes"));
  const index = donneesStockes.findIndex(
    (item) => item.id === produit.id && item.color === produit.color
  );
  donneesStockes[index].quantity = produit.quantity;
  localStorage.setItem("canapesStockes", JSON.stringify(donneesStockes));
}
function suppressionDansPanier(produit) {
  const donneesStockes = JSON.parse(localStorage.getItem("canapesStockes"));

  const result = donneesStockes.filter(
    (item) => item.id !== produit.id && item.color !== produit.color
  );

  localStorage.setItem("canapesStockes", JSON.stringify(result));
}

/**
 * Je créer la fonction d'ajout de description du produit avec le nom la couleur et le prix
 * @param {Object} produit
 */
function ajoutDescription(produit) {
  const description = document.createElement("div");
  description.classList.add("card__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = produit.name;

  const pColor = document.createElement("p");
  pColor.textContent = produit.color;

  const pPrice = document.createElement("p");
  pPrice.textContent = produit.price + " €";

  description.appendChild(h2);
  description.appendChild(pColor);
  description.appendChild(pPrice);

  return description;
}

/**
 * Je créer la fonction d'affichage des articles dans la page panier
 * @param {Object} article
 */
function affichageArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}

/**
 * Je fais la fonction qui créer l'article suivant l'id du produit et sa couleur
 * @param {Object} produit
 */
function ajoutArticle(produit) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = produit.id;
  article.dataset.color = produit.color;

  return article;
}

/**
 * Je créer la fonction qui ajoute l'image du produit grâce à son url et ajoute son altTxt
 * @param {Object} produit
 */
function ajoutImage(produit) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = produit.imageUrl;
  image.alt = produit.altTxt;
  div.appendChild(image);

  return div;
}

//- - - - - - - FORMULAIRE - - - - - - - - - - - - - -

const boutonFormulaire = document.querySelector("#order");
// au clic sur le bouton commander j'envoi le formualaire avec la fonction envoiFormulaire()
boutonFormulaire.addEventListener("click", (e) => envoiFormulaire(e));

/**
 * Je valide le panier et le formulaire avant l'envoi de la commande
 * @param {Object} e
 */
function envoiFormulaire(e) {
  e.preventDefault();
  // je met une alerte au cas ou le panier est vide
  // lors du clic sur le bouton commander
  if (panier.length === 0) {
    alert("Sélectionnez un produit");
    return;
  }

  // je vérifie que chaques champs du formulaire n'est pas invalide
  if (formulaireInvalide()) return;
  if (inputPrenomInvalide()) return;
  if (inputNomInvalide()) return;
  if (inputAdresseInvalide()) return;
  if (inputVilleInvalide()) return;
  if (emailInvalide()) return;

  // j'envoi la requete POST au back-end
  const pagePanier = requette();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(pagePanier),
    headers: {
      "content-Type": "application/json",
    },
  })
    .then((reponse) => reponse.json())
    .then((donnee) => {
      const orderId = donnee.orderId;
      // je transmet l'orderId renvoyé par l'API avec l'url à la page confirmation
      window.location.href = "./confirmation.html" + "?orderId=" + orderId;
    });
}

/**
 * Envoi de la requette à l'API avec les valeurs du formulaire pour obtention de l'orderId
 */
function requette() {
  const formulaire = document.querySelector(".cart__order__form");
  const firstName = formulaire.elements.firstName.value;
  const lastName = formulaire.elements.lastName.value;
  const address = formulaire.elements.address.value;
  const city = formulaire.elements.city.value;
  const email = formulaire.elements.email.value;

  // en-tête de la requete
  const pagePanier = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: recuperationIds(),
  };
  return pagePanier;
}

/**
 * Je récupère les différents id du localStorage pour les envoyer au back-end
 */
function recuperationIds() {
  const ids = [];
  panier.forEach(function (elt) {
    ids.push(elt.id);
  });
  return ids;
}

/**
 * Je verifie que tous les input ayant le paramètre "required" sont renseignés
 */
function formulaireInvalide() {
  const formulaire = document.querySelector(".cart__order__form");
  const inputs = Array.from(formulaire.querySelectorAll("input:required"));
  const isInvalide = inputs.every((input) => input.value !== "");
  if (!isInvalide) {
    alert("Remplissez tout les champs du fomulaire");
    return true;
  }
  return false;
}

/**
 * Je verifie que le prenom est valide avec une regex spécifique
 */
function inputPrenomInvalide() {
  const prenom = document.querySelector("#firstName").value;
  firstNameErrorMsg.textContent = "";
  // regex de validation des caratères speciaux
  // espaces et tiret maximum caractère 31 et pas sensible à la casse
  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(prenom) === false) {
    firstNameErrorMsg.textContent = "Votre prénom n'est pas valide";
    return true;
  }
  return false;
}

/**
 * Je verifie que le nom est valide avec une regex spécifique
 */
function inputNomInvalide() {
  const nom = document.querySelector("#lastName").value;
  lastNameErrorMsg.textContent = "";
  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(nom) === false) {
    lastNameErrorMsg.textContent = "Votre nom n'est pas valide";
    return true;
  }
  return false;
}

/**
 * Je verifie que l'adresse est valide avec une regex spécifique
 */
function inputAdresseInvalide() {
  const adresse = document.querySelector("#address").value;
  addressErrorMsg.textContent = "";

  const regex = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
  if (regex.test(adresse) === false) {
    addressErrorMsg.textContent = "Entrez une adresse valide";
    return true;
  }
  return false;
}

/**
 * Je verifie que la ville est valide avec une regex spécifique
 */
function inputVilleInvalide() {
  const ville = document.querySelector("#city").value;
  cityErrorMsg.textContent = "";

  const regex = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
  if (regex.test(ville) === false) {
    cityErrorMsg.textContent = "Entrez un nom de ville valide";
    return true;
  }
  return false;
}

/**
 * Je verifie que l'email est valide avec une regex spécifique
 */
function emailInvalide() {
  const email = document.querySelector("#email").value;
  emailErrorMsg.textContent = "";

  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regex.test(email) === false) {
    emailErrorMsg.textContent = "Entrez une adresse email valide";
    return true;
  }
  return false;
}
