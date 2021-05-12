function getRequest(){
    const fetchPromise = fetch("https://oc-p5-api.herokuapp.com/api/cameras");
	const inputJS = document.getElementById("produits");
	
	fetchPromise.then(response => {
	  return response.json(); 
	})
	.then((data => {
	  data.forEach((item)  => { 
		const { name, price, _id, description, imageUrl } = item;
				inputJS.innerHTML +=`
				<div class="container col-md-6 col-lg-4">
				   <div class="affichage_produit mt-4 card bg-white">
					  <img class=”card-img-top” src="${imageUrl}"  alt="appareil ${name}">
					  <div class="card-body">
						 <h3 class="card-title">${name}</h3>
						  <span>${price/100}€</span></p>
						 <p class="card-text product-description">${description}</p>
						 <div class="text-center mt-4" ><a id="bouton" type="button" class="btn btn-secondary text-white" onclick="window.location.href = './produit.html?id=${_id}'">Choisir</a></div>
					  </div>
				   </div>
				</div>`
	   })
	}))
	
	}

	
	getRequest()
	cartNumber()