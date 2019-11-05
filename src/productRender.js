const productRender = (name, action, productRow) => {
  const productTemplate = $('#product-template').html();
  const compiled = _.template(productTemplate);

  const productData = {
    name,
    count: productsInfo[name].count,
    price: priceFormat(productsInfo[name].price)
  };

  switch (action) {
    case 'edit':
      productRow.replaceWith(compiled(productData));
      break;
    default:
      $('.table tbody').append(compiled(productData));
      break;
  }
};

Object.keys(productsInfo).forEach((name) => productRender(name));
