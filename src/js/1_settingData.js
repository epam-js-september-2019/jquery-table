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
