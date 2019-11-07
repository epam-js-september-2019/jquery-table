let modalDelete = $(".modal-window--delete"),
  modalEdit = $(".modal-window--edit"),
  modals = $(".modal-window"),
  body = $("body"),
  overlay = $(".overlay"),
  currentItemId = null,
  currentItemName = "";

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
      onSaveChanges(currentItemId);
      break;
  }
});

function deleteItem() {}

function deleteData(id, callback) {
  productsArray.splice(id, 1);
  setTimeout(() => {
    callback();
  }, 500);
}

function updateData() {
  productsArray.forEach((item, index) => {
    item.id = index;
  });
  localStorage.setItem("products", JSON.stringify(productsArray));
  renderItems(productsArray);
}

function putData(id) {
  modalEdit.find("h2").html(productsArray[id].name);
  modalEdit.find("#product-name").val(productsArray[id].name);
  modalEdit.find("#email").val(productsArray[id].email);
  modalEdit.find("#count").val(productsArray[id].count);
  modalEdit.find("#product-price").val("$" + productsArray[id].price);
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

function onSaveChanges(id) {
  let shouldRerender = false;
  const [filteredArray] = productsArray.filter(item => item.id === id);
  let changedName = modalEdit.find("#product-name").val();
  let changedEmail = modalEdit.find("#email").val();
  let changedCount = modalEdit.find("#count").val();
  let changedPrice = modalEdit.find("#product-price").val();
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
      if (item.id === id) {
        if (number) {
          item[key] = +value;
        } else {
          item[key] = value;
        }
      }
    });
  }

  return shouldRerender ? renderItems(productsArray) : false;
}
