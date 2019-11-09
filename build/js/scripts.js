const buttons = `<td class="product__buttons text-center">
										<button type="button" class="product__buttons-edit btn 		btn-outline-info mr-4">Edit</button>
										<button type="button" class="product__buttons-delete btn btn-outline-danger">Delete</button>
								</td>`;
let productsArray = [];

const checkLocalStorage = type => {
  const field = localStorage.getItem(type);
  return !field || !JSON.parse(field).length;
};

const getData = async () => {
  const response = await fetch("https://api.myjson.com/bins/rmwas")
    .then(response => response.json())
    .then(data => {
      setTimeout(() => {
        localStorage.setItem("products", JSON.stringify(data.products));
        productsArray = data.products;
        renderItems(productsArray);
      }, 1000);
    })
    .catch(error => console.error(error));
};

if (checkLocalStorage("products")) {
  getData();
} else {
  setTimeout(() => {
    productsArray = JSON.parse(localStorage.getItem("products"));
    renderItems(productsArray);
  }, 500);
}

function renderItems(data) {
  let container = "#products tbody";
  $(container).html("");
  $.each(data, function(i, item) {
    const { id, name, count, price } = item;
    let row = `<tr>
									<td class="product__id d-none">${id}</td>
									<td class="product__name" colspan="2">${name}</td>
									<td class="product__count text-right">
										<span class="mr-1">${count}</span>
									</td>
									<td class="product__price">&#36;${price}</td>
										${buttons}
				 					</tr>`;
    $(row).appendTo(container);
  });
}

const deliveryCountries = [
  { Russia: ['Saratov', 'Moscow', 'St. Petersburg'] },
  { Belarus: ['Minsk', 'Brest', 'Vitebsk'] },
  { USA: ['New York', 'Washington', 'Chicago'] }
];
let flagName = 0,
  flagPrice = 0,
  sorteredProducts = [];

const filters = {
  sortByNameDesc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });
    sorted("down", target, sorteredProducts);
  },
  sortByNameAsc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      return b.name.localeCompare(a.name);
    });
    sorted("up", target, sorteredProducts);
  },
  sortByValueDesc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      let x = a.price;
      let y = b.price;
      return x > y ? -1 : x < y ? 1 : 0;
    });
    sorted("down", target, sorteredProducts);
  },
  sortByValueAsc: function(target) {
    sorteredProducts = productsArray.sort(function(a, b) {
      let x = a.price;
      let y = b.price;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    sorted("up", target, sorteredProducts);
  }
};

const filterHandler = () => {
  $(document).click(e => {
    let target = $(e.target);

    switch (true) {
      case target.attr("data-sort") == "name":
        flagPrice = 0;
        clearParam();
        if (flagName === 1 || flagName === 0) {
          flagName = 2;
          filters.sortByNameDesc(target);
        } else if (flagName === 2) {
          flagName = 1;
          filters.sortByNameAsc(target);
        }
        break;

      case target.attr("data-sort") == "price":
        flagName = 0;
        clearParam();
        if (flagPrice === 1 || flagPrice === 0) {
          flagPrice = 2;
          filters.sortByValueDesc(target);
        } else if (flagPrice === 2) {
          flagPrice = 1;
          filters.sortByValueAsc(target);
        }
        break;
    }
  });
};
filterHandler();

function clearParam() {
  $(".table-info th").removeClass("down");
  $(".table-info th").removeClass("up");
}

function sorted(way, target, array) {
  if (way === "down") {
    renderItems(array);
    target.removeClass("up");
    target.addClass("down");
  } else if (way === "up") {
    renderItems(sorteredProducts);
    target.removeClass("down");
    target.addClass("up");
  }
}

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
      currentItemId = null;
      break;

    case target.hasClass("product__buttons-edit"):
      newProduct = false;
      currentItemId = target
        .closest("tr")
        .find(".product__id")
        .html();
      putData(currentItemId);
      showModal(modalEdit);
      break;

    case target.hasClass("modal__button-disagree") ||
      target.hasClass("modal__button-cancel"):
      hideModal(modals);
      currentItemId = null;
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
      showModal(modalEdit);
      break;

    case target.hasClass("modal__button-save"):
      onSaveChanges(currentItemId, newProduct);
      currentItemId = null;
      break;

    case target.hasClass("button-new"):
      modalEditDefault();
      showModal(modalEdit);
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
      modalEdit.find("#product-email").val(item["email"]);
      modalEdit.find("#product-count").val(item["count"]);
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
    changedEmail = modalEdit.find("#product-email").val(),
    changedCount = +modalEdit.find("#product-count").val(),
    changedPrice = 0;

    if(newProduct){
      changedPrice = +modalEdit.find("#product-price").val()
    } else {
      changedPrice = modalEdit
      .find("#product-price")
      .val()
      .split("")
      .slice(1).join("");
    }

  filteredArray = {};

  if (!newProduct) {
    [filteredArray] = productsArray.filter(item => +item.id === +id);
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
    if (filteredArray.price !== +changedPrice) {
      changeArrayData("price", changedPrice, true);
      shouldRerender = true;
    }
  } else {
    filteredArray["id"] = +id;
    filteredArray["name"] = changedName;
    filteredArray["email"] = changedEmail;
    filteredArray["count"] = changedCount;
    filteredArray["price"] = +changedPrice;

    $('#product-count').bind("paste",function(e) {
      e.preventDefault();
    });

    if(validation(filteredArray)) {
      hideModal(modals);
      productsArray.push(filteredArray);
      shouldRerender = true;
    } else {
      shouldRerender = false;
      return false;
    }
  }

  if (shouldRerender) {
    renderItems(productsArray);
    localStorage.setItem("products", JSON.stringify(productsArray));
    hideModal(modals);
  } else false;

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

function showModal(modal){
  modal.fadeIn();
  overlay.addClass("active");
  body.css("overflow", "hidden");
}

function hideModal(modal){
  modal.fadeOut();
  overlay.removeClass("active");
  body.css("overflow", "auto");
}

function setDefaultCounties(){
  modalEdit.find("#select").html("");
  const countries = [];
  deliveryCountries.map((item) => {
      const [country] = Object.keys(item);
      countries.push(country);
  });
  $.each(countries, function(i, item) {
    let compiled = _.template("<option><%= item %></option>");
    $("#select").append(compiled({ item }));
  });
  setCities(countries[0]);
}

const searchHandler = () => {
  $(document).click(e => {
    let target = $(e.target);

    if (target.hasClass("button-search")) {
      search();
    }
  });

  $(document).keypress(function(e) {
    if (e.which == 13) {
      search();
    }
  });

  $("#search").change(e => {
    if (!$(e.target).val()) {
      renderItems(productsArray);
    }
  });
};

searchHandler();

function search() {
  let value = $("#search").val(),
    modalWarning = $(".modal-window--warning"),
    overlay = $(".overlay");

  if (!value) {
    showModalWarning(modalWarning, overlay, "Please enter product name");
    renderItems(productsArray);
  } else {
    const result = productsArray.filter(
      item => item.name.toLowerCase() === value.toLowerCase()
    );
    if (result.length) {
      renderItems(result);
    } else {
      showModalWarning(
        modalWarning,
        overlay,
        "Product '" + value + "' is not found"
      );
      $("#search").val("");
    }
  }
}

function showModalWarning(modalWarning, overlay, message) {
  modalWarning.find("p").html(message);
  modalWarning.fadeIn();
  overlay.addClass("active");
}

const selectHandler = () => {
  $("#select").change(e => {
    let target = $(e.target),
      value = target.val();
    setCities(value);
  });
};

selectHandler();

function validation(array){
  // nameValidation(array.name) ?
  //   emailValidation(array.email) ? numberValidation(array.count, "#product-count", "#count-error") ?
  //   numberValidation(array.price, "#product-price", "#price-error") ? true : false;
  if(nameValidation(array.name)){
    if(emailValidation(array.email)){
      if(numberValidation(array.count, "#product-count", "#count-error")){
        if(numberValidation(array.price, "#product-price", "#price-error")){
          return true;
        } else return false;
      } else return false;
    } else return false;
  } else return false;
}

function nameValidation(name){
  if(/^\s+$/.test(name) || name.length === 0){
    generateError("#product-name", "#name-error", "Name can not be empty");
    return false;

  } else if(name.trim().length > 0 && name.trim().length < 5){
    generateError("#product-name", "#name-error", "Enter min 5 characters");
    return false;

  } else if(name.trim().length > 15){
    generateError("#product-name", "#name-error", "Enter max 15 characters");
    return false;

  } else {
    deleteError("#product-name", "#name-error");
    return true;
  }
}

function emailValidation(email){
  const pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  if (email.length === 0) {
    generateError("#product-email", "#email-error", "Please enter email");
    return false;

  } else if (pattern.test(email)) {
    deleteError("#product-email", "#email-error");
    return true;

  } else {
    generateError("#product-email", "#email-error", "Please enter email");
    return false;
  }
}

function numberValidation(count, field, fieldError){
  if(typeof count !== "number" || count < 0 || count === 0 || isNaN(count)){
    generateError(field, fieldError, "Enter positive number");
    return false;

  } else {
    deleteError(field, fieldError);
    return true;
  }
}

function generateError(field, fieldError, message){
  modalEdit.find(field).addClass("error");
  modalEdit.find(fieldError).removeClass("d-none").html(message);
  modalEdit.find(field).val("").focus();
}

function deleteError(field, fieldError){
  modalEdit.find(field).removeClass("error");
  modalEdit.find(fieldError).addClass("d-none").html("");
}
