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

class ValidationResult {
  constructor(value = false, message = "") {
    this._value = value;
    this._message = message;
  }
  /**
   * @param {boolean} value
   */
  set value(value) {
    this._value = value;
  }
  /**
   * @param {string} message
   */
  set message(message) {
    this._message = message;
  }
  get value() {
    return this._value;
  }

  get message() {
    return this._message;
  }
}

//START SCRIPT EXECUTION
(function($) {
  //$ local scoped
  const countriesDelivery = new Map();
  const productsList = [];

  //VALIDATION BLOCK

  // //Check if it is a valid string
  const isValidString = str => {
    if (
      str == "" ||
      str == undefined ||
      str.replace(/\s/g, "").length == 0 ||
      typeof str !== "string"
    )
      return false;
    return true;
  };

  //Check if name string is correct
  const validateName = name => {
    const validation = new ValidationResult();
    if (name.length < 5) {
      validation.message = "Name min length is 5 characters.";
    } else if (name.length > 15) {
      validation.message = "Name max length 15 characters.";
    } else if (!isValidString(name)) {
      validation.message = "Not a valid string.";
    } else {
      validation.value = true;
    }
    return validation;
  };

  //Check if email string is correct
  const validateSupplierEmail = supplier => {
    const regex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    const validation = new ValidationResult();
    if (!isValidString(supplier)) {
      validation.message = "Not a valid string.";
    } else if (!regex.test(supplier)) {
      validation.message = "Wrong email format.";
    } else {
      validation.value = true;
    }
    return validation;
  };

  //Check if count string is correct???????????????
  const validateCount = count => {};

  //Check for currency format
  const validateCurrency = string => {};

  //Check if price string is coorect
  const validatePrice = price => {
    const validation = new ValidationResult();
    if (!isValidString(price)) {
      validation.message = "Not a valid string";
    } else if (isNaN(price)) {
      validation.message = "Not a number.";
    } else if (parseFloat(price) < 0) {
      validation.message = "Negative price.";
    } else {
      validation.value = true;
    }
    return validation;
  };

  //Transform valid price to currency format
  const formatPrice = field => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });
    field.val(formatter.format(field.val()));
  };

  //Display validation result and message
  const displayError = (field, validation) => {
    const error = field.next();
    if (validation.value == false) {
      field.css("outlineColor", "red");
      if (error.length !== 0) error.remove();
      $(`<p class="error-message">${validation.message}</p>`).insertAfter(
        field
      );
      return false;
    }
    field.css("outlineColor", "");
    error.remove();
    return true;
  };

  //Validate modal-1
  const validateForm = (name, supplier, count, price) => {
    let validationPassed = false;
    displayError(name, validateName(name.val()));
    displayError(supplier, validateSupplierEmail(supplier.val()));
    // displayError(count, validateCount(count.val()));
    // displayError(price, validateCurrency(price.val()));
    return validationPassed;
  };

  //Load cities list for each country
  (() => {
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
    const $modal1 = $(".custom-modal-1");
    const $modal2 = $(".custom-modal-2");

    //Clean modal-1 $inputs and reset checkboxes
    const cleanModal1 = () => {
      let $inputs = $modal1.find("input");
      let $select = $modal1.find("select");
      $inputs.val("").prop("checked", false);
      $select.val("Russia");
      loadCheckboxes();
    };

    //Load checkboxes for currently selected country
    const loadCheckboxes = () => {
      const $select = $("#deliverySelect");
      const $checkboxGrp = $select.next();
      const country = countriesDelivery.get($select.val());
      $checkboxGrp.find("label:not(:first-child)").remove();
      country.cities.forEach((element, index) => {
        $checkboxGrp.append(`
        <label for="city${index}">
          <input id="city${index}" type="checkbox">
          ${element}
        </label>
        `);
      });
    };

    //load checkboxes for the default country
    loadCheckboxes();

    //Open modal-1 on Add new button click
    $("#addItem").on("click", () => {
      $modal1.show();
    });

    //Hide and reset modal-1 on cancel button click
    $("#cancel").on("click", () => {
      cleanModal1();
      $modal1.hide();
    });

    //Hide and reset modal on grey area click
    $(window).on("click", event => {
      if (
        $(event.target)[0] == $modal1[0] ||
        $(event.target)[0] == $modal2[0]
      ) {
        if ($(event.target)[0] == $modal1[0]) cleanModal1();
        $(event.target).hide();
      }
    });

    $("#productPrice").on("blur", () => {
      const $price = $modal1.find("#productPrice");
      if (!displayError($price, validatePrice($price.val()))) return;
      formatPrice($price);
    });

    //Add or Update product on save changes click
    $("#save").on("click", () => {
      const $name = $modal1.find("#productName");
      const $supplier = $modal1.find("#supplierEmail");
      const $count = $modal1.find("#productCount");
      const $price = $modal1.find("#productPrice");
      const $country = $modal1.find("#deliverySelect");
      if (!validateForm($name, $supplier, $count, $price)) return;
      const product = new Product(
        $name.val(),
        $supplier.val(),
        $count.val(),
        $price.val(),
        countriesDelivery.get($country.val())
      );
      //console.log(productsList.includes(product));
      if (!productsList.includes(product)) productsList.push(product);
      //console.log(productsList);
    });

    //Select all checkbox functionality
    $("#selectAll").on("change", function() {
      const $otherBoxes = $(this)
        .parent()
        .siblings()
        .find("input");
      if ($(this).prop("checked")) {
        $otherBoxes.prop("checked", true);
      } else $otherBoxes.prop("checked", false);
    });

    //Change checkbox group when picked country
    $("#deliverySelect").on("change", loadCheckboxes);
  });
})(jQuery);
