const saveLocally = () => {
  localStorage.setItem('productsInfo', JSON.stringify(productsInfo));
};

if (!localStorage.getItem('productsInfo')) {
  localStorage.setItem('productsInfo', JSON.stringify(defaultProductsInfo));
}

const productsInfo = JSON.parse(localStorage.getItem('productsInfo'));
