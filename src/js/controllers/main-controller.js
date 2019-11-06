import $ from 'jquery';
import TabelController from './table-controller';

export const changeMode = {
  EDIT: `edit`,
  DEL: `del`,
  NEW: `new`
};

export default class MainController {
  constructor(strage, tabelBodyContainer) {
    this._storage = strage;
    this._items = this._storage.getData();
    this._onDataChange = this._onDataChange.bind(this);

    this._tableController = new TabelController(tabelBodyContainer, this._onDataChange);
    this._subscribeOnEvents();
  }

  render() {
    this._tableController.render(this._items);
  }

  // колбэк на изменение данных
  _onDataChange(newData, mode) {
    const index = this._items.findIndex((item) => item.id === newData.id);
    switch (mode) {
      case changeMode.EDIT:
        this._items[index] = newData;
        break;
      case changeMode.DEL:
        this._items.splice(index, 1);
        break;
      case changeMode.NEW:
        this._items.push(newData);
        break;
      default:
        throw new Error(`wrong mode!`);
    }
    this._storage.setData(this._items);
  }

  // т.к. кнопки реализованы через <button> то click срабатывает и при нажатии на Enter на клавиатуре, когда кнопка в фокусе, поэтому отдельно на enter обработчики не вешаю (этот пункт ТЗ пропускаю)
  _subscribeOnEvents() {
    const searchBtn = $(`.controls__search-button`);
    const showAllBtn = $(`.controls__showall-button`);
    const addNew = $(`.controls__add-button`);
    const searchInput = $(`.controls__search-input`);

    // Очищаю при фокусе
    searchInput.on(`focus`, () => {
      searchInput.val(``);
      searchInput.removeClass(`controls__search-input--wrong`);
    });

    addNew.click(() => {
      // если клик произошёл в режиме поиска, то сперва возвращаюсь в обычный режим:
      if (!showAllBtn.hasClass(`visually-hidden`)) {
        showAllBtn.trigger(`click`);
      }
      this._tableController.createNew();
    });

    searchBtn.click((e) => {
      e.preventDefault();
      const itemsToRender = this._items.filter((item) => item.name.toLowerCase().includes(searchInput.val().toLowerCase()));
      showAllBtn.removeClass(`visually-hidden`);
      if (!itemsToRender.length) {
        searchInput.val(`Совпадений не найдено!`);
        searchInput.addClass(`controls__search-input--wrong`);
      }
      this._tableController.render(itemsToRender);
    });

    showAllBtn.click(() => {
      showAllBtn.addClass(`visually-hidden`);
      this._tableController.render(this._items);
    });
  }

}
