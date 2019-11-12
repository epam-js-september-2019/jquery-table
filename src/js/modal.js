let modalDelete = $(".modal-window--delete"),
  modalEdit = $(".modal-window--edit"),
  modals = $(".modal-window"),
  body = $("body"),
  overlay = $(".overlay"),
  currentItemId = null,
  currentItemName = "",
  newProduct = false;

$(document).click(e => {
  let target = $(e.target);

  switch (true) {
    case target.hasClass("product__buttons-delete"):
      currentItemId = target
        .closest("tr")
        .find(".product__id")
        .html();
      currentItemName = target
        .closest("tr")
        .find(".product__name")
        .html();
      modalDelete
        .find(".modal-window__message span")
        .html(`"${currentItemName}"`);
      showModal(modalDelete);
      break;

    case target.hasClass("modal-window__close") || target.hasClass("overlay"):
      hideModal(modals);
      deliveryToCountriesDefault();
      setTimeout(() => {
        modalEdit.removeClass("active");
        removeReadonly();
      }, 300);
      break;

    case target.hasClass("product__buttons-edit"):
      newProduct = false;
      currentItemId = target
        .closest("tr")
        .find(".product__id")
        .html();
      modalEdit.attr("data-modal", currentItemId);
      putData(currentItemId);
      showModal(modalEdit);
      break;

    case target.hasClass("modal__button-disagree") ||
      target.hasClass("modal__button-cancel"):
      deliveryToCountriesDefault();
      hideModal(modals);
      break;

    case target.hasClass("modal__button-agree"):
      hideModal(modalDelete);
      deleteData(currentItemId, updateData);
      break;

    case target.hasClass("product__name") &&
      !target.closest("tr").hasClass("table-info"):
      newProduct = false;
      currentItemId = target
        .closest("tr")
        .find(".product__id")
        .html();
      putData(currentItemId);
      modalEdit.attr("data-modal", currentItemId);
      modalEdit.addClass("active");
      addReadonly();
      showModal(modalEdit);
      break;

    case target.hasClass("modal__button-save"):
      onSaveChanges(currentItemId, newProduct);
      break;

    case target.hasClass("button-new"):
      modalEditDefault();
      showModal(modalEdit);
      deliveryToCountriesDefault();
      selectAllHandler();
      inputsHandler();
      currentItemId = productsArray.length;
      newProduct = true;
      break;
  }
});

function deleteData(id, callback) {
  let productsArray1 = productsArray.filter(function(item) {
    return item.id != id;
  });
  productsArray = productsArray1;
  setTimeout(() => {
    callback();
  }, 500);
}

function updateData() {
  productsArray.forEach((item, index) => {
    item.id = +index;
  });
  localStorage.setItem("products", JSON.stringify(productsArray));

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(renderItems(productsArray));
    }, 500);
  });
}

function putData(id) {
  productsArray.map(item => {
    if (+item.id === +id) {
      modalEdit.find("h2").html(item["name"]);
      modalEdit.find("#product-name").val(item["name"]);
      modalEdit.find("#product-email").val(item["email"]);
      modalEdit.find("#product-count").val(item["count"]);
      modalEdit.find("#product-price").val("$" + formatPrice(item["price"]));
      modalEdit.find("#select").html("");
      let countries = [];
      const delivery = $(".form-group-delivery").children();
      if (productsArray[id].delivery.length) {
        delivery.removeClass("d-none");
        for (var item in productsArray[id].delivery) {
          let [country] = Object.keys(productsArray[id].delivery[item]);
          countries.push(country);
          let compiled = _.template("<option><%= country %></option>");
          $("#select").append(compiled({ country }));
        }
        setCities(countries[0], id);
      } else {
        delivery.addClass("d-none");
      }
    }
  });
}

function setCities(c, id) {
  let currentCities = [];
  if (!id) {
    deliveryCountries.filter(item => {
      if (item.country == c) {
        currentCities.push(item.city1[0]);
        currentCities.push(item.city2[0]);
        currentCities.push(item.city3[0]);
      }
    });
  } else {
    for (let i = 0; i < productsArray[id].delivery.length; i++) {
      if (productsArray[id].delivery[i].hasOwnProperty(c)) {
        for (let j = 0; j < productsArray[id].delivery[i][c].length; j++) {
          currentCities.push(productsArray[id].delivery[i][c][j]);
        }
      }
    }
  }

  $("#selectAll").prop("checked", false);
  $("#checkboxes-group").html("");
  $.each(currentCities, function(i, item) {
    let row = `<div class="form-check pt-1">
										<input class="form-check-input" type="checkbox" value="${item}" id="city${i +
      1}">
										<label class="form-check-label" for="city${i + 1}">
										${item}
										</label>
							</div>`;
    $(row).appendTo("#checkboxes-group");
  });
}

function onSaveChanges(id, newProduct) {
  let shouldRerender = false,
    changedName = modalEdit.find("#product-name").val(),
    changedEmail = modalEdit.find("#product-email").val(),
    changedCount = +modalEdit.find("#product-count").val(),
    changedPrice = 0;

  if (newProduct) {
    changedPrice = +modalEdit.find("#product-price").val();
  } else {
    changedPrice = modalEdit
      .find("#product-price")
      .val()
      .replace(/,/g, "")
      .split("");
    if (changedPrice[0] === "$") {
      changedPrice = changedPrice.slice(1).join("");
    } else {
      changedPrice = changedPrice.join("");
    }
  }

  filteredArray = {};

  if (!newProduct) {
    [filteredArray] = productsArray.filter(item => +item.id === +id);
    if (filteredArray.name !== changedName) {
      if (nameValidation(changedName)) {
        changeArrayData("name", changedName, false);
        shouldRerender = true;
      } else return false;
    }

    if (filteredArray.email !== changedEmail) {
      if (emailValidation(changedEmail)) {
        changeArrayData("email", changedEmail, false);
        shouldRerender = true;
      } else return false;
    }
    if (filteredArray.count !== changedCount) {
      if (numberValidation(changedCount, "#product-count", "#count-error")) {
        changeArrayData("count", changedCount, true);
        shouldRerender = true;
      } else return false;
    }
    if (filteredArray.price !== +changedPrice) {
      if (numberValidation(+changedPrice, "#product-price", "#price-error")) {
        changeArrayData("price", +changedPrice, true);
        shouldRerender = true;
      } else return false;
    }
  } else {
    filteredArray["id"] = +id;
    filteredArray["name"] = changedName;
    filteredArray["email"] = changedEmail;
    filteredArray["count"] = changedCount;
    filteredArray["price"] = +changedPrice;

    $("#product-count").bind("paste", function(e) {
      e.preventDefault();
    });

    if (validation(filteredArray)) {
      hideModal(modals);
      let array = [];
      for (let i = 0; i < deliveryToCountries.length; i++) {
        let c = Object.values(deliveryToCountries[i])[0];
        if (c.length > 0) {
          array.push(deliveryToCountries[i][c]);
        }
      }
      deliveryToCountries = array;
      filteredArray["delivery"] = deliveryToCountries;
      productsArray.push(filteredArray);
      shouldRerender = true;
    } else {
      shouldRerender = false;
      return false;
    }
  }
  if (shouldRerender) {
    localStorage.setItem("products", JSON.stringify(productsArray));
    hideModal(modals);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(renderItems(productsArray));
      }, 500);
    });
  } else {
    hideModal(modalEdit);
  }

  deleteError("#product-name", "#name-error");
  deleteError("#product-email", "#email-error");

  function changeArrayData(key, value, number) {
    productsArray.map(item => {
      if (+item.id === +id) {
        if (number) {
          item[key] = +value;
        } else {
          item[key] = value;
        }
      }
    });
  }
}

function modalEditDefault() {
  modalEdit.find("h2").html("Product name");
  modalEdit.find("#product-name").val("");
  modalEdit.find("#product-email").val("");
  modalEdit.find("#product-count").val("");
  modalEdit.find("#product-price").val("");
  setDefaultCounties();
}

function showModal(modal) {
  modal.fadeIn();
  overlay.addClass("active");
  body.css("overflow", "hidden");
}

function hideModal(modal) {
  modal.fadeOut();
  overlay.removeClass("active");
  body.css("overflow", "auto");
  modalEdit.attr("data-modal", null);
}

function setDefaultCounties() {
  modalEdit.find("#select").html("");
  const countries = [];
  deliveryCountries.map(item => {
    countries.push(item.country);
  });
  $.each(countries, function(i, item) {
    let compiled = _.template("<option><%= item %></option>");
    $("#select").append(compiled({ item }));
  });
  setCities(countries[0]);
}

function addReadonly() {
  $(".readonly").attr("readonly", true);
}

function removeReadonly() {
  $(".readonly").attr("readonly", false);
}
