import { Storage } from "./storage.js";
import { Header } from "./header.js";
import { Table } from "./table.js";
import { Form } from "./form.js";
import { Dialog } from "./dialog.js";
import { Details } from "./details.js";
import { DeliveryField } from "./deliveryField.js";
import { searchByName } from "./helpers.js";
import countries from "../fixtures/countries.json";
import cities from "../fixtures/cities.json";

export class App {
  constructor() {
    this.storage = new Storage();
    this.search = null;
    this.header = new Header({
      addNew: this.addProduct.bind(this),
      applySearch: this.applySearch.bind(this),
      resetSearch: this.resetSearch.bind(this)
    });
    this.table = new Table({
      showDetails: this.showDetails.bind(this),
      edit: this.editProduct.bind(this),
      remove: this.removeProduct.bind(this)
    });
    this.table.render(this.storage.getAll());
    this.storage.subscribe(this.renderList.bind(this));
    this.storage.init();
  }
  renderList(data) {
    const products = this.search ? searchByName(data, this.search) : data;
    this.table.render(products);
  }
  showDetails(id) {
    this.details = new Details({
      data: this.storage.getDetails(id),
      cities: cities
    });
    this.details.show();
  }
  addProduct() {
    this.createForm({
      title: "Add new product",
      submit: data => this.storage.addNewProduct(data)
    });
  }
  editProduct(id) {
    this.createForm({
      title: this.storage.getDetails(id).name,
      initialData: this.storage.getDetails(id),
      submit: data => this.storage.updateProduct(id, data)
    });
  }
  removeProduct(id) {
    this.dialog = new Dialog({
      message: `Are you sure you want to delete ${
        this.storage.getDetails(id).name
      }?`,
      confirm: () => this.storage.removeProduct(id)
    });
    this.dialog.show();
  }
  applySearch(query) {
    this.search = query;
    this.renderList(this.storage.getAll());
  }
  resetSearch() {
    console.log("Reset");
    this.search = null;
    this.renderList(this.storage.getAll());
  }
  createForm({ title, initialData = {}, submit }) {
    this.form = new Form({ title, initialData, submit });
    this.deliveryField = new DeliveryField({
      countries: countries,
      cities: cities,
      initialData: initialData.cities || [],
      change: cities => this.form.changeDelivery(cities)
    });
    this.deliveryField.renderTo(this.form.form.find(".js-delivery"));
    this.form.show();
  }
}
