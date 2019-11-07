import { Modal } from "./modal";
import compileTemplate from "lodash.template";

export class Details extends Modal {
  constructor({ data, cities }) {
    super();
    this.data = data;
    this.cities = cities;
    this.renderTemplate = compileTemplate($("#details-template").html());
    this.modalContainer.html(
      this.renderTemplate({ ...data, cities: this.getCities() })
    );
    this.dialog = this.modalContainer.find(".js-details");
    this.bindEvents();
  }
  bindEvents() {
    this.dialog.on("click", ".js-close", this.close.bind(this));
  }
  getCities() {
    return this.data.cities.map(
      city => this.cities.find(item => item.key === city).value
    );
  }
}
