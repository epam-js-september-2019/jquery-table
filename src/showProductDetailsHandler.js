$('.table tbody').on('click', 'a', function (evt) {
  evt.preventDefault();

  const productInfo = $('#product-info-modal-template').html();
  const compiled = _.template(productInfo);
  const name = $(this).text();

  const productData = {
    name,
    count: productsInfo[name].count,
    email: productsInfo[name].email,
    price: priceFormat(productsInfo[name].price),
    deliveryCountries: Object.keys(productsInfo[name].delivery)
  };

  $('.modal-product-info .modal-main-content').replaceWith(
    compiled(productData)
  );
  $('.modal-product-info').show();
});
