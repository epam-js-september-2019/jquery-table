import {delay, debounce} from '../utils/utils';
import $ from 'jquery';
import EditModal from '../components/item-edit-modal';
import {changeMode} from './main-controller';
import Item from '../components/item';
import AlertModal from '../components/alert-modal';

const sortingType = {
  NAME_UP: `nameUp`,
  NAME_DOWN: `nameDown`,
  PRICE_UP: `priceUp`,
  PRICE_DOWN: `priceDown`,
};

const modalContainer = $(`.modalWindow`);

const getItemTemplate = () => {
  const newItem = {
    id: Date.now(), // просто мне нужны уникальные id для хранения в localStorage при создании новых.
    name: ``,
    email: ``,
    count: 0,
    price: 0,
    country: ``,
    cities: [],
  };
  return newItem;
};

export default class TabelController {
  constructor(tBodyContainer, onDataChange) {
    this._changeItemData = onDataChange;
    this._tBody = tBodyContainer;
    // решил, что TabelController будет управлять модалками:
    this._alertModal = new AlertModal(modalContainer);
    this._editModal = new EditModal(modalContainer);

    this._itemActiveComponent = null;
    this._items = null;
    this._isEmpty = true;
    this._emptyMessage = $(`
      <tr class="no-items">
        <td colspan="3" class="align-middle">Sorry, No Items in Table... Press "Add new" to add Item!</td>
      </tr>`.trim());
    this._sortingMode = null;
    this._itemComponents = [];

    this._subscribeOnEvents();
  }

  render(items) {
    this._items = items; // записываем новые данные
    this._clear(); // очищаю содержимое
    if (!this._items.length) { // если пусто показываю сообщение
      this._isEmpty = true;
      this._tBody.append(this._emptyMessage);
      return;
    }
    this._sort(this._sortingMode); // сортирую, как нужно, если до этого была сортировка

    delay(150).then(() => { // отрисовка с небольшой задержкой
      items.forEach((item) => {
        const itemComponent = new Item(item);
        this._itemComponents.push(itemComponent);
        this._tBody.append(itemComponent.getElement());
      });
    });
  }

  createNew() {
    this._editModal.open(getItemTemplate(), this._onSaveNewClick.bind(this));
  }

  _renderNew(item) {
    if (this._isEmpty) {
      this._emptyMessage.remove();
    }
    const itemComponent = new Item(item);
    this._itemComponents.push(itemComponent);
    this._tBody.append(itemComponent.getElement());
    // и т.к. новая добавляется в конец, то сортировка перестаёт соблюдаться, поэтому:
    $(`.tabel__sort-type`).addClass(`visually-hidden`);
  }

  _clear() {
    this._tBody.empty();
  }

  _subscribeOnEvents() {
    // Обработчик на сортировку
    const priceIcon = $(`#price-sort-icon`);
    const nameIcon = $(`#name-sort-icon`);
    const onSortClickHandler = (evt) => {
      if (evt.currentTarget.tagName !== `A`) {
        return;
      }
      switch (evt.currentTarget.id) {
        // TODO: мб упростить манипуляцию классами...
        case `sort-by-name`:
          priceIcon.addClass(`visually-hidden`);
          nameIcon.removeClass(`visually-hidden`);
          nameIcon.toggleClass(`tabel__sort-type--up`);
          nameIcon.toggleClass(`tabel__sort-type--down`);
          if (nameIcon.hasClass(`tabel__sort-type--up`)) {
            this._sortingMode = sortingType.NAME_UP;
          } else {
            this._sortingMode = sortingType.NAME_DOWN;
          }
          break;
        case `sort-by-price`:
          nameIcon.addClass(`visually-hidden`);
          priceIcon.removeClass(`visually-hidden`);
          priceIcon.toggleClass(`tabel__sort-type--up`);
          priceIcon.toggleClass(`tabel__sort-type--down`);
          if (priceIcon.hasClass(`tabel__sort-type--up`)) {
            this._sortingMode = sortingType.PRICE_UP;
          } else {
            this._sortingMode = sortingType.PRICE_DOWN;
          }
          break;
      }
      this.render(this._items);
    };
    $(`.tabel__column-name`).click(debounce(onSortClickHandler, 500));

    // вешаю обработчик на клик по tBody с небольшим debounce, чтоб всё нормально отрабатывало:
    this._tBody.click(debounce(this._onTableContentClick.bind(this), 500));
  }

  // обработчик на клик по tBody - один на всю таблицу
  _onTableContentClick(evt) {
    if (!(evt.target.tagName === `A`) && !(evt.target.tagName === `BUTTON`)) {
      return;
    }

    const itemElement = evt.target.closest(`.tabel__item`);
    if (!itemElement) {
      throw new Error(`Can't find item-DOM-element`);
    }

    const activeComponentIndex = this._itemComponents.findIndex((component) => component.getId() === +itemElement.id);
    this._itemActiveComponent = this._itemComponents[activeComponentIndex];
    const itemData = this._itemActiveComponent.getItemData();
    switch (evt.target.dataset.action) {
      case changeMode.EDIT:
        this._editModal.open(itemData, this._onSaveClick.bind(this, activeComponentIndex));
        break;
      case changeMode.DEL:
        this._alertModal.open(this._itemActiveComponent.getName(), this._onDeleteClick.bind(this, activeComponentIndex));
        break;
      default:
        break;
    }
  }

  // Обработчик SAVE для передачи в EditModal
  _onSaveClick(componentIndex) {
    const newItemData = this._editModal.getFormData();
    const newItem = new Item(newItemData);
    delay(200).then(() => {
      this._changeItemData(newItemData, changeMode.EDIT);
      this._itemActiveComponent.getElement().replaceWith(newItem.getElement());
    });
    this._itemComponents[componentIndex] = newItem;
  }

  // Обработчик на DELETE-action
  _onDeleteClick(componentIndex) {
    this._itemActiveComponent.getElement()
        .css({
          opacity: `0`,
        });
    this._itemComponents.splice(componentIndex, 1);
    delay(300).then(() => {
      this._changeItemData(this._itemActiveComponent.getItemData(), changeMode.DEL);
      this._itemActiveComponent.getElement().remove();
      if (!this._items.length) {
        this._isEmpty = true;
        this._tBody.append(this._emptyMessage);
        return;
      }
    });
  }

  // обработчик Save для передачи в EditModal при создании new Item
  _onSaveNewClick() {
    const newItemData = this._editModal.getFormData();
    delay(200).then(() => {
      this._changeItemData(newItemData, changeMode.NEW);
      this._renderNew(newItemData);
    });
  }

  _sort(sortType) {
    switch (sortType) {
      case sortingType.NAME_UP:
        this._items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case sortingType.NAME_DOWN:
        this._items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case sortingType.PRICE_UP:
        this._items.sort((a, b) => a.price - b.price);
        break;
      case sortingType.PRICE_DOWN:
        this._items.sort((a, b) => b.price - a.price);
        break;
      default:
        return;
    }
  }

}
