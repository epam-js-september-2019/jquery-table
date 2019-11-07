import { ProductsModel } from "./productsModel.js";
import { Header } from "./header.js";
import { ProductsList } from "./productsList.js";
import { Form } from "./form.js";
import { RemoveDialog } from "./removeDialog.js";
import { DeliveryField } from "./deliveryField.js";
import { searchByName } from "./helpers.js";
import countries from "../fixtures/countries.json";
import cities from "../fixtures/cities.json";

export class App {
  constructor() {
    this.model = new ProductsModel();
    this.search = null;
    this.header = new Header({
      addNew: this.addProduct.bind(this),
      applySearch: this.applySearch.bind(this),
      resetSearch: this.resetSearch.bind(this)
    });
    this.table = new ProductsList({
      showDetails: this.showDetails.bind(this),
      edit: this.editProduct.bind(this),
      remove: this.removeProduct.bind(this)
    });
    this.table.render(this.model.getAll());
    this.model.subscribe(this.renderList.bind(this));
    this.model.init();
  }
  renderList(data) {
    const products = this.search ? searchByName(data, this.search) : data;
    this.table.render(products);
  }
  showDetails(id) {
    console.log("Show details: " + id);
  }
  addProduct() {
    this.createForm({
      title: "Add new product",
      submit: data => this.model.addNewProduct(data)
    });
  }
  editProduct(id) {
    this.createForm({
      title: this.model.getDetails(id).name,
      initialData: this.model.getDetails(id),
      submit: data => this.model.updateProduct(id, data)
    });
  }
  removeProduct(id) {
    console.log("Show details " + id);
  }
  applySearch(query) {
    this.search = query;
    this.renderList(this.model.getAll());
  }
  resetSearch() {
    this.search = null;
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
