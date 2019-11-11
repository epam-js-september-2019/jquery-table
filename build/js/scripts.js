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
										<span class="mr-1">${formatPrice(count)}</span>
									</td>
									<td class="product__price">&#36;${formatPrice(price)}</td>
										${buttons}
				 					</tr>`;
    $(row).appendTo(container);
  });
}

const deliveryCountries = [
  {
    country: "Russia",
    city1: ["Saratov", "unchecked"],
    city2: ["Moscow", "unchecked"],
    city3: ["St. Petersburg", "unchecked"]
  },
  {
    country: "Belarus",
    city1: ["Minsk", "unchecked"],
    city2: ["Brest", "unchecked"],
    city3: ["Vitebsk", "unchecked"]
  },
  {
    country: "USA",
    city1: ["New York", "unchecked"],
    city2: ["Washington", "unchecked"],
    city3: ["Chicago", "unchecked"]
  }
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
    target.removeClass("up");
    target.addClass("down");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(renderItems(array));
      }, 300);
    });
  } else if (way === "up") {
    target.removeClass("down");
    target.addClass("up");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(renderItems(sorteredProducts));
      }, 300);
    });
  }
}

function formatPrice(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
 };

function priceHandler(){
  $("#product-price").blur(function() {
    if(numberValidation(+$("#product-price" ).val(), "#product-price", "#price-error")) {
      $("#product-price" ).val("$" + formatPrice(+$("#product-price" ).val()))
      return +$("#product-price" );
    } else {
      $("#product-price" ).val()
    }
  });
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
      selectAllHandler();
      deliveryToCountriesDefault();
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

      for (var item in productsArray[id].delivery) {
        let [country] = Object.keys(productsArray[id].delivery[item]);
        countries.push(country);
        let compiled = _.template("<option><%= country %></option>");
        $("#select").append(compiled({ country }));
      }
      setCities(countries[0], id);
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
      .split("")
      .slice(1)
      .join("");
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

    $("#product-count").bind("paste", function(e) {
      e.preventDefault();
    });

    if (validation(filteredArray)) {
      hideModal(modals);

      for (let i = 0; i < deliveryToCountries.length; i++) {
        if (Object.values(deliveryToCountries[i])[0].length < 1) {
          deliveryToCountries.splice(i, 1);
        }
      }

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
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(renderItems(productsArray));
        }, 500);
      });
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
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(renderItems(productsArray));
      }, 500);
    });
  } else {
    const result = productsArray.filter(
      item => item.name.toLowerCase() === value.toLowerCase()
    );
    if (result.length) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(renderItems(result));
        }, 500);
      });
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

let deliveryToCountries = [];

const deliveryToCountriesDefault = () => {
  deliveryToCountries = [{ Russia: [] }, { Belarus: [] }, { USA: [] }];
};

deliveryToCountriesDefault();

const selectHandler = () => {
  $("#select").change(e => {
    let target = $(e.target),
      value = target.val(),
      id = modalEdit.attr("data-modal");
    setCities(value, id);
    inputsHandler();
  });
};

const inputsHandler = () => {
  $("#checkboxes-group input").change(function(e) {
    let countryName = $("#select option:selected").html();
    for (let i = 0; i < deliveryToCountries.length; i++) {
      if (deliveryToCountries[i].hasOwnProperty(countryName)) {
        deliveryToCountries[i][countryName].push($(e.target).val());
      }
    }
    if (
      $("#checkboxes-group input:checked").length ===
      $("#checkboxes-group input").length
    ) {
      $("#selectAll").prop("checked", true);
    } else {
      $("#selectAll").prop("checked", false);
    }
  });
};

selectHandler();

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

function validation(array) {
  return nameValidation(array.name) &&
    emailValidation(array.email) &&
    numberValidation(array.count, "#product-count", "#count-error") &&
    numberValidation(array.price, "#product-price", "#price-error")
    ? setFormatedPrice(array.price)
    : false;
}

function nameValidation(name) {
  if (/^\s+$/.test(name) || name.length === 0) {
    generateError("#product-name", "#name-error", "Name can not be empty");
    return false;
  } else if (name.trim().length > 0 && name.trim().length < 5) {
    generateError("#product-name", "#name-error", "Enter min 5 characters");
    return false;
  } else if (name.trim().length > 15) {
    generateError("#product-name", "#name-error", "Enter max 15 characters");
    return false;
  } else {
    deleteError("#product-name", "#name-error");
    return true;
  }
}

function emailValidation(email) {
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

function numberValidation(count, field, fieldError) {
  if (typeof count !== "number" || count < 0 || count === 0 || isNaN(count)) {
    generateError(field, fieldError, "Enter positive number");
    return false;
  } else {
    deleteError(field, fieldError);
    return true;
  }
}

function generateError(field, fieldError, message) {
  modalEdit.find(field).addClass("error");
  modalEdit
    .find(fieldError)
    .removeClass("d-none")
    .html(message);
  modalEdit
    .find(field)
    .val("")
    .focus();
}

function deleteError(field, fieldError) {
  modalEdit.find(field).removeClass("error");
  modalEdit
    .find(fieldError)
    .addClass("d-none")
    .html("");
}

function setFormatedPrice(price) {
  $("#product-price").val("$" + formatPrice(price));
  return true;
}
