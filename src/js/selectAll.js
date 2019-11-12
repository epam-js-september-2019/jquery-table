function selectAllHandler() {
  $("#selectAll").change(function() {
    let boxes = $("#checkboxes-group input");
    let countryName = $("#select option:selected").html();

    if (this.checked) {
      $("#checkboxes-group input").prop("checked", true);
      for (let i = 0; i < deliveryToCountries.length; i++) {
        if (
          deliveryToCountries[i].hasOwnProperty(countryName) &&
          deliveryToCountries[i][countryName].length < 3
        ) {
          for (let j = 0; j < boxes.length; j++) {
            deliveryToCountries[i][countryName].push(boxes[j].value);
          }
        }
      }
    } else {
      for (let i = 0; i < deliveryToCountries.length; i++) {
        if (deliveryToCountries[i].hasOwnProperty(countryName)) {
          deliveryToCountries[i][countryName] = [];
        }
      }
      $("#checkboxes-group input").prop("checked", false);
    }
  });
}
