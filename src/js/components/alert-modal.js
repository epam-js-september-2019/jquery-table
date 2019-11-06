import $ from 'jquery';

export default class AlertModal {
  constructor(modalContainer) {
    this._modalContainer = modalContainer;
    this._delBtn = this.getElement().find(`.alertMessage__del-btn`);
    this._closeBtn = this.getElement().find(`.alertMessage__close-btn`);
    this._onDelClick = null;

    this._subscribeOnEvents();
  }

  getHtml() {
    return `
      <div class="alertMessage">
        <div class="alertMessage__header">
            <h1>Are your sure?</h1>
          </div>
          <div class="alertMessage__content">
            <p >Are you want to delete <span class="alertMessage__item-name"></span> ?</p>
            <button class="btn btn-block btn-danger alertMessage__del-btn">Yes</button>
            <button class="btn btn-block btn-primary alertMessage__close-btn">No</button>
          </div>
      </div>`.trim();
  }


  getElement() {

    if (!this._element) {
      this._element = $(this.getHtml());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  open(name, onDeleteClickHandler) {
    if (!this._modalContainer.length) {
      throw new Error(`Can't find ".modalWindow" DOM-element`);
    }
    this.getElement().find(`.alertMessage__item-name`).text(name);
    this._modalContainer.append(this.getElement());
    this._modalContainer.addClass(`modalWindow-open`);
    this._onDelClick = onDeleteClickHandler;
  }

  _closeModal() {
    this._modalContainer.removeClass(`modalWindow-open`);
    this.getElement().detach();
  }

  _subscribeOnEvents() {
    this._delBtn.bind(`click`, () => {
      this._closeModal();
      this._onDelClick();
    });

    this._closeBtn.bind(`click`, () => {
      this._closeModal();
    });
  }
}
