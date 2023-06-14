//Fonction pour récupérer le panier dans le localStorage
const getCart = () => {
    let itemsLocalStorage = [];
    if (localStorage.getItem(`selectedProduct`) !== null) {
        itemsLocalStorage = JSON.parse(localStorage.getItem(`selectedProduct`));
    }
    return itemsLocalStorage;
}