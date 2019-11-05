$('.modal-product-edit form').on('submit', function (evt) {
  evt.preventDefault();
  const action = $(this).data('action');
  const productRow = editOrDelete.getProductRow();

  if (checkProductValues(action)) {
    const valuesArr = $('#name, #email, #count, #price')
      .map(function () {
        return $(this).val();
      })
      .get();

    const [name, email, count, price] = valuesArr;

    Object.keys(tempDelivery).forEach((country) => {
      if (tempDelivery[country].length === 0) {
        delete tempDelivery[country];
      }
    });

    const delivery = tempDelivery;

    timer().done(() => {
      if (editOrDelete.getProductName() !== name && action === 'edit') {
        delete productsInfo[editOrDelete.getProductName()];
      }

      productsInfo[name] = {
        email,
        price: priceUnformat(price),
        count: +count,
        delivery
      };

      saveLocally();
      productRender(name, action, productRow);
    });

    $('#country option')
      .eq(0)
      .replaceWith('<option hidden disabled selected>Select a country</option>')
      .prop('selected', 'true');

    $('#city-list').hide();

    tempDelivery = {};
    search.reset();
    filter.reset();

    if (action === 'edit') {
      productRow.find('button').prop('disabled', true);
    }

    $('.modal-product-edit').hide();
    $('#name, #email, #count, #price').val('');
  }
});
