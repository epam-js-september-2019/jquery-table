"use strict";

class Country {
  constructor(name, cities = []) {
    this.name = name;
    this.cities = cities;
  }
}

class Product {
  constructor(name, supplier, amount, price, country) {
    this.name = name;
    this.supplier = supplier;
    this.amount = amount;
    this.price = price;
    this.country = country;
  }
}

$(function() {
  const modal1 = $(".custom-modal-1");
  const modal2 = $(".custom-modal-2");
  const productsList = [];
  const countriesDelivery = [];

  //Load cities list for each country
  (function() {
    countriesDelivery.push(
      new Country("Russia", ["Saratov", "Moskow", "St.Petersburg"])
    );
    countriesDelivery.push(
      new Country("USA", ["Los Angeles", "California", "Texas"])
    );
    countriesDelivery.push(new Country("Belorus", ["Minsk", "Gomel", "Mozyr"]));
  })();

  console.log(countriesDelivery);

  //Clean modal-1 inputs on cancel
  function cleanModal1() {
    let inputs = modal1.find("input");
    let select = modal1.find("select");
    inputs.val("").prop("checked", false);
    select.val("russia");
  }

  //Open modal-1 on add new button click
  $("button[data-buttonId=add]").on("click", () => {
    modal1.show();
  });

  //Hide and reset modal-1 on cancel button click
  $("button[data-buttonId=cancel]").on("click", function() {
    cleanModal1();
    modal1.hide();
  });

  //Hide and reset modal on grey area click
  $(window).on("click", function(event) {
    if ($(event.target)[0] == modal1[0] || $(event.target)[0] == modal2[0]) {
      if ($(event.target)[0] == modal1[0]) cleanModal1();
      $(event.target).hide();
    }
  });

  //Add or Update product on save changes click
  $("button[data-buttondId=save").on("click", () => {
    const product = new Product();
  });
});
