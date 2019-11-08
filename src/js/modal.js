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
      modalDelete.fadeIn();
      overlay.addClass("active");
      body.css("overflow", "hidden");
      break;

    case target.hasClass("modal-window__close") || target.hasClass("overlay"):
      modals.fadeOut();
      overlay.removeClass("active");
      body.css("overflow", "auto");
      currentItemId = null;
      break;

    case target.hasClass("product__buttons-edit"):
      newProduct = false;
      currentItemId = target
        .closest("tr")
        .find(".product__id")
        .html();
      putData(currentItemId);
      modalEdit.fadeIn();
      overlay.addClass("active");
      body.css("overflow", "hidden");
      break;

    case target.hasClass("modal__button-disagree") ||
      target.hasClass("modal__button-cancel"):
      modals.fadeOut();
      overlay.removeClass("active");
      body.css("overflow", "auto");
      currentItemId = null;
      break;

    case target.hasClass("modal__button-agree"):
      modalDelete.fadeOut();
      overlay.removeClass("active");
      body.css("overflow", "auto");
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
      modalEdit.fadeIn();
      overlay.addClass("active");
      body.css("overflow", "hidden");
      break;

    case target.hasClass("modal__button-save"):
      onSaveChanges(currentItemId, newProduct);
      modals.fadeOut();
      overlay.removeClass("active");
      body.css("overflow", "auto");
      currentItemId = null;
      break;

    case target.hasClass("button-new"):
      modalEditDefault();
      modalEdit.fadeIn();
      overlay.addClass("active");
      body.css("overflow", "hidden");
      currentItemId = productsArray.length;
      newProduct = true;
      break;
  }
});

function deleteData(id, callback) {
  productsArray.splice(id, 1);
  setTimeout(() => {
    callback();
  }, 500);
}

function updateData() {
  productsArray.forEach((item, index) => {
    item.id = +index;
  });
  localStorage.setItem("products", JSON.stringify(productsArray));
  renderItems(productsArray);
}

function putData(id) {
  productsArray.map(item => {
    if (+item.id === +id) {
      modalEdit.find("h2").html(item["name"]);
      modalEdit.find("#product-name").val(item["name"]);
      modalEdit.find("#email").val(item["email"]);
      modalEdit.find("#count").val(item["count"]);
      modalEdit.find("#product-price").val("$" + item["price"]);
      modalEdit.find("#select").html("");
      let countries = [];

      for (var item in productsArray[id].delivery) {
        let [country] = Object.keys(productsArray[id].delivery[item]);
        countries.push(country);
        let compiled = _.template("<option><%= country %></option>");
        $("#select").append(compiled({ country }));
      }
      setCities(countries[0]);
    }
  });
}

function setCities(c) {
  let [filteredArray] = deliveryCountries.filter(
    item => Object.keys(item) == c
  );
  let [currentCities] = Object.values(filteredArray);
  $("#checkboxes-group").html("");
  $.each(currentCities, function(i, item) {
    let row = `<div class="form-check pt-1">
										<input class="form-check-input" type="checkbox" value="" id="city${i + 1}">
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
    changedEmail = modalEdit.find("#email").val(),
    changedCount = +modalEdit.find("#count").val(),
    changedPrice = +modalEdit
      .find("#product-price")
      .val()
      .split("")
      .slice(1)
      .join("");
  filteredArray = {};

  if (!newProduct) {
    [filteredArray] = productsArray.filter(item => +item.id === +id);
  } else {
    filteredArray["id"] = id;
    filteredArray["name"] = changedName;
    filteredArray["email"] = changedEmail;
    filteredArray["count"] = changedCount;
    filteredArray["price"] = changedPrice;
    productsArray.push(filteredArray);
  }

  if (filteredArray.name !== name) {
    changeArrayData("name", changedName, false);
    shouldRerender = true;
  }
  if (filteredArray.email !== changedEmail) {
    changeArrayData("email", changedEmail, false);
    shouldRerender = true;
  }
  if (filteredArray.count !== changedCount) {
    changeArrayData("count", changedCount, true);
    shouldRerender = true;
  }
  if (filteredArray.price !== changedPrice) {
    changeArrayData("price", changedPrice, true);
    shouldRerender = true;
  }

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

  if (shouldRerender) {
    renderItems(productsArray);
    localStorage.setItem("products", JSON.stringify(productsArray));
  } else false;
}

function modalEditDefault() {
  modalEdit.find("h2").html("Product name");
  modalEdit.find("#product-name").val("");
  modalEdit.find("#email").val("");
  modalEdit.find("#count").val("");
  modalEdit.find("#product-price").val("");
}
