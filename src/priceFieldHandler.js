$('#price').on('focus blur', function (evt) {
  const value = $(this).val();

  switch (evt.type) {
    case 'focus':
      $(this).val(priceUnformat(value));
      if ($(this).val() == 0) {
        $(this).val('');
      }
      break;
    case 'blur':
      $(this).val(priceFormat(value));
      break;
  }
});
