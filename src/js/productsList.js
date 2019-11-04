import template from "lodash.template";

export class ProductsList {
  constructor({ showDetails, edit, remove }) {
    this.handlers = {
      showDetails: showDetails,
      edit: edit,
      remove: remove
    };
    this.table = $(".js-table");
    this.tableTemplate = template($("#table-template").html());
    this.bindEvents();
    console.log("Products list has been initialized");
  }
  bindEvents() {
    this.table.on("click", ".js-details", this.showDetails.bind(this));
    this.table.on("click", ".js-edit", this.editProduct.bind(this));
    this.table.on("click", ".js-remove", this.removeProduct.bind(this));
  }
  showDetails(e) {
    e.preventDefault();
    const id = this.getIdFromElement(e.target);
    this.handlers.showDetails(id);
  }
  editProduct(e) {
    const id = this.getIdFromElement(e.target);
    this.handlers.edit(id);
  }
  removeProduct(e) {
    const id = this.getIdFromElement(e.target);
    this.handlers.remove(id);
  }
  getIdFromElement(el) {
    return $(el)
      .closest(".js-product")
      .data("id");
  }
  render(data) {
    const html = this.tableTemplate(data);
    this.table.html(html);
  }
}
