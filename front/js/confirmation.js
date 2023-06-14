//Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
const comm = window.location;

const url = new URL(comm);

const id = url.searchParams.get("id");

const orderId = document.querySelector(".confirmation");

orderId.innerHTML = ` <p>Commande validée ! <br><br>Votre numéro de commande est : <br><br><span id="orderId"><strong>${id}</strong><br><br>Merci pour votre commande 😀 !</span>`;;
