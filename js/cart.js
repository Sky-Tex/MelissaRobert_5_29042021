const panier = JSON.parse(localStorage.getItem("panier"));

//Condition pour afficher le panier
if (panier) {
  ligneTableau();
} else {
  tableauVide();
}
//Boucle importation 
function ligneTableau() {
  panier.forEach(function(result, index) {infosHTML(result, index);});
  totalPanier();
  cartNumber();
}
//Html par  produit dans le panier
function infosHTML(result, index) {
  document.getElementById("ajout_panier").innerHTML += `
    <tbody id="products-tablebody">
      <tr id="ligne_tableau">
        <td class="text-center"><img src="${result.image}"  alt="appareil ${result.name}"> <br/> ${result.name} <br/> Objectif : ${result.lenses}</td>
        <td class="text-center">
          <button disabled="disabled" onclick="quantiteMoins(${index})" id="bouton_moins${index}" class="btn btn-secondary btn-sm">-</button>
          <span id="quantite_nombre${index}" class="quantite_produit">${result.quantite}</span>
          <button onclick="quantitePlus(${index})" id="bouton_plus${index}" class="btn btn-secondary btn-sm">+</button>
        </td>
        <td id="prix_unite${index}" class="text-center">${result.price + " €"}</td>
        <td id="sous_total${index}"class="subtotal text-center">${result.subTotal + " €"}</td>
        <td class="text-center"><i id="supp_produit" onclick="annulerArticle()" type="button" class="fas fa-trash-alt" title="Supprimer le produit"></i></td>
      </tr>
    </tbody>`;
}
//Calcul et affichage du prix total panier
function totalPanier() {
  let total = 0;
  panier.forEach(function(result, index) {
    total = total + panier[index].price * panier[index].quantite;
    console.log(total);
  });
  document.getElementById("prix_total").textContent = total + " €";
  localStorage.setItem("totalPanier", total);
}

//Lorsque le panier est vide les éléments n'apparaissent pas (bouton-panier)
function tableauVide() {
  document.getElementById("panier_vide").innerHTML += `
    <div class="container col-6 text-center border shadow bg-white rounded p-4 ">
      <h3 class="mb-4">Votre panier est vide...</h3>
      <i class="fas fa-shopping-cart fa-1x"></i>
    </div>`
  ;
  document.getElementById("tableau_panier").style.display = "none";
  document.getElementById("vider_panier").style.display = "none";
  document.getElementById("formulaire").style.display = "none";
  document.getElementById("valid_commande").style.display = "none";
}
//Vidage panier et localStorage
function viderPanier() {
  localStorage.clear();
  location.reload();
}
// Retire un article du panier
function annulerArticle(i) {
  panier.splice(i, 1);// Suppression produit du panier
  localStorage.clear(); // Suppression du localstorage
  // Màj du panier après suppression du produit
  localStorage.setItem("panier", JSON.stringify(panier));
  //rechargement de la page pour rafraichir les actions
  window.location.reload();
}
//Ajout quantité dans le panier
function quantitePlus(index) {
  let quantite = document.getElementById(`quantite_nombre${index}`);
  let ajoutQuantite = ++panier[index].quantite; //on incrémentation de la quantité dans le localstorage
  quantite.textContent = ajoutQuantite; //Màj de la quantité dans le tableau
  let sousTotal = document.getElementById(`sous_total${index}`);
  let ajoutTotal = panier[index].price * panier[index].quantite;
  sousTotal.textContent = `${ajoutTotal} €`; //Màj du sous-total dans le tableau
  //console.log(ajoutQuantite)
  localStorage.setItem("panier", JSON.stringify(panier)); //Màj localstorage
  totalPanier(); //Màj total panier
  if (ajoutQuantite > 1) {
    document.getElementById(`bouton_moins${index}`).removeAttribute("disabled");
  }
}
//Retrait quantite dans le panier
function quantiteMoins(index) {
  let quantite = document.getElementById(`quantite_nombre${index}`);
  let retraitQuantite = --panier[index].quantite; //Décrémentation de la quantité dans le localstorage
  quantite.textContent = retraitQuantite; //Màj de la quantité dans le tableau
  let sousTotal = document.getElementById(`sous_total${index}`);
  let ajoutTotal = panier[index].price * panier[index].quantite;
  sousTotal.textContent = `${ajoutTotal} €`; //Màj du sous-total dans le tableau
  //console.log(retraitQuantite)
  localStorage.setItem("panier", JSON.stringify(panier)); // Màj du localstorage
  totalPanier(); //Màj du total panier
  if (retraitQuantite <= 1) {
    document.getElementById(`bouton_moins${index}`).setAttribute("disabled", "disabled");
  }
}

// FORM and  REQUEST POST

//Evènement pour vérifier le champ mail en enlevant le focus
document.querySelector("#mail").addEventListener("blur", function() {
  const mail = document.querySelector("#mail").value;
  const regexEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; //Utilisation de regex pour vérifier les caractères
  if (!regexEmail.test(mail)) {
    document.querySelector("#erreur_mail").textContent =
      "Veuillez vérifier votre email svp";
  }
});

//Evenement pour vérifier le champ postalcode en enlevant le focus
document.querySelector("#postalcode").addEventListener("blur", function() {
  const postalCode = document.querySelector("#postalcode").value;
  const regexEmail = /[0-9]{5}/; //Utilisation de regex pour vérifier les caractères
  if (!regexEmail.test(postalCode)) {
    document.querySelector("#erreur_code").textContent =
      "Code postal non valide. 5 chiffres obligatoires";
  }
});

//Evenement pour effacer le formulaire
document.querySelector("#rafraichir").addEventListener("click", function() {
  document.querySelector("#erreur_mail").textContent = "";
  document.querySelector("#erreur_code").textContent = "";
});

//Evenement pour valider le formulaire et envoyer la requete POST
document.querySelector("#formulaire").addEventListener("submit", function(event){
  event.preventDefault();
  let input = document.getElementsByTagName("input");

  for (let i = 0; i < input.length; i++) { //boucle pour vérifier si chaque champ a été renseigné
    if (input[i].value == "") { //si un des champs est vide, afficahge d'un message erreur 
      swal("Attention !","Formulaire incomplet ! Merci de renseigner complètement le formulaire","warning")
      return false;
    }
  }
  requestPost()
  confirmCommand()
  localStorage.clear()
  totalPanier()
});

//pour créer la requete POST avec numero commande et infos contact
function requestPost() {
  const idTableau = panier.map(function (product) {return product.id;});
  let order = {
    contact: {
      firstName: document.querySelector("#firstname").value.trim(),
      lastName: document.querySelector("#name").value.trim(),
      address: document.querySelector("#adress").value.trim(),
      city: document.querySelector("#city").value.trim(),
      email: document.querySelector("#mail").value.trim(),
    },
    products: idTableau,
  };
  console.log(order);

  const request = new Request( //Requete POST vers API
    "https://p5ochphil.herokuapp.com/api/cameras/order",
    {
      method: "POST",
      body: JSON.stringify(order),
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    }
  );

  fetch(request)
    .then((response) => response.json())
    .then((response) => { //Réponse de l'API pour obtenir numéro de commande
      let numCommand = response.orderId;
      //console.log(numCommand)
      localStorage.setItem("idCommand", JSON.stringify(numCommand)); //Màj du localstorage avec numero de commande
      localStorage.setItem("infosOrder",JSON.stringify(order)); //Màj du localstorage avec infos de commande
    });
}

// Confirmation de la commande
function confirmCommand() {
  swal("Votre commande est validée, vous allez être redirigé(e)", "", "success");
  setTimeout(function() {window.location = './confirmation.html'; }, 3000);
}
