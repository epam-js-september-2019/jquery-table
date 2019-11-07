import { Modal } from "./modal";
import compileTemplate from "lodash.template";

export class Dialog extends Modal {
  constructor({ message, confirm }) {
    super();
    this.handlers = { confirm };
    this.renderTemplate = compileTemplate($("#dialog-template").html());
    this.modalContainer.html(
      this.renderTemplate({
        message: message
      })
    );
    this.dialog = this.modalContainer.find(".js-dialog");
    this.bindEvents();
  }
  bindEvents() {
    this.dialog.on("click", ".js-yes", this.confirm.bind(this));
    this.dialog.on("click", ".js-no", this.close.bind(this));
  }
  confirm() {
    this.handlers.confirm().then(() => this.close());
  }
}
