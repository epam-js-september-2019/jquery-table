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
