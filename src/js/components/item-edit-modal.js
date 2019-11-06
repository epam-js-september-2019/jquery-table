import $ from 'jquery';
import validator from 'jquery-validation';
import {DELIVERY_OPTIONS} from '../mocks/mocks';
$.fn.validator = validator;


export default class EditModal {
  static getCountriesOptions(selectedCountry) {
    const countries = Object.keys(DELIVERY_OPTIONS);
    const htmlOptions = [];
    countries.forEach((c) => {
      htmlOptions.push(`<option ${selectedCountry === c ? `selected` : ``}>${c}</option>`);
    });
    return htmlOptions.join(`
    `);
  }

  static getCitiesCheckboxes(country, checkedCities) {
    const htmlElements = [];
    if (!country || (country === `Choose...`)) {
      $(`#citiesAll`).prop(`disabled`, true);
      return htmlElements.join(``);
    }
    $(`#citiesAll`).prop(`disabled`, false);
    const cities = DELIVERY_OPTIONS[country];
    let id = 2;
    cities.forEach((c) => {
      htmlElements.push(`
      <div class="form-check">
        <input
          class="css-checkbox city-checkbox"
          type="checkbox"
          name="city${id}"
          id="city${id}"
          value="${c}"
          ${checkedCities ? `${checkedCities.includes(c) ? `checked` : ``}` : ``} >
        <label class="css-label form-check-label" for="city${id++}">
          ${c}
        </label>
      </div>`.trim());
    });
    return htmlElements.join(``);
  }

  // трансформации для поля price
  static transformPriceToValue(price) {
    return `$${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, `$&,`)}`;
  }

  static transformValueToPrice(value) {
    if (!value) {
      return 0;
    }
    const parts = value.split(`,`);
    parts[0] = parts[0].replace(`$`, ``);
    return parseFloat(parts.join(``));
  }

  constructor(modalContainer) {
    this._item = null;
    this._modalContainer = modalContainer;
    this.closeBtn = this.getElement().find(`.editModal__closeBtn`);
    this.saveBtn = this.getElement().find(`.editModal__saveBtn`);
    this._citiesList = this.getElement().find(`#citiesList`);
    this._citiesAllCheckBox = this.getElement().find(`#citiesAll`);
    this._nameInput = this.getElement().find(`#name`);
    this._emailInput = this.getElement().find(`#email`);
    this._countInput = this.getElement().find(`#count`);
    this._priceInput = this.getElement().find(`#price`);
    this._deliveryInput = this.getElement().find(`#delivery`);

    this._subscribeOnEvents();
  }

  updateElement(item) {
    this._item = item;
    this._nameInput.val(item.name);
    this._emailInput.val(item.email);
    this._countInput.val(item.count);
    this._priceInput.val(EditModal.transformPriceToValue(item.price));
    this._deliveryInput.empty()
      .append(`<option ${item.country ? `` : `selected`}>Choose...</option>`)
      .append(EditModal.getCountriesOptions(item.country));
    this._citiesAllCheckBox.prop(`disabled`, item.country ? false : true);
    this._citiesList.empty()
      .append(EditModal.getCitiesCheckboxes(item.country, item.cities));
    // если есть страна, то подписываюсь на клики по чекбоксам городов (для новой карточки страны нет)
    this._checkedCities = this._citiesList.find(`input:checked`);
    if (item.country) {
      this._citiesCheckBoxes = this._citiesList.find(`input[type=checkbox][name^=city]`);
      this._citiesCheckBoxes.bind(`click`, this._cityCheckBoxClickHandler.bind(this));
    }
  }

  getHtml() {
    return `
      <div class="editModal">
        <div class="editModal__header">
          <h1>Edit Product</h1>
        </div>
        <div class="editModal__content">
          <form id="editModal__form">
            <div class="form-row">
              <div class="form-group col-md-8">
                <label for="name">Name:</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  name="name"
                  placeholder="Product name"
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-8">
                <label for="email">Email</label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-4">
                <label for="count">Count:</label>
                <input type="text" class="form-control" id="count" placeholder="0" name="count">
              </div>
              <div class="form-group col-md-4">
                <label for="price">Price:</label>
                <input type="text" class="form-control" id="price" placeholder="0" name="price">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="delivery">Delivery</label>
                <select id="delivery" class="form-control">
                </select>
              </div>
              <fieldset class="form-group col-md-6">
                <legend class="col-form-label">Cities</legend>
                <div class="form-check select-all">
                  <input class="css-checkbox form-check-input" type="checkbox" name="citiesAll" id="citiesAll" value="all">
                  <label class="css-label form-check-label" for="citiesAll">
                    Select All
                  </label>
                </div>
                <div id = "citiesList">
                </div>
              </fieldset>
            </div>
            <div class="form-row justify-content-between">
              <button type="submit" class="btn btn-primary editModal__saveBtn">Save Changes</button>
              <button type="reset" class="btn btn-danger editModal__closeBtn">Close</button>
            </div>
          </form>
        </div>
      </div>`.trim();
  }

  getElement() {
    if (!this._element) {
      this._element = $(this.getHtml());
    }
    return this._element;
  }

  getFormData() {
    return this._formData;
  }

  open(item, onSaveClickHandler) {
    this.updateElement(item);
    this._onSaveClick = onSaveClickHandler;

    if (!this._modalContainer.length) {
      throw new Error(`Can't find ".modalWindow" DOM-element`);
    }
    this._modalContainer.addClass(`modalWindow-open`);
    this._modalContainer.append(this.getElement());
  }

  _subscribeOnEvents() {
    // Вешаю обработчик на CloseBtn
    this.closeBtn.bind(`click`, () => {
      this._modalContainer.removeClass(`modalWindow-open`);
      this._formValidator.resetForm();
      this._formValidator.reset();
      this.getElement().detach(); // удаляет элемент, но оставляет обработчики на нём
    });

    // обработчик выбора страны
    this._deliveryInput.bind(`change`, (evt) => {
      this._citiesList.empty().append(EditModal.getCitiesCheckboxes(evt.target.value));
      // перезаписываю переменную:
      this._citiesCheckBoxes = this._citiesList.find(`input[type=checkbox][name^=city]`);
      // вешаю обработчик на новые checkbox:
      this._citiesCheckBoxes.bind(`click`, this._cityCheckBoxClickHandler.bind(this));
    });

    // обработчик на клик по checkAll
    this._citiesAllCheckBox.bind(`change`, (evt) => {
      if (evt.target.checked) {
        this._citiesCheckBoxes.each((i, e) => {
          e.checked = true;
        });
      } else {
        this._citiesCheckBoxes.each((i, e) => {
          e.checked = false;
        });
      }
    });

    // обработчик на SAVE
    this.saveBtn.bind(`click`, (evt) => {
      evt.preventDefault();
      if (this._formValidator.form()) {
        // если валидация проходит, то запоминаю введённые значения, закрываю окно и вызываю обработчик на save
        this._formData = this._getNewData();
        this.closeBtn.trigger(`click`);
        this._onSaveClick();
      } else {
        // если валидация не проходит, кидаю фокус на первую ошибку:
        this._formValidator.focusInvalid();
      }
    });

    // ---------- Валидация инпутов
    this._formValidator = this.getElement().find(`#editModal__form`).validate({
      // правила:
      rules: {
        normalizer(value) {
          return $.trim(value);
        },
        name: {
          required: true,
          minlength: 5,
          maxlength: 15,
        },
        email: {
          required: true,
          email: true,
        },
        count: {
          number: true,
          min: 0
        },
        price: {
          normalizer: (value) => {
            return EditModal.transformValueToPrice(value);
          },
          number: true,
          min: Number.MIN_VALUE,
        }
      },
      // сообщения об ошибках:
      messages: {
        name: {
          required: `Введите наименоваие!`,
          minlength: `маловато... давай минимум 5 символов!`,
          maxlength: `перебор... максимум 15 символов!`,
        },
        email: {
          required: `Сорян, но это обязательное поле...`,
          email: `Нужен правильный email адресс!`,
          strongEmail: true,
        },
        price: {
          number: `Только числа!`,
          min: `Введите положительное число!`
        },
      }
    });

    // ДОПОЛНИТЕЛЬНЫЕ ОБРАБОТЧИКИ НА ИНПУТЫ
    // Невалидные символы нельзя ни вводить, ни вставлять из буфера обмена в поле Count
    this._countInput.on(`input`, (e) => {
      const value = parseInt(e.target.value, 10);
      if (Number.isNaN(value) || !e.target.value) {
        e.target.value = 0;
      } else {
        e.target.value = value;
      }
    });

    // В поле price обрабатываю ввод более 2ух символов после точки (центов не может быть > 99)
    this._priceInput.on(`input`, (e) => {
      if (e.target.value[e.target.value.length - 1] === `.` && e.target.value.indexOf(`.`) === e.target.value.length - 1) {
        return;
      }
      const value = Math.round(e.target.value * 100) / 100;
      if (Number.isNaN(value) || !e.target.value) {
        e.target.value = e.target.value.slice(0, -1);
      } else {
        e.target.value = value;
      }
    });

    // При потере фокуса переписываю значение поля price на формат цены
    this._priceInput.on(`change`, (e) => {
      if (!isNaN(e.target.value)) {
        this._priceInput.val(EditModal.transformPriceToValue(+e.target.value));
      }
    });
    // При получении фокуса обратно трансформировую значение поля в цифровое
    this._priceInput.on(`focus`, () => {
      this._priceInput.val(EditModal.transformValueToPrice(this._priceInput.val()));
    });
  }

  _cityCheckBoxClickHandler() {
    this._checkedCities = this._citiesList.find(`input:checked`);
    if (this._citiesCheckBoxes.length === this._checkedCities.length) {
      this._citiesAllCheckBox.prop(`checked`, true);
    } else {
      this._citiesAllCheckBox.prop(`checked`, false);
    }
  }

  _getNewData() {
    const checked = [];
    if (this._checkedCities) {
      this._checkedCities.each((i, e) => {
        checked[i] = e.value;
      });
    }
    return {
      id: this._item.id,
      name: this._nameInput.val(),
      email: this._emailInput.val(),
      count: this._countInput.val(),
      price: EditModal.transformValueToPrice(this._priceInput.val()), // храню цену в формате нормального числа
      country: this._deliveryInput.val() === `Choose...` ? `` : this._deliveryInput.val(),
      cities: checked,
    };
  }

}
