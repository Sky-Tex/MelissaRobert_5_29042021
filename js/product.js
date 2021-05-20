function ajoutContent () {
    let id = new URL(window.location).searchParams.get('id')
  fetch(`${"https://p5ochphil.herokuapp.com/api/cameras"}/${id}`)
      .then(response => response.json()).then (data => {
        
          article = data
          ajoutHTML()
          ajoutLenses()
          console.log(article);        
      })
  }

  function ajoutHTML() {
    document.getElementById('focus_produit').innerHTML += 
    `
      <div class="affichage_produit">
        <img class=”image_produit” src="${article.imageUrl}"  alt="appareil ${article.name}">
        <h3 class="ml-4 mt-4">${article.name}</h3>
        <p class="description_produit ml-4">${article.description}</p>
        <p class="prix_produit mt-4 ml-4"><span>${article.price/100}€</span></p>
      </div>
    `
  }

  function ajoutLenses() {
    for (let i = 0; i < article.lenses.length; i++) {
    document.getElementById("lense_select").innerHTML += `<option value="${article.lenses[i]}">${article.lenses[i]}</option>`
    }
  }

  ajoutContent();
  cartNumber()