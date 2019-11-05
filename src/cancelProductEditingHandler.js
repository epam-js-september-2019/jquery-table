$('.modal-product-edit .js-cancel').on('click', (evt) => {
  evt.preventDefault();

  $('.modal-product-edit').hide();
  $('#name, #email, #count, #price')
    .val('')
    .removeClass('border-danger text-danger')
    .siblings('.error')
    .text('');

  $('#country option')
    .eq(0)
    .replaceWith('<option hidden disabled selected>Select a country</option>')
    .prop('selected', 'true');

  $('#city-list').hide();
  tempDelivery = {};
});
