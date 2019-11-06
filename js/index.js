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

	class List{
		constructor(newList = 0){
			if (newList)
				this.#init(newList);
		}

		#idCounter = 0;
		#productList = {};

		#init = function(newList){
			for(let id in newList){
				this.#productList[this.#idCounter++] = newList[id];
			}
		}

		addProduct(el, id = -1){
			if (id === -1)
				this.#productList[this.#idCounter++] = el;
			else{
				delete this.#productList[id];
				this.#productList[id] = el;
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => resolve(this), 2000);
			})
		}

		deleteProduct(id){
			delete this.#productList[id];
			return new Promise((resolve, reject) => {
				setTimeout(() => resolve(this), 2000);
			})
		}

		getProductValue(id, key){
			if(key==="delivery-country"){
				// console.log("id (getProductValue) = " + id + "(" + typeof id + ")");
				console.log("key (getProductValue) = " + key + "(" + typeof key + ")");
				console.log(this.#productList[id][key]);
			}
			return this.#productList[id][key];
		}

		getList(){ 
			return JSON.parse(JSON.stringify(this.#productList));
		};

		search(val){
			if (!Object.keys(this.#productList).length)
				return null;
			val = val.toLowerCase();
			let result = {};
			Object.entries(this.#productList).filter(el => el[1].name.toLowerCase().includes(val)).forEach((value) => {
				result[value[0]] = value[1];
			})
			return result;
		}
	}

	class Table{
		constructor(list = 0){
			this.list = new List(list);
			this.render();
			this.initFields();
			this.initModals();
		}

		#modals = {
			common: $(".my-modal"),
			edit: $(".edit-modal"),
			delete: $(".delete-modal"),
			info: $(".info-modal"),
		}

		#deliveryInfo = new Map([
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
			]
		);

		#priceToEnStr = num => "$" + parseFloat(parseFloat(num).toFixed(2)).toLocaleString('en-US');
		#priceFromEnStr = str => parseFloat(str.slice(1).replace(',',''));
		#trimSpaces = str => str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s\s*/, ' ');

		initFields(){
			((searchField) => {
				const search = (obj) => {
					$(obj).val((i, str) => this.#trimSpaces(str));
					let _list = this.list.search($(obj).val());
					if (_list)
						this.render(_list);
				}

				const _input = $(searchField).find("input");

				_input.attr("placeholder", "Enter product name...");

				searchField
				.on("click", "button.search", (event) => {
					event.stopPropagation();
					search(_input);
				})
				.on("keypress", "input", (event) => {
					event.stopPropagation();
					if (event.keyCode !== ENTER_KEY)
						return;
					event.preventDefault();
					search(_input);
				});
			})($(".search-group"));

			((addButton) => {
				addButton.on("click", () => {
					this.#modals.edit.data("id", -1)
					this.#modals.edit.find(".js-modal-header").html("Add new product");
					this.#modals.edit.fadeIn(300);
				})
			})($(".table__btn-add"));

			((productTable) => {
				const fillEdit = (id) => {
					const country = this.list.getProductValue(id, "delivery-country");
					console.log(country);
					$(".js-edit-delivery-country")
					.val(country);
					this.#renderCities(country);
					this.#modals.edit.find("input:not(.js-select-all)").each((i, elem) => {
						$(elem).val(() => {
							if (elem.name === "price")
								return this.#priceToEnStr(this.list.getProductValue(id, elem.name));
							return this.list.getProductValue(id, elem.name);
						})
					});

				}

				productTable
				.on("click", ".js-btn-delete", (event) => {
					const id = $(event.target).closest("tr").data("id");

					$(".js-delete-question").html(`Are you sure want to delete ${this.list.getProductValue(id, "name")}?`);
					this.#modals.delete
					.data("id", id)
					.fadeIn(300);
				})
				.on("click", ".js-btn-edit", (event) => {
					const id = $(event.target).closest("tr").data("id");

					this.#modals.edit.find(".js-modal-header").html(`Edit ${this.list.getProductValue(id, "name")}`);
					fillEdit(id);
					this.#modals.edit
					.data("id", id)
					.fadeIn(300);					
				})
			})($("table.product-list"));
		}

		initModals(){
			this.#modals.delete
			.on("click", ".js-delete-cancel", (event) => {
				this.#modals.delete.fadeOut(300);
			})
			.on("click", ".js-delete-submit", (event) => {
				this.#modals.delete.fadeOut(300);
				this.list.deleteProduct(this.#modals.delete.data("id")).then((list) => {
					this.render();
				});

			});

			const onClose = (form) => {
				form.reset();
				$("input").removeClass("error");
				$(form).find(".validation-error").html("");
				$(".js-edit-delivery-city").parent().remove();
			}

			const validateInput = (elem) => {
				const _validate =(value, name) => {
					switch (name) {
						case "name":
							if (value.length < 5)
								return "Name min length is 5 characters";
							if (value.length > 15)
								return "Name max length is 15 characters";
							if (value === "")
								return "Please, enter the name"
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
							if (!isFinite(value) || value % 1 || value < 0)
								return "Please, enter a positive integer value";
							return "";
							break;
						case "price":
							if (value === "")
								return "Please, enter the price"
							if (!isFinite(value) || value < 0)
								return "Please, enter a positive numeric value";
							return "";
							break;
						default:
							return "";
					}
				}
				let _value = elem.value.slice(0);
				const _name = elem.name.slice(0);
				if(_name === "price" && _value.slice(0, 1) === "$")
					_value = this.#priceFromEnStr(_value);
				const errorMsg = _validate(_value, _name);
				if (errorMsg === ""){
					$(elem)
					.removeClass("error")
					.siblings(".validation-error").html("");
					return $(elem).val();
				}
				$(elem)
				.addClass("error")
				.siblings(".validation-error").html(errorMsg);
				return null;
			}

			((editForm) => {
				editForm.find(".js-edit-delivery-country")
				.html("")
				.append(`<option selected disabled hidden></option>`)
				.on("change", (event) => {
					this.#renderCities(event.target.value);
				});

				this.#deliveryInfo.forEach((value, key, map) => {
					$(".js-edit-delivery-country").append(`<option>${key}</option>`);
				})
			})($(this.#modals.edit.find("form")[0]));

			this.#modals.edit
			.on("click", ".js-btn-close", () => {
				this.#modals.common.fadeOut(300);
				onClose(this.#modals.edit.find("form")[0]);				
			})
			.on("click", ".js-edit-cancel", (event) => {
				this.#modals.common.fadeOut(300);
				onClose(this.#modals.edit.find("form")[0]);		
			})
			.on("click", ".js-edit-submit", (event) => {
				let res = {};
				let onValidationError = false;
				let curRes;
				this.#modals.edit.find('input[type=text]').each((i, elem) => {
					$(elem).val(() => this.#trimSpaces(elem.value));
					curRes = $(elem).hasClass("js-validate")
						? validateInput(elem)
						: elem.value;
					if (!curRes)
						onValidationError = true;
					else
						res[elem.name] = curRes;
				});	
				if (res.hasOwnProperty("price"))
					res.price = this.#priceFromEnStr(res.price);
				res["delivery-country"] = $(".js-edit-delivery-country").val();
				$(".js-edit-delivery-city:checked").each((i, elem) => {
					if (!res.hasOwnProperty(elem.name))
						res[elem.name] = [];
					res[elem.name].push($(elem).val());
				})
				console.log(res);
				if (!onValidationError){
					this.#modals.common.fadeOut(300);
					this.list.addProduct(res, this.#modals.edit.data("id")).then((list) => {
						this.render();
						onClose(this.#modals.edit.find("form")[0]);
					})
				}
			})
			.on("change", ".select-all", (event) => {
				if ($(event.target).is(":checked")){
					$(".js-edit-delivery-city").not(":checked").prop("checked", true);
				}
				else
					$(".js-edit-delivery-city:checked").prop("checked", false);
			})
			.on("change", ".js-edit-delivery-city", (event) => {
				if ($(event.target).is(":checked")){
					if(!$(".js-edit-delivery-city").not(":checked").length)
						$(".js-select-all").prop("checked", true);
				}
				else
					$(".js-select-all").prop("checked", false);
			})
			.on("blur", ".js-validate:not(.js-edit-price)", (event) => {
				event.target.value = this.#trimSpaces(event.target.value);
				validateInput(event.target);
			})
			.on("blur", ".js-edit-price", (event) => {
				event.target.value = this.#trimSpaces(event.target.value);
				if (validateInput(event.target))
					event.target.value = this.#priceToEnStr(event.target.value);
			})
			.on("focus", "form .error", (event) => {
				event.target.value = "";
			})
			.on("focus", ".js-edit-price:not(.error)", (event) => {
				event.target.value = event.target.value && this.#priceFromEnStr(event.target.value);
			})
			.on("input", ".js-edit-count", (event) => {
				$(event.target).val((i, str) => str.replace(/[^0-9]/g, ''));
			});
			
		}

		#renderCities = (country) => {
			$(".js-edit-delivery-city").parent().remove();
			this.#deliveryInfo
			.get(country)
			.forEach((val) => {
				$(".select-container")
				.append(`
					<label>
						<input class="js-edit-delivery-city" type="checkbox" name="delivery-city" value="${val}">
						${val}
					</label>
				`);
			});
		}

		render(list = this.list.getList()){
			$(".product-list tbody").html("");
			for (let id in list){
			//list.forEach((value, key, map) => {
				$(".product-list tbody").append(`
					<tr data-id=${id}>
						<td class="name align-middle" data-col-name="name">
							<a class="name__info" href="">
								${list[id].name}
							</a>
							<span class="name__count px-2 py-1">
								${list[id].count}
							</span>
						</td>
						<td class="price align-middle" data-col-name="price">
							<div class="price__info">
								${this.#priceToEnStr(list[id].price)}
							</div>
						</td>
						<td class="align-middle" data-col-name="actions">
							<div class="row justify-content-around">
								<div class="col col-md-6 mb-1">
									<button type="button" class="js-btn-edit [ btn btn-block btn-secondary ]">Edit</button>
								</div>
								<div class="col col-md-6">
									<button type="button" class="js-btn-delete [ btn btn-block btn-outline-secondary ]">Delete</button>
								</div>
							</div>
						</td>
					</tr>`
				);
			}//)
		}
	}

	function main(){
		const initialTable = {};
		// let prod1 = new Product;
		// 	prod1["name"]= "Pencil";
		// 	prod1["email"]= "uss@gmail.com";
		// 	prod1["count"]= 7;
		// 	prod1["price"]= 5432.6533;
		// 	prod1["delivery-country"]= ["Russia"];
		// 	prod1["delivery-city"]= ["Saratov", "Moscow"];
		// initialTable["1"] = prod1;
		// console.log(initialTable["1"]["delivery-country"]);
		let prod1 = {
			name: "Pencil",
			email: "abcfs12@gmail.com",
			count: 654,
			price: 4322.45,
			"delivery-country": "Russia",
			"delivery-city": ["Saratov", "Moscow"]
		};
		initialTable["1"] = prod1;
		let prod2 = {
			name: "Pen01",
			email: "abcfs12@gmail.com",
			count: 443,
			price: 7434322.654,
			"delivery-country": "Belarus",
			"delivery-city": ["Minsk"]
		};
		initialTable["2"] = prod2;
		let prod3 = {
			name: "Adonit",
			email: "asfbf@gmail.com",
			count: 467,
			price: 6543.00000,
			"delivery-country": "Russia",
			"delivery-city": ["Saratov", "Moscow"]
		};
		initialTable["3"] = prod3;

		const tbl = new Table(initialTable);
		document.tbl = tbl;
	}

	main();
})