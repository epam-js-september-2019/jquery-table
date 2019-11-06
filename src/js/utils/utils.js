/* пункт ТЗ: Все действия с товарами должны происходить асинхронно. Вместо результата нужно
возвращать промис, который автоматически резолвится через какое-то время в setTimeout */
/**
 * возвращает промис через заданную задержку
 * @param {number} ms - задержка
 * @return {promise}
 */
export const delay = (ms) => {
  return new Promise((r) => {
    setTimeout(() => r(), ms);
  });
};

// Интереса ради, попробовал интератор для ID мокам:
function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}
const idIterator = idGenerator();
export const getItemId = () => {
  return idIterator.next().value;
};

// Обычный debounce:
export const debounce = (f, ms) => {
  let isCooldown = false;
  return function (...args) {
    if (isCooldown) {
      return;
    }
    // eslint-disable-next-line no-invalid-this
    f.apply(this, args);
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false;
    }, ms);
  };
};
