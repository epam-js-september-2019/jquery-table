const deliveryToCountriesDefault = () => {
  deliveryToCountries = [{ Russia: [] }, { Belarus: [] }, { USA: [] }];
};

deliveryToCountriesDefault();

const selectHandler = () => {
  $("#select").change(e => {
    let target = $(e.target),
      value = target.val(),
      id = modalEdit.attr("data-modal");
    setCities(value, id);
    inputsHandler();
  });
};

const inputsHandler = () => {
  $("#checkboxes-group input").change(function(e) {
    let countryName = $("#select option:selected").html();
    for (let i = 0; i < deliveryToCountries.length; i++) {
      if (deliveryToCountries[i].hasOwnProperty(countryName)) {
        deliveryToCountries[i][countryName].push($(e.target).val());
      }
    }
    if (
      $("#checkboxes-group input:checked").length ===
      $("#checkboxes-group input").length
    ) {
      $("#selectAll").prop("checked", true);
    } else {
      $("#selectAll").prop("checked", false);
    }
  });
};

selectHandler();
