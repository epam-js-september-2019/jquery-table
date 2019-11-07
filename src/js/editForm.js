import compileTemplate from "lodash.template";
import { validateEmail, formatPrice } from "./helpers.js";

export class EditForm {
  constructor({ initialData, submit }) {
    this.formData = {
      ...initialData,
      amount: parseInt(initialData.amount),
      price: Math.round(parseFloat(initialData.price) * 100) / 100
    };
    this.errors = {};
    this.handlers = { submit };
    this.modalContainer = $(".js-modal-container");
    this.renderTemplate = compileTemplate($("#form-template").html());
    this.modalContainer.html(
      this.renderTemplate({
        ...this.formData,
        price: formatPrice(this.formData.price)
      })
    );
    this.form = this.modalContainer.find(".js-form");
    this.fields = {
      name: this.form.find("input[name=name]"),
      email: this.form.find("input[name=email]"),
      price: this.form.find("input[name=price]"),
      amount: this.form.find("input[name=amount]")
    };
    this.bindEvents();
  }
  show() {
    this.activateFocusTrap();
    this.modalContainer.fadeIn();
  }
  close() {
    this.modalContainer.fadeOut();
    this.modalContainer.html("");
    this.deactivateFocusTrap();
  }
  bindEvents() {
    this.form.find("button").click(e => e.preventDefault());
    this.form.find(".js-submit").click(this.submit.bind(this));
    this.form.find(".js-cancel").click(this.close.bind(this));
    this.form.find("input").on("input", e => this.clearError(e.target.name));
    this.fields.name.on("change", this.handleNameChange.bind(this));
    this.fields.email.on("change", this.handleEmailChange.bind(this));
    this.fields.amount.on("input", this.handleAmountChange.bind(this));
    this.fields.price.on("focus", this.handlePriceFocus.bind(this));
    this.fields.price.on("blur", this.handlePriceBlur.bind(this));
    const handleOverlayClick = e => {
      if (e.target === this.modalContainer.get(0)) {
        this.modalContainer.unbind(handleOverlayClick);
        this.close();
      }
    };
    this.modalContainer.bind("click", handleOverlayClick);
    const handleEsc = e => {
      if (e.key === "Escape") {
        $(document).unbind("keyup", handleEsc);
        this.close();
      }
    };
    $(document).bind("keyup", handleEsc);
  }
  handlePriceFocus(e) {
    e.target.value = this.formData.price;
  }
  handlePriceBlur(e) {
    this.formData.price = Math.round(parseFloat(e.target.value) * 100) / 100;
    e.target.value = formatPrice(this.formData.price);
  }
  handleAmountChange(e) {
    e.target.value = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
    this.formData.amount = parseInt(e.target.value);
  }
  handleNameChange(e) {
    this.formData.name = e.target.value;
  }
  handleEmailChange(e) {
    this.formData.email = e.target.value;
  }
  changeDelivery(cities) {
    this.formData.cities = cities;
  }
  validate(data) {
    const errors = {
      name: this.validateName(data.name),
      email: this.validateEmail(data.email),
      amount: this.validateAmount(data.amount),
      price: this.validatePrice(data.price)
    };
    return Object.keys(errors).reduce(
      (obj, key) => (errors[key] ? { ...obj, [key]: errors[key] } : obj),
      {}
    );
  }
  validateName(value) {
    if (!value) return "This field is required";
    if (value.length < 5) return "Too small. Should be at least 5 chars";
    if (value.length > 15)
      return "Too long. Should be not longer than 15 chars";
  }
  validateEmail(value) {
    if (!value) return "This field is required";
    if (!validateEmail(value)) return "Invalid email";
  }
  validateAmount(value) {
    if (!value) return "This field is required";
    if (!Number.isInteger(+value)) return "Should be an integer";
    if (+value < 0) return "Should be positive";
  }
  validatePrice(value) {
    if (!value) return "This field is required";
    if (isNaN(value)) return "Should be a number";
    if (value < 0) return "Should be positive";
  }
  renderErrors() {
    this.clearAllErrors();
    Object.entries(this.errors).forEach(([name, error]) =>
      this.renderError(name, error)
    );
    this.form.find("input.is-invalid").focus();
  }
  renderError(fieldName, error) {
    const field = this.modalContainer.find(`[name=${fieldName}`);
    field.addClass("is-invalid");
    if (field.attr("type") === "text") {
      field.after(`<div class="invalid-feedback">${error}</div>`);
    }
  }
  clearAllErrors() {
    const fieldNames = this.modalContainer
      .find("input")
      .map(function() {
        return this.name;
      })
      .get();
    fieldNames.forEach(name => this.clearError(name));
  }
  clearError(fieldName) {
    if (!this.errors[fieldName]) return;
    const field = this.modalContainer.find(`[name=${fieldName}`);
    field.removeClass("is-invalid");
    if (field.attr("type") === "text") {
      field.siblings(".invalid-feedback").remove();
    }
  }
  submit() {
    this.errors = this.validate(this.formData);
    if (Object.keys(this.errors).length > 0) {
      this.renderErrors();
    } else {
      this.handlers.submit(this.formData).then(() => this.close());
    }
  }
  getCitiesValues() {
    return this.modalContainer
      .find("form [name='cities']")
      .filter(function() {
        return this.value !== "selectall";
      })
      .filter(function() {
        return this.checked;
      })
      .map(function() {
        return this.value;
      })
      .get();
  }
  activateFocusTrap() {
    const container = this.modalContainer.get(0);
    const focusTarget = $(".js-focus-target", this.modalContainer).get(0);
    $(document).on("focusin.bft", e => {
      if (!$.contains(container, e.target)) {
        focusTarget.focus();
      }
    });
  }
  deactivateFocusTrap() {
    $(document).off("focusin.bft");
  }
}
