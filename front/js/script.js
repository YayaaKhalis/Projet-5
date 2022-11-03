// Récupération données de l'API avec fetch
// Permet d'exécuter des requêtes HTTP (type GET) sans avoir besoin de recharger la page du navigateur
// retour format JSON (JavaScript Object Notation)
fetch("http://localhost:3000/api/products")
  .then((reponse) => reponse.json())
  .then((api) => {
    return ajoutProduits(api);
  })
  .catch((erreur) => {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("Erreur d'API :" + erreur);
  });

/**
 * Je créer les cartes produit avec une boucle for sur les données de l'API
 * @param {Object} api
 */
function ajoutProduits(api) {
  // création boucle produit sur l'api
  for (let i = 0; i < api.length; i++) {
    // récupération données api et déclaration
    // variable des informations carte produit
    const id = api[i]._id;
    const imageUrl = api[i].imageUrl;
    const altTxt = api[i].altTxt;
    const name = api[i].name;
    const description = api[i].description;

    // ajout de paramètre aux variables
    const lienCarte = ajoutLien(id);
    const article = document.createElement("article");
    const image = ajoutImage(imageUrl, altTxt);
    const h3 = ajoutH3(name);
    const p = ajoutTexte(description);

    // ajout de l'image, titre et description
    // à la carte produit (article) + ajout lien et carte
    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);
    ajoutBalise(lienCarte, article);
  }
}

/**
 * J'ajoute l'id du produit dans le lien de la carte produit
 * @param {string} id
 */
function ajoutLien(id) {
  const lienCarte = document.createElement("a");
  lienCarte.href = "./product.html?id=" + id;
  return lienCarte;
}

/**
 * J'ajoute le lien de la carte et la carte produit
 * @param {Object} lienCarte
 * @param {Object} article
 */
function ajoutBalise(lienCarte, article) {
  const items = document.querySelector("#items");
  items.appendChild(lienCarte);
  lienCarte.appendChild(article);
}

/**
 * J'ajoute l'image et le alt texte dans la carte produit
 * @param {string} imageUrl
 * @param {string} altTxt
 */
function ajoutImage(imageUrl, altTxt) {
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}

/**
 * J'ajoute la balise h3 (productName) dans la carte produit
 * @param {string} name
 */
function ajoutH3(name) {
  const h3 = document.createElement("h3");
  h3.textContent = name;
  h3.classList.add("productName");
  return h3;
}

/**
 * J'ajoute le texte description dans la carte produit
 * @param {string} description
 */
function ajoutTexte(description) {
  const p = document.createElement("p");
  p.textContent = description;
  p.classList.add("productDescrition");
  return p;
}
