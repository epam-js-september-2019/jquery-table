function selectAllHandler() {
  $("#selectAll").change(function() {
    let boxes = [];
    let countryName = $("#select option:selected").html();
    if (this.checked) {
      for (let i = 0; i < deliveryToCountries.length; i++) {
        boxes = $("#checkboxes-group input");
        if (deliveryToCountries[i].hasOwnProperty(countryName)) {
          for (j = 0; j < boxes.length; j++) {
            deliveryToCountries[i][countryName].push(boxes[j].value);
          }
        }
      }
      $("#checkboxes-group input").prop("checked", true);
      boxes = [];
    } else {
      for (let i = 0; i < deliveryToCountries.length; i++) {
        if (deliveryToCountries[i].hasOwnProperty(countryName)) {
          deliveryToCountries[i][countryName] = [];
        }
      }
      $("#checkboxes-group input").prop("checked", false);
    }
  });

  inputsHandler();
}
