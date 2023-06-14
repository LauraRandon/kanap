//Récupérations des produits depuis l'API à l'aide de 'FETCH', que l'on met dans une constante 'sectionFiches'
fetch('http://localhost:3000/api/products')
    .then(reponse => reponse.json())
    .then(data => {
        //Récupération de l'élément DOM qui accueillera les fiches produits sur la page d'accueil, ici dans la section '.items'
        const parser = new DOMParser();
        const sectionFiches = document.querySelector('.items');

        for (let i = 0; i < data.length; i++) {

            //Création d'un élément dédié à un produit
            //Rattachement des éléments HTML de la page d'accueil aux données correspondantes de l'api
            let produitElement =
            `<a href="./product.html?id=${data[i]._id}">
                <article>
                    <img src="${data[i].imageUrl}" alt="${data[i].altTxt}" />
                    <h3 class="productName">${data[i].name}</h3>
                    <p class="productDescription">${data[i].description}</p>
                </article>
             </a>`;
             //Afficher nos éléments et nos données au bon endroit
             const affichageProduit = parser.parseFromString(produitElement, "text/html");
             sectionFiches.appendChild(affichageProduit.body.firstChild);
        }
            
    })
    //Création d'un message en cas de problème au chargement de l'api
    .catch(err => {
        alert(`Une erreur s'est produite et ne permet pas d'afficher les produits de notre catalogue. Veuillez nous en excuser !`);
        console.log("Erreur Fetch script.js", err);
       })



    