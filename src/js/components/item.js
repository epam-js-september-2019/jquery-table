import $ from 'jquery';
import EditModal from './item-edit-modal';

export default class Item {
  constructor(item) {
    this._itemData = item;
    this._name = item.name;
    this._count = item.count;
    this._price = item.price;
    this._id = item.id;

    this.editBtn = this.getElement().find(`.item-actions__edit-btn`);
    this.delBtn = this.getElement().find(`.item-actions__del-btn`);
    this.name = this.getElement().find(`.name-btn`);
    this.price = this.getElement().find(`.price-btn`);
  }

  getName() {
    return this._name;
  }

  getId() {
    return this._id;
  }

  getItemData() {
    return this._itemData;
  }

  getHtml() {
    return `
    <tr class="tabel__item" id="${this._id}">
      <td class="align-middle tabel__item-name">
        <div class="d-flex justify-content-between">
          <a href="#" class="name-btn item-actions__edit-btn" data-action="edit">${this._name}</a>
          <span class="px-1 tabel__item-count" data-action="edit">${this._count}</span>
        </div>
      </td>
      <td class="align-middle tabel__item-price">
        <a href="#" class="price-btn item-actions__edit-btn" data-action="edit">${EditModal.transformPriceToValue(this._price)}</a>
      </td>
      <td class="align-middle tabel__item-actions item-actions">
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary item-actions__edit-btn" data-action="edit">EDIT</button>
          <button class="btn btn-secondary item-actions__del-btn" data-action="del">DELETE</button>
        </div>
      </td>
    </tr>`.trim();
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
}
