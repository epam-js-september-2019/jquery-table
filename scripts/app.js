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

var $jq = jQuery.noConflict();

(function($) {
  //$ local scoped
  const countriesDelivery = new Map();
  const productsList = [];

  //Load cities list for each country
  (function() {
    countriesDelivery.set(
      "Russia",
      new Country("Russia", ["Saratov", "Moskow", "St.Petersburg"])
    );
    countriesDelivery.set(
      "USA",
      new Country("USA", ["Los Angeles", "California", "Texas"])
    );
    countriesDelivery.set(
      "Belorus",
      new Country("Belorus", ["Minsk", "Gomel", "Mozyr"])
    );
  })();

  //Dom is ready
  $(function() {
    const modal1 = $(".custom-modal-1");
    const modal2 = $(".custom-modal-2");

    //Clean modal-1 inputs on cancel
    function cleanModal1() {
      let inputs = modal1.find("input");
      let select = modal1.find("select");
      inputs.val("").prop("checked", false);
      select.val("russia");
    }

    //Open modal-1 on add new button click
    $("#addItem").on("click", () => {
      modal1.show();
    });

    //Hide and reset modal-1 on cancel button click
    $("#cancel").on("click", function() {
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
    $("#save").on("click", () => {
      console.log("test");
      const name = modal1.find("#productName");
      const supplier = modal1.find("#supplierEmail");
      const count = modal1.find("#productCount");
      const price = modal1.find("#productPrice");
      const country = modal1.find("#deliverySelect");
      const product = new Product(
        name.val(),
        supplier.val(),
        count.val(),
        price.val(),
        countriesDelivery.get(country.val())
      );
      console.log(product);
    });
  });
})(jQuery);
