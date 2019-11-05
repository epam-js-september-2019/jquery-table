const checkProductValues = (action) => {
  $('#name, #email, #count, #price').each((index, element) => {
    const id = $(element).attr('id');
    const value = $(element).val();

    const price = priceUnformat(value);
    const regex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

    let error = '';

    const errorToggle = () => {
      $(element)
        .siblings('.error')
        .text(error);
      $(element).toggleClass('text-danger border-danger', error !== '');
    };

    switch (id) {
      case 'name':
        if (value === '') {
          error = "Field can't be empty";
        } else if (value.length < 5) {
          error = 'Name min length is 5 characters';
        } else if (value.length > 15) {
          error = 'Name max length is 15 characters';
        } else if (value.replace(/\s/g, '') === '') {
          error = "Name can't consist of only spaces";
        } else if (
          (Object.prototype.hasOwnProperty.call(productsInfo, value)
            && action === 'new')
          || (Object.prototype.hasOwnProperty.call(productsInfo, value)
            && editOrDelete.getProductName() !== value
            && action === 'edit')
        ) {
          error = 'Product with the same name already exists!';
        }

        errorToggle();
        break;

      case 'email':
        if (value === '') {
          error = "Field can't be empty";
        } else if (regex.test(value) === false) {
          error = 'Invalid email address';
        }

        errorToggle();
        break;

      case 'count':
        if (value === '') {
          error = "Field can't be empty";
        }

        errorToggle();
        break;

      case 'price':
        if (Number.isNaN(price)) {
          error = 'Price should be a number';
        } else if (price === 0) {
          error = "Price shouldn't be zero value";
        }

        errorToggle();
        break;
    }
  });

  const errorCount = $('.modal-product-edit input.text-danger')
    .filter(':first')
    .focus();

  if (errorCount.length === 0) {
    return true;
  }

  return false;
};
