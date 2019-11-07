import compileTemplate from "lodash.template";

export class Modal {
  constructor() {
    this.modalContainer = $(".js-modal-container");
    this.bindModalEvents();
  }
  bindModalEvents() {
    this.modalContainer.on("click", ".js-close", this.close.bind(this));
    const handleOverlayClick = e => {
      if (e.target === this.modalContainer.get(0)) {
        this.modalContainer.off("click", handleOverlayClick);
        this.close();
      }
    };
    this.modalContainer.on("click", handleOverlayClick);
    const handleEsc = e => {
      if (e.key === "Escape") {
        $(document).off("keyup", handleEsc);
        this.close();
      }
    };
    $(document).on("keyup", handleEsc);
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
  startLoading() {
    if (this.submitButton) {
      const renderLoading = compileTemplate($("#loading-template").html());
      this.submitButton.html(renderLoading());
    }
  }
  activateFocusTrap() {
    const container = this.modalContainer.get(0);
    const focusTarget = this.modalContainer.find(".js-focustarget").get(0);
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
