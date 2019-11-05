$('.js-add-new').on('click', () => {
  $('.modal-product-edit form').data('action', 'new');
  $('.modal-product-edit h5').text('Adding a new product');
  $('.modal-product-edit').show();
});
