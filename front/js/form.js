//*********************** Remplir le formulaire ***********************/

//Mise en place des RegExp classiques

//Création des variables associées aux champs input du formulaire
const form = document.querySelector('.cart__order__form');

const prenom = document.querySelector('#firstName');
const nom = document.querySelector('#lastName');
const adresse = document.querySelector('#address');
const ville = document.querySelector('#city');
const mail = document.querySelector('#email');

//Création de RegExp (expression régulières pour contrôler les informations entrées par l'utilisateur) pour les prénoms et les noms
const regexpNames = new RegExp (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/i);

//Création de RegExp (expression régulières pour contrôler les informations entrées par l'utilisateur) pourl'adresse et la ville
const regexpAddress = new RegExp ("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");

//Création de RegExp (expression régulières pour contrôler les informations entrées par l'utilisateur) pour l'email
const regexpEmail = new RegExp ('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

//Fonction pour valider le champs du prénom ou envoyer un message d'erreur
const validFirstName = function(inputFirstName) {
    let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');

    if (regexpNames.test(inputFirstName.value)) {
        firstNameErrorMsg.innerText = ``;
        return true;
    } else {
        firstNameErrorMsg.innerText = `Merci de renseigner votre prénom ! (Les chiffres et caractères spéciaux ne sont pas autorisés)`;
        return false;
    }
    
}

//Fonction pour valider le champs du nom ou envoyer un message d'erreur
const validLastName = function(inputLastName) {
    let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');

    if (regexpNames.test(inputLastName.value)) {
        lastNameErrorMsg.innerText = ``;
        return true;
    } else {
        lastNameErrorMsg.innerText = `Merci de renseigner votre nom ! (Les chiffres et caractères spéciaux ne sont pas autorisés)`;
        return false;
    }
}

//Fonction pour valider le champs de l'adresse ou envoyer un message d'erreur
const validAddress = function(inputAddress) {
    let addressErrorMsg = document.querySelector('#addressErrorMsg');

    if (regexpAddress.test(inputAddress.value)) {
        addressErrorMsg.innerText = ``;
        return true;
    } else {
        addressErrorMsg.innerText = `Merci de renseigner votre numéro et le nom de votre adresse ! (Les caractères spéciaux ne sont pas autorisés)`;
        return false;
    }
}

//Fonction pour valider le champs de la ville ou envoyer un message d'erreur
const validCity = function(inputCity) {
    let cityErrorMsg = document.querySelector('#cityErrorMsg');

    if (regexpAddress.test(inputCity.value)) {
        cityErrorMsg.innerText = ``;
        return true;
    } else {
        cityErrorMsg.innerText = `Merci de renseigner votre code postale et le nom de votre ville ! (Les caractères spéciaux ne sont pas autorisés)`;
        return false;
    }
}

//Fonction pour valider le champs de l'email ou envoyer un message d'erreur
const validEmail = function(inputEmail) {
    let emailErrorMsg = document.querySelector('#emailErrorMsg');

    if (regexpEmail.test(inputEmail.value)) {
        emailErrorMsg.innerText = ``;
        return true;
    } else {
        emailErrorMsg.innerText = `Merci de renseigner votre adresse mail, elle doit contenir un '@' et un point !`;
        return false;
    }
}

//Ajout de l'évènement d'écoute 'change' pour les inputs
prenom.addEventListener('change', function() {
    validFirstName(this);
});

nom.addEventListener('change', function() {
    validLastName(this);
});

address.addEventListener('change', function() {
    validAddress(this);
});

ville.addEventListener('change', function() {
    validCity(this);
});

mail.addEventListener('change', function() {
    validEmail(this);
});

//*********************** Envoyer le formulaire ***********************/

//Ecouter la soumission du formulaire
const postUrl = 'http://localhost:3000/api/products/order/';
form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendForm();
});

//Fonction pour créer l'objet 'contact' et les id des produits choisis
const createObjectToSend = () => {

    //Création de l'objet 'contact' contenant les éléments du formulaire
    let contact = {
        firstName: prenom.value,
        lastName: nom.value,
        address: adresse.value,
        city: ville.value,
        email: mail.value,
    };

    let itemsLocalStorage = getCart();
    let products = [];

    for (i = 0; i < itemsLocalStorage.length; i++) {
        if (products.find((e) => e == itemsLocalStorage[i].id)) {
            console.log('not found');
        } else {
            products.push(itemsLocalStorage[i].id);
        }
    }

    localStorage.setItem("contact", JSON.stringify(contact));
    

    let sendToServ = JSON.stringify({ contact, products }); 
    return sendToServ;
}


//Fonction d'envoie du formulaire
const sendForm = () => {
    let itemsLocalStorage = getCart ();

    //Si la quantité d'un produit est < ou = à 0 / > ou = à 101
    for (i = 0; i < itemsLocalStorage.length; i++) {
        if (itemsLocalStorage[i].qty <= 0 || itemsLocalStorage[i].qty >= 101) {
            return alert(`La quantité d'un produit doit être comprise entre 1 et 100 !`);
        }
    }

    //Si le panier est vide = envoie d'un message d'erreur
    if (itemsLocalStorage.length === 0) {
        return alert(`Votre panier est vide !`);

    //Si le panier n'est pas vide
    } else {
        //Si tous les champs du formulaire sont validés
        if (validFirstName(prenom) && validLastName(nom) && validAddress(adresse) && validCity(ville) && validEmail(mail)) {
            let sendToServ = createObjectToSend();
            fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: sendToServ,
            })
                .then((reponse) => reponse.json())
                .then((data) => {
                    localStorage.clear();
                    document.querySelector('.cart__order__form').reset();
                    document.location.href = "confirmation.html?id=" + data.orderId;
                })
                .catch(() => {
                    alert(`Une erreur interne est survenue. Veuillez nous en excuser !`);
                });
        } else {
            return alert(`Veuillez vérifier que tous les champs du formulaire soient correctement remplis.`)
        }
    }
}