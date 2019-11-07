import { ProductsModel } from "./productsModel.js";
import { ProductsList } from "./productsList.js";
import { EditForm } from "./editForm.js";
import { AddForm } from "./addForm.js";
import { RemoveDialog } from "./removeDialog.js";
import { DeliveryField } from "./deliveryField.js";
import countries from "../fixtures/countries.json";
import cities from "../fixtures/cities.json";

export class App {
  constructor() {
    this.model = new ProductsModel();
    this.table = new ProductsList({
      showDetails: this.showDetails.bind(this),
      edit: this.editProduct.bind(this),
      remove: this.removeProduct.bind(this)
    });
    this.table.render({ items: this.model.getAll() });
    this.model.subscribe(data => this.table.render({ items: data }));
    this.model.init();
  }
  showDetails(id) {
    console.log("Show details: " + id);
  }
  editProduct(id) {
    this.editForm = new EditForm({
      initialData: this.model.getDetails(id),
      submit: data => this.model.updateProduct(id, data)
    });
    this.deliveryField = new DeliveryField({
      countries: countries,
      cities: cities,
      initialData: this.model.getDetails(id).cities,
      change: cities => this.editForm.changeDelivery(cities)
    });
    this.deliveryField.renderTo(this.editForm.form.find(".js-delivery"));
    this.editForm.show();
  }
  removeProduct(id) {
    console.log("Show details " + id);
  }
}
