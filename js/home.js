const getListOfProducts = async () => {
    try {
      const response = await fetch('https://ab-p5-api.herokuapp.com/api/cameras');
      if (response.ok) {
        const data = await response.json();
        data.forEach(element => {
          let product = document.createElement('a');
          product.className = 'redirection-page-produit';
          product.href = `produit.html?id=${element._id}`;
          product.innerHTML = `
              <div class="product flex">
                <div class="product__infos">
                    <h2 class="product__infos__title">${element.name}</h2>
                    <p class="product__infos__description">${element.description}</p>
                </div>
                <div>
                    <img class="product__image" src=${element.imageUrl} height="200">
                </div>
              </div>
            <hr class="product__divider">`;
          document.querySelector('#container-list').append(product);
        });
      } else {
        console.error('Retour du serveur : ', response.status);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  getListOfProducts();