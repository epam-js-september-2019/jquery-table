// Класс для хранения данных
export default class TableStorage {
  constructor(storageKey) {
    this._key = storageKey;
    if (!window.localStorage.getItem(this._key)) {
      this.setData([]);
    }
  }

  setData(data) {
    try {
      return window.localStorage.setItem(this._key, JSON.stringify(data));
    } catch (e) {
      throw new Error(`Store error: ${e}`);
    }
  }

  getData() {
    const json = window.localStorage.getItem(this._key);
    return window.JSON.parse(json);
  }
}
