$('.modal-warning .js-delete').on('click', () => {
  const productRow = editOrDelete.getProductRow();
  const name = editOrDelete.getProductName();

  timer().done(() => {
    productRow.remove();
    delete productsInfo[name];
    saveLocally();
  });

  productRow.find('button').prop('disabled', true);
  $('.modal-warning').hide();
});

$('.modal-warning .js-cancel').on('click', () => {
  $('.modal-warning').hide();
});
