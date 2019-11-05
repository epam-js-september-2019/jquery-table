const editOrDelete = (() => {
  let productRow;
  let name;

  const getProductRow = () => productRow;

  const getProductName = () => name;

  $('.table tbody').on('click', (evt) => {
    productRow = $(evt.target).closest('tr');
    name = productRow.find('a').text();

    if (evt.target.dataset.action === 'edit') {
      $('.modal-product-edit form').data('action', 'edit');

      $('#name').val(name);
      $('#email').val(productsInfo[name].email);
      $('#count').val(productsInfo[name].count);
      $('#price').val(priceFormat(productsInfo[name].price));

      tempDelivery = JSON.parse(JSON.stringify(productsInfo[name].delivery));

      const cityArr = Object.keys(productsInfo[name].delivery);

      if (cityArr.length !== 0) {
        let firstMatch;

        for (let i = 0; i < Object.keys(deliveryCountries).length; i += 1) {
          if (cityArr.includes(Object.keys(deliveryCountries)[i])) {
            firstMatch = Object.keys(deliveryCountries)[i];
            break;
          }
        }

        $('#country option').each(function () {
          if ($(this).text() === firstMatch) {
            $(this).prop('selected', 'true');
          }
        });

        $('#country').trigger('change');
      }

      $('.modal-product-edit h5').text(`${name} - Editing`);
      $('.modal-product-edit').show();
    }

    if (evt.target.dataset.action === 'delete') {
      $('.modal-warning p').text(`Are you sure you want to delete ${name}?`);
      $('.modal-warning').show();
    }
  });

  return {
    getProductRow,
    getProductName
  };
})();
