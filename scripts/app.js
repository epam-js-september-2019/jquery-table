"use strict";

class Country {
  constructor(name, cities = []) {
    this.name = name;
    this.cities = cities;
  }
}

class Product {
  constructor(name, supplier, count, price, country) {
    this.name = name;
    this.supplier = supplier;
    this.count = count;
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
  //$ is local scoped
  const countriesDelivery = new Map();
  const productsList = [];
  const errorsList = [];

  //Load cities list for each country and errors list
  (() => {
    countriesDelivery.set("Russia", ["Saratov", "Moskow", "St.Petersburg"]);
    countriesDelivery.set("USA", ["Los Angeles", "California", "Texas"]);
    countriesDelivery.set("Belorus", ["Minsk", "Gomel", "Mozyr"]);
    errorsList.push("Not a valid string.");
    errorsList.push("Name min length is 5 characters.");
    errorsList.push("Name max length 15 characters.");
    errorsList.push("Wrong email format.");
    errorsList.push("Wrong currency format");
  })();

  //UTILITIES BLOCK

  //Find product index by name
  const findWithAttr = (arr, attr, value) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][attr] === value) {
        return i;
      }
    }
    return -1;
  };

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
      validation.message = errorsList[1];
    } else if (name.length > 15) {
      validation.message = errorsList[2];
    } else if (!isValidString(name)) {
      validation.message = errorsList[0];
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
      validation.message = errorsList[0];
    } else if (!regex.test(supplier)) {
      validation.message = errorsList[3];
    } else {
      validation.value = true;
    }
    return validation;
  };

  //Check for currency format
  const validateCurrency = string => {
    const validation = new ValidationResult();
    if (!/^\$?(([1-9]\d{0,2}(,\d{3})*)|0)?\.\d{1,2}$/.test(string)) {
      validation.message = errorsList[4];
    } else {
      validation.value = true;
    }
    return validation;
  };

  //Display validation result and message
  const displayError = (field, validation) => {
    const error = field.parent().find("p");
    if (validation.value == false) {
      if (error.length == 0) {
        field.css("outlineColor", "red").css("border", "1px solid red");
        field
          .parent()
          .append(`<p class="error-message">${validation.message}</p>`);
      } else if (error[0].innerText != validation.message) {
        error.remove();
        field
          .parent()
          .append(`<p class="error-message">${validation.message}</p>`);
      }
      return false;
    }
    error.remove();
    field.css("outlineColor", "").css("border", "");
    return true;
  };

  //Validate modal-1
  const validateForm = obj => {
    let val1 = displayError(obj.name, validateName(obj.name.val()));
    let val2 = displayError(
      obj.supplier,
      validateSupplierEmail(obj.supplier.val())
    );
    let val3 = displayError(
      obj.count,
      new ValidationResult(isValidString(obj.count.val()), errorsList[0])
    );
    let val4 = displayError(obj.price, validateCurrency(obj.price.val()));
    for (let element in obj) {
      if (obj[element].parent().find("p").length !== 0) {
        obj[element].focus();
        break;
      }
    }
    return val1 && val2 && val3 && val4;
  };

  //Dom is ready
  $(function() {
    const $modal1 = $(".custom-modal-1");
    const $modal2 = $(".custom-modal-2");
    const $name = $modal1.find("#productName");
    const $supplier = $modal1.find("#supplierEmail");
    const $count = $modal1.find("#productCount");
    const $price = $modal1.find("#productPrice");
    const $country = $modal1.find("#deliverySelect");
    let price = 0;

    //Transform valid price to currency format
    const formatPrice = price => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      });
      let formatedPrice = formatter.format(price);
      $price.val(formatedPrice);
      return formatedPrice;
    };

    //Re render table
    const renderTable = arr => {
      const $tBody = $(".table-responsive tbody");
      $tBody.find("tr").remove();
      arr.forEach(element => {
        $tBody.append(
          `
       <tr>
          <td class="align-middle">
            <div class="d-flex justify-content-between">
                <span>${element.name}</span>
                <span>${element.count}</span>
            </div>
          </td>
          <td class="align-middle">${formatPrice(element.price)}</td>
          <td class="text-center">
              <button class="edit btn btn-secondary px-4">Edit</button>
              <button class="delete btn btn-secondary ml-3">Delete</button>
          </td>
      </tr>
       `
        );
      });
      //${formatPrice(element.price)}
      //Add listeners on all delete buttons and open modal-2
      $tBody.find(".delete").on("click", function() {
        let productName = $(this)
          .parent()
          .parent()
          .find(".d-flex span:first-child")[0].innerText;
        $modal2.find(
          ".custom-modal-2__text"
        )[0].innerText = `Are you sure you want to delete /${productName}/?`;
        $modal2.show();
      });

      //Add listeners on all edit buttons and open modal-1
      $tBody.find(".edit").on("click", function() {
        let productName = $(this)
          .parent()
          .parent()
          .find(".d-flex span:first-child")[0].innerText;
        $modal1.show();
        const productObj =
          productsList[findWithAttr(productsList, "name", productName)];
        $name.val(productObj.name);
        $supplier.val(productObj.supplier);
        $count.val(productObj.count);
        $price.val(productObj.price);
        $country.val(productObj.country.name);
        loadCheckboxes();
        productObj.country.cities.forEach(element => {
          $(`label:contains(${element.name})`)
            .find("input")
            .prop("checked", element.value);
        });
      });
    };

    renderTable(productsList);

    //Delete item by name on YES click
    $("#yes").on("click", () => {
      const pText = $modal2.find(".custom-modal-2__text")[0].innerText;
      let productName = pText.substring(
        pText.indexOf("/") + 1,
        pText.lastIndexOf("/")
      );
      let productIndex = findWithAttr(productsList, "name", productName);
      productsList.splice(productIndex, 1);
      $modal2.hide();
      renderTable(productsList);
    });

    //Close modal-2 on NO click
    $("#no").on("click", () => {
      $modal2.hide();
    });

    //Clean modal-1 $inputs and reset checkboxes
    const cleanModal1 = () => {
      let $inputs = $modal1.find("input");
      $inputs
        .val("")
        .prop("checked", false)
        .css("outlineColor", "")
        .css("border", "")
        .parent()
        .find("p")
        .remove();
      $country.val("Russia");
      loadCheckboxes();
    };

    //Load checkboxes for currently selected country
    const loadCheckboxes = () => {
      const $checkboxGrp = $country.next();
      const country = countriesDelivery.get($country.val());
      $checkboxGrp.find("label:not(:first-child)").remove();
      country.forEach((element, index) => {
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
      price = $price.val();
     // console.log("price:" + price);
      formatPrice(price);
    });

    //Add or Update product on save changes click
    $("#save").on("click", () => {
      const delivery = new Country($country.val());
      const $cities = $country.next().find("label:not(:first-child)");
      $.each($cities, (index, value) => {
        delivery.cities.push({
          name: value.innerText,
          value: $(value)
            .find("input")
            .prop("checked")
        });
      });
      if (
        !validateForm({
          name: $name,
          supplier: $supplier,
          count: $count,
          price: $price
        })
      )
        return;
      const product = new Product(
        $name.val(),
        $supplier.val(),
        $count.val(),
        +price,
        delivery
      );

      let isInArr = findWithAttr(productsList, "name", $name.val());
      if (isInArr >= 0) {
        productsList[isInArr] = product;
      } else {
        productsList.push(product);
      }
      renderTable(
        productsList.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        )
      );
      $modal1.hide();
      cleanModal1();
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

    //Prevent input in count field for non-numeric values
    $("#productCount").on(
      "input keydown keyup mousedown mouseup select contextmenu drop",
      function(e) {
        if (/^\d*$/.test(this.value)) {
          this.oldValue = this.value;
        } else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
        }
      }
    );

    //Filter table
    function filterTable() {
      if ($("#searchBox").val() == "") {
        renderTable(productsList);
      } else {
        renderTable(
          productsList.filter(element =>
            element.name.toLowerCase().includes(
              $("#searchBox")
                .val()
                .toLowerCase()
            )
          )
        );
      }
    }

    //filter table on search button click
    $("#search").on("click", filterTable);

    //Filter table on enter keypress
    $("#searchBox").on("keypress", function(e) {
      if (e.which == 13) {
        filterTable();
      }
    });

    //Sort table by price REDOOOOO
    $("#priceCol").click(function() {
      let clicks = $(this).data("price-clicks");
      if (clicks) {
        filterTable(
          productsList.sort((a, b) =>
            a.price - b.price
          )
        );
      } else {
        filterTable(
          productsList.sort((a, b) =>
           b.price - a.price
          )
        );
      }
      $(this).data("price-clicks", !clicks);
    });

    //Sort table by name DO MORE
    $("#nameCol").on("click", function() {
      let clicks = $(this).data("name-clicks");
      let icon = $(this)
        .find("span")
        .last();
      icon.find("i").remove();
      if (clicks) {
        filterTable(
          productsList.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );
        icon.append(`<i class="fas fa-caret-up"></i>`);
      } else {
        filterTable(
          productsList.sort((a, b) =>
            a.name < b.name ? 1 : b.name < a.name ? -1 : 0
          )
        );
        icon.append(`<i class="fas fa-caret-down"></i>`);
      }
      $(this).data("name-clicks", !clicks);
    });
  });
})(jQuery);
