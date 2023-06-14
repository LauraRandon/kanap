//Récupérer la chaîne de requête dans l'URL du navigateur et extraction de l'id de l'URL
const idSearch = window.location.search;

const urlParams = new URLSearchParams(idSearch);

const id = urlParams.get('id');

const urlApi = 'http://localhost:3000/api/products/' + id;

//Appel de l'api pour récuperer les informations du produit

fetch(urlApi)
    .then(reponse => reponse.json())
    .then(data => {

        // Ajout du nom du produit dans la balise title du navigateur
        document.title = data.name;

        //Afficher les informations récupérées de l'api au bon endroit sur la page produit
        let img = document.querySelector('.item__img');
        img.innerHTML = `<img src='${data.imageUrl}' alt='${data.altTxt}'>`;

        let name = document.querySelector('#title');
        name.innerHTML = `${data.name}`;

        let price = document.querySelector('#price');
        price.innerHTML = `${data.price}`;

        let desc = document.querySelector('#description');
        desc.innerHTML = `${data.description}`;

        // Afficher les couleurs
        const parser = new DOMParser();
        const colors = document.querySelector('#colors');

        for (i = 0; i < data.colors.length; i++) {
            let produitCouleur = 
                `<option value='${data.colors[i]}'>${data.colors[i]}</option>`;
            const affichageCouleur = parser.parseFromString(produitCouleur, "text/html");
            colors.appendChild(affichageCouleur.body.firstChild);
        }

    })
    //Création d'un message en cas de problème au chargement de l'api
    .catch(err => {
        alert(`Une erreur s'est produite le produit est introuvable. Veuillez nous en excuser !`);
        console.log("Erreur Fetch script.js", err);
       });


//*********************** Récupérer les données choisi par l'utilisateur pour l'envoyer au panier ***********************/

//Récuperer la couleur choisie
function colorValue() {
    let color = document.querySelector(`#colors`);
    return color.value;
};

//Récuperer la quantité choisie 
function qtyValue() {
    let qty = document.querySelector(`#quantity`);
    return qty.value;
};

//Fonction pour ajouter un produit dans le localStorage
const addToCartHTMLElement = (id, color, qty) => {

    //Erreur si aucune couleur et quantité choisies
    if (color == "" && qty == "0") {
        return alert(`La couleur et la quantité n'ont pas été sélectionnée, merci de choisir une couleur et une quantité en 1 et 100 !`)
    }

    //Erreur si aucune couleur choisie
    if (color === "") {
        return alert(`Aucune couleur sélectionnée, merci de choisir votre coleur !`);
    }

    //Erreur si aucune quantité choisie
    if (qty <= 0 || qty >= 101) {
        return alert(`Mauvaise quantité sélectionnée, merci de choisir une quantité comprise entre 1 et 100 !`)
    }

    //Ajout au panier
    let itemsLocalStorage = getCart();

    //Si le panier n'existe pas = création d'un object dans le tableau
    if (itemsLocalStorage.length === 0) {
        itemsLocalStorage = [{id: id, color: color, qty: qty}];

    //Si le panier existe
    } else {
        let found = false;

        //Si l'id et la couleur existe déja dans le tableau du panier, incrémenter la nouvelle quantité à la quantité affiché dans le panier
        for (let i = 0; i < itemsLocalStorage.length; i++) {
            if (id === itemsLocalStorage[i].id && color === itemsLocalStorage[i].color) {
                found = true;
                itemsLocalStorage[i].qty += qty;
                alert(`La quantité du produit a bien été mise à jour !`);
            }
        }

        //S'il n'existe pas = création d'un nouveau objet dans le tableau du panier
        if (found === false) {
            let item = {id: id, color: color, qty: qty};
            itemsLocalStorage.push(item);
        }
    }

    localStorage.setItem(`selectedProduct`, JSON.stringify(itemsLocalStorage));
    alert(`Produit(s) ajouté(s) au panier !`);
}

//Rattachement bouton d'ajout au panier
const addToCart = document.querySelector (`#addToCart`);

//Création de l'événement au 'click' pour ajouter au panier en écoutant la couleur et la quantité sélectionné si elles sont validées
addToCart.addEventListener(`click`, () => {
    let color = colorValue();
    let qty = parseInt(qtyValue());
    addToCartHTMLElement(id, color, qty);
});


