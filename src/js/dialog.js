import compileTemplate from "lodash.template";

export class Dialog {
  constructor({ message, confirm }) {
    this.handlers = { confirm };
    this.renderTemplate = compileTemplate($("#dialog-template").html());
    this.modalContainer = $(".js-modal-container");
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
  show() {
    this.activateFocusTrap();
    this.modalContainer.fadeIn();
  }
  close() {
    this.modalContainer.fadeOut();
    this.modalContainer.html("");
    this.deactivateFocusTrap();
  }
  activateFocusTrap() {
    const container = this.modalContainer.get(0);
    const focusTarget = this.dialog.find(".js-focus-target").get(0);
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
