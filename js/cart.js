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