//TODO
// валидация принимает на вход объект и идет по ключам
// удалить все логи
// переход к следующему полю по enter
// прописать id для label
// deliveryInfo сделать json
// все jsx сделать отдельными функциями с входными параметрами, которые потом подставятся

// import { table } from "./table.js";

$(document).ready(function(){
	'use strict';

	// ($("#form-add").validate({
	// 		rules: {
	// 			name: {
	// 				required: true,
	// 				maxlength: 15,
	// 			}
	// 		},
	// 		messages: {
	// 			name: {
	// 				required: true,
	// 				maxlength: 15,
	// 			}
	// 		}
	// 		}))

	const ENTER_KEY = 13;

	const deliveryInfo = new Map([
		[
			"Russia",
			["Moscow", "St. Petersburg", "Saratov", "Samara"]
		],
		[
			"Belarus",
			["Minsk", "Grodno", "Gomilev"]
		],
		[
			"USA",
			["New-York", "Chicago", "Siettle"]
		]
		]);


	class List{
		constructor(){
			this.productList = new Map;
			this._idCounter = 0;
			// this.deliveryInfo = deliveryInfo;

			this.productList.set(
				this._idCounter++,
				{
				name: "Pencil",
				email: "uss@gmail.com",
				count: 7,
				price: 5432.6533
				});
			this.productList.set(
				this._idCounter++,
				{
				name: "Pen",
				email: "abcfs12@gmail.com",
				count: 443,
				price: 7434322.654
			})
			this.render();
		}

		addProduct(el){
			this.productList.set(
				this._idCounter++,
				el);
			return new Promise((resolve, reject) => {
				setTimeout(() => resolve(this), 2000);
			})
		}

		deleteProduct(id){
			this.productList.delete(parseInt(id, 10));
		}

		getProduct(id){
			return this.productList.get(id);
		}

		getList(){ 
			return new Map(this.productList);
		};

		search(val){
			val = val.toLowerCase();
			let res = Array.from(this.productList).filter(el => el[1].name.toLowerCase().includes(val));
			return new Map(res);
		}

		render(list = this.productList){
			const parsePrice = function(num) {
				return parseFloat(parseFloat(num).toFixed(2)).toLocaleString('en-US');
			}
			$(".product-list tbody").html("");
			list.forEach((value, key, map) => {
				$(".product-list tbody").append(`
					<tr listId=${key}>
						<td class="name align-middle" data-col-name="name">
							<a class="name__info" href="">
								${value.name}
							</a>
							<span class="name__count px-2 py-1">
								${value.count}
							</span>
						</td>
						<td class="price align-middle" data-col-name="price">
							<div class="price__info">
								$${parsePrice(value.price)}
							</div>
						</td>
						<td class="align-middle" data-col-name="actions">
							<div class="row justify-content-around">
								<div class="col col-md-6 mb-1">
									<button type="button" class="table__btn-edit [ btn btn-block btn-secondary ]">Edit</button>
								</div>
								<div class="col col-md-6">
									<button type="button" class="table__btn-delete [ btn btn-block btn-outline-secondary ]">Delete</button>
								</div>
							</div>
						</td>
					</tr>`);
			});

			$(".table__btn-delete").on("click", function(){
				const id = parseInt($(this).closest("tr").attr("listid"), 10);
				$(".delete-modal__question").html(`Are you sure want to delete ${list.get(id).name}?`);
				$(".delete-modal").attr("listid", id);
				$(".delete-modal").fadeIn(300);
			})
		}
	}

	class Product{
		// constructor(obj){
		// 	this.name = obj.name;
		// 	this.email = obj.email;
		// 	//this.id = id();
		// }

		// sayHi (){
		// 	console.log("Hi " + this.id);
		// }

		// clear(){
		// 	for (let member in this) delete this[member];
		// }
	}

	const validate = function(value, name){
		switch (name) {
			case "name":
				if (value.length > 15)
					return "Name max length is 15 characters";
				if (value === "")
					return "Please, enter your name"
				return "";
				break;
			case "email":
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				if (!re.exec(value))
					return "Please, enter correct email adress";
				return "";
				break;
			case "count":
				if (value === "")
					return "Please, enter the count"
				if (!isFinite(value) || value % 1)
					return "Please, enter an integer value";
				return "";
				break;
			case "price":
				if (value === "")
					return "Please, enter the price"
				if (!isFinite(value))
					return "Please, enter an integer value";
				return "";
				break;
			default:
				return "";
		}
	}

	const validateForm = function(){

	}

	function onAddButton(){
		let res = new Product();
		$("")
	}

	function init(){
		let list = new List;
		let item = new Product;
		let $form;
		let onValidationError = false;

		{
			$(".table__input-search").attr("placeholder", "Enter product name...");
			$(".add-modal__name").attr("placeholder", "Some product name");
			$(".add-modal__email").attr("placeholder", "uss@epam.com");
		}

		{
			$(".add-modal__delivery-country")
				.html("")
				.append(`<option selected disabled hidden></option>`)
				.on("change", function(event) {
					$(".select-container").html($(".select-container").find($(".select-all")));
				$(".select-all").on("change", (event) => {
					if ($(event.target).is(":checked")){
						$(".add-modal__delivery-city").not(":checked").trigger("click");
					}
					else
						$(".add-modal__delivery-city:checked").trigger("click");
				})				
				deliveryInfo
					.get(event.target.value)
					.forEach((val) => {
						$(".select-container")
							.append(`
								<label class="">
									<input class="add-modal__delivery-city" type="checkbox" name="delivery-city" value="${val}">
									${val}
								</label>
							`);
					});
				});
			deliveryInfo.forEach((value, key, map) => {
				$(".add-modal__delivery-country").append(`<option>${key}</option>`);
			})
		}

		{
			$(".select-container")
				.html("")
				.append(`
					<label class="select-all">
						<input class="add-modal__delivery-city" type="checkbox" name="delivery-city" value="select-all">
						Select all
					</label>
				`);
			$(".select-all").on("change", (event) => {
				console.log($(event.target).is(":checked"));
				if ($(event.target).is(":checked"))
					$(".add-modal__delivery-city").not(":checked").change();
			})
		}

		$("#form-add")
			.on("blur", "[validationNeeded]", function (event){
				$(this)
					.parent()
					.children(".validation-error")
					.html(validate(event.target.value, event.target.name));
			})
			.on("keypress", "[validationNeeded]", function(event) {
				if (event.keyCode !== ENTER_KEY)
					return;
				event.preventDefault();
				$(this)
					.parent()
					.children(".validation-error")
					.html(validate(event.target.value, event.target.name));
			})

		$(".add-modal__btn-add").on("click", (event) => {
			let res = new Product({});
			onValidationError = false;
			$("#form-add [validationNeeded]").each((i, elem) => {
				const errorMsg = validate(elem.value,elem.name);
				$(elem)
					.parent()
					.children(".validation-error")
					.html(errorMsg);
				if (errorMsg !== "")
					onValidationError = true;
				else
					res[elem.name] = $(elem).val();
			});		
			$(".add-modal__delivery-city:checked").each((i, elem) => {
				if (!res.hasOwnProperty(elem.name))
					res[elem.name] = [];
				res[elem.name].push($(elem).val());
			})
			if (!onValidationError){
				list.addProduct(res).then((list) => {
					list.render();
					$form[0].reset();
					$(".my-modal").fadeOut(300);
				})
			}
		})
			

		$(".form__btn-close").on("click", () => {
			$form[0].reset();
			$(".validation-error").html("");
			$(".my-modal").fadeOut(300);
		})

		$(".table__btn-add").on("click", () => {
			$(".add-modal").fadeIn(300);
			$form = $("#form-add")
		})


		$(".add-modal__btn-cancel").on("click", () => {
			$form[0].reset();
			$(".validation-error").html("");
			$(".add-modal").fadeOut(300);
		})

		$(".delete-modal__btn-no").on("click", () => {
			$(".delete-modal").fadeOut(300);
		})

		$(".delete-modal__btn-yes").on("click", (event) => {
			list.deleteProduct($(".delete-modal").attr("listid"));
			$(".delete-modal").fadeOut(300);
			list.render();
		})

		{
			const search = (obj) => {
				let _list = list.search($(obj).val());
				list.render(_list);
			}
			$(".table__btn-search").on("click", () => {
				search($(".table__input-search"));
			});
			$(".table__input-search").on("keypress", (event) => {
				if (event.keyCode !== ENTER_KEY)
					return;
				event.preventDefault();
				search($(".table__input-search"));
			})
			
		}

		{
			$(".name__info").on("click", (event) => {
				$(".info-modal").fadeIn(300);
			})
		}

	}

	init();
})