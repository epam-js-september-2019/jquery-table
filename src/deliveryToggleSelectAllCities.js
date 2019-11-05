const toggleSelectAllCities = () => {
  if ($('input[id ^= city_]:checked').length === $('input[id ^= city_]').length) {
    $('#select-all-cities').prop('checked', true);
  } else {
    $('#select-all-cities').prop('checked', false);
  }
};
