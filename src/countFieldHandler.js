$('#count').on('input', function () {
  $(this).val(
    $(this)
      .val()
      .replace(/\D+/g, '')
  );
});
