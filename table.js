idGenerator=0;
let idProductForDelete=-1;
let idProductForUpdate=-1;

//class of Product
class Product {
	constructor(name, price, count, email, delivery, city) {
		this.id=idGenerator++;
		this.name= name;
		this.price= priceAsUSD(price);
		this.count= count;
		this.email= email;
		this.delivery= delivery;
		this.cities = city;
	}
}

//product generate
var insertRowToTable = function(product) {
	$("#myTable").append("<tr id=product"+product.id+">" +
		"<td>" + "<a href='#' onclick=''>" + product.name + "</a>" + "<div class='count'>" + product.count + "</div></td>" +
		"<td>" + product.price + "</td>" +
		"<td><button type=\"button\" class=\" col-md-5 btn btn-warning btn-sm\" onclick='editProduct("+product.id+")'>Edit</button>\n" +
		"<button type=\"button\" class=\" col-md-5 btn btn-info btn-sm btn-delete\" onclick='openDeletePopup("+product.id+")'>Delete</button></td>" +
		"</tr>");
};

//products
let products = [];
products.push(new Product('Orange', 20.6, 10, 'or@ya.ru', 'Belarus', ["Minsk"]));
products.push(new Product('Banana', 15, 2, 'bn@ya.ru', 'Russia', ["Moscow", "St.Petersburg"]));
products.push(new Product('Apple', 19, 21, 'ap@ya.ru', 'USA', ["California"]));
products.push(new Product('Milk', 66, 4, 'mi@ya.ru', 'Russia', ["Saratov"]));

products.forEach(insertRowToTable);


//add product
var createProduct = function(){
	let name = $('#name-product').val();
	let price = parseFloat($('#price').val().replace(/[^0-9.-]+/g,""));
	let count = parseInt($('#count').val());
	let email = $('#email').val();
	let delivery = $('#delivery').val();
	var checkedArray = [];
	$(".country-city input[type='checkbox']:checked").each(function(index, el) {
		var items = $(el).closest('label').text();
		checkedArray.push(items);
	});
	let cities = checkedArray;

	let product;
	let promise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(product = new Product(name, price, count, email, delivery, cities));
		}, 1000);
	});
	promise.then(() =>{
		products.push(product);
		insertRowToTable(product);
		$('.popup-add input').val('');
	});
	$('.container').css('filter', 'none');
	$('.overlay-add').fadeOut();
};


//delete product
function deleteProduct() {
	let promise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(products=products.filter(product => product.id!==idProductForDelete));
		}, 0);
	});
	promise.then(() =>{products.forEach(insertRowToTable)});

	$('.container').css('filter', 'none');
	$('.overlay-del').fadeOut();
	$('#tableBody').empty();
}


//edit product popup with data
function editProduct(id) {
	openEditPopup();
	let product = products.find(product => product.id===id);
	$('#name-product').val(product.name);
	$('#email').val(product.email);
	$('#count').val(product.count);
	$('#price').val(product.price);
	$('#delivery').val(product.delivery);
	onCountrySelect(product.cities);
	idProductForUpdate=id;
}

//onclick in popup
function createOrEditProduct() {
	if ($('#btn-warning').text()==='Create') {
		createProduct();
	} else {
		updateProduct();
	}
}

//add edit product
function updateProduct() {
	let name = $('#name-product').val();
	let price = parseFloat($('#price').val().replace(/[^0-9.-]+/g,""));
	let count = parseInt($('#count').val());
	let email = $('#email').val();
	let delivery = $('#delivery').val();
	var checkedArray = [];
	$(".country-city input[type='checkbox']:checked").each(function(index, el) {
		var items = $(el).closest('label').text();
		checkedArray.push(items);
	});
	let cities = checkedArray;

	let product;
	let promise = new Promise((resolve) => {
		setTimeout(() => {
			resolve(product = products.find(product => product.id===idProductForUpdate));
		}, 500);
	});
	promise.then(() =>{
		product.name = name;
		product.count = count;
		product.price = priceAsUSD(price);
		product.email = email;
		product.delivery = delivery;
		product.cities = cities;

		$('#tableBody').empty();
		products.forEach(insertRowToTable);
	});

	$('.container').css('filter', 'none');
	$('.overlay-add').fadeOut();
	$('.popup-add input').val('');
}


//Checkboxes
let countriesCities = new Map();
countriesCities.set("Russia", ["Saratov", "Moscow", "St.Petersburg"]);
countriesCities.set("USA", ["Los Angeles", "California", "Texas"]);
countriesCities.set("Belarus", ["Minsk", "Gomel", "Mogilev"]);

for (let key of countriesCities.keys()) {
	let newOption = new Option(key, key);
	$('#delivery').append(newOption);
	onCountrySelect([]);
}

//checkboxes of cities
function onCountrySelect(cities) {
	$(".country-city").empty();
	let s = '<label for="selectAll">' + '<input type="checkbox" id="selectAll"> Select All' + '</label>' +
		'<hr>';
	let countryName = $("#delivery option:selected").text();
	countriesCities.get(countryName).forEach(city => {
		if (cities.includes(city)){
			s +='<label>'+'<input type="checkbox" class="check" checked>'+city+'</label>' + '<br>';
		} else {
			s +='<label>'+'<input type="checkbox" class="check">'+city+'</label>' + '<br>';
		}
	});
	$(".country-city").append(s);

	//popup-add cities checkbox
	$('#selectAll').click(function () {
		$(".check").prop('checked', $(this).prop('checked'));
	});
}

//sort by name
function sortName() {
	let tbody = $('#tableBody');
	tbody.find('tr').sort(function (a, b) {
		let x = $('td:first', a).text();
		let y = $('td:first', b).text();
		if ($('#name_order').val() == 'asc') {
			return x.localeCompare(y);
		} else {
			return y.localeCompare(x);
		}
	}).appendTo(tbody);
	let sort_order = $('#name_order').val();
	$('#trianglePrice').toggleClass('trianglePrice_down trianglePrice_top', false);
	$('#trianglePrice').addClass('trianglePrice_none');
	if (sort_order == "asc") {
		document.getElementById("name_order").value = "desc";
		$('#triangleName').toggleClass('triangleName_top triangleName_none', false);
		$('#triangleName').addClass('triangleName_down');
	}
	if (sort_order == "desc") {
		document.getElementById("name_order").value = "asc";
		$('#triangleName').toggleClass('triangleName_down triangleName_none', false);
		$('#triangleName').addClass('triangleName_top');
	}
}

//sort by price
function sortPrice() {
	let tbody = $('#tableBody');
	tbody.find('tr').sort(function (a, b) {
		let x = parseInt($('td:nth-child(2)', a).text().replace(/[^+\d]/g, ''));
		let y = parseInt($('td:nth-child(2)', b).text().replace(/[^+\d]/g, ''));
		if ($('#price_order').val() == 'asc') {
			return x - y;
		} else {
			return y - x;
		}
	}).appendTo(tbody);
	let sort_order = $('#price_order').val();
	$('#triangleName').toggleClass('triangleName_down triangleName_top', false);
	$('#triangleName').addClass('triangleName_none');
	if (sort_order == "asc") {
		document.getElementById("price_order").value = "desc";
		$('#trianglePrice').toggleClass('trianglePrice_top trianglePrice_none', false);
		$('#trianglePrice').addClass('trianglePrice_down');
	}
	if (sort_order == "desc") {
		document.getElementById("price_order").value = "asc";
		$('#trianglePrice').toggleClass('trianglePrice_down trianglePrice_none', false);
		$('#trianglePrice').addClass('trianglePrice_top');
	}
}

//search events
$('#searchBtn').click(function () {
	$.each($("tbody tr"), function () {
		if ($(this).text().toLowerCase().indexOf($('.form-control').val().toLowerCase()) === -1) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});
});
$('.form-control').keypress(function (event) {
	if (event.which === 13) {
		$.each($("tbody tr"), function () {
			if ($(this).text().toLowerCase().indexOf($('.form-control').val().toLowerCase()) === -1) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	}
});


//open button delete
function openDeletePopup(id) {
	let product = products.find(product => product.id===id);
	idProductForDelete=product.id;
	$('.container').css('filter', 'blur(5px)');
	$('.overlay-del').fadeIn();
	$('.popup-del-text').text('Are you sure you want to delete  ' + product.name + '?');
}

//close button delete
$('.btn-delete-no').click(function () {
	$('.container').css('filter', 'none');
	$('.overlay-del').fadeOut();
});

//open button add
$('.btn-add').click(function () {
	$('.container').css('filter', 'blur(5px)');
	$('.overlay-add').fadeIn();
	$('.btn-change').text('Create');
	onCountrySelect([]);
});

//close button add
$('.cancel').click(function () {
	$('.container').css('filter', 'none');
	$('.overlay-add').fadeOut();
	$('.popup-add input').val('');
});

//open edit popup
function openEditPopup() {
	$('.container').css('filter', 'blur(5px)');
	$('.overlay-add').fadeIn();
	$('.btn-change').text('Edit')
}

//price formats
function priceAsUSD (price) {
	let form = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD",
		minimumFractionDigits: 2});
	return form.format(price);
}

function formPrice() {
	let price = priceAsUSD($('#price').val());
	$('#price').val(price);
}

function changePriceToNumber() {
	let price = Number($('#price').val().replace(/[^0-9.-]+/g,""));
	$('#price').val(price);
}
