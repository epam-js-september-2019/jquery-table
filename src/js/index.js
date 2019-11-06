import './../sass/styles.scss';
import $ from 'jquery';
import MainController from './controllers/main-controller';
import TableStorage from './services/storage';
// import {items} from './mocks/mocks'; // Если нужны мок-данные

// Первым делом инициализирую хранилище
const STORAGE_KEY = `epam-tabel-rylkovAlex`;
const storage = new TableStorage(STORAGE_KEY);

// Дальше можно было бы отдельно сделать компоненты для tabel-controls и table-head, но я счёл это лишним и в данном проекте их разметка уже лежит в html-файле, поэтому нахожу нужный контейнер и подключаю главный контроллер.
const tBodyContainer = $(`.table__content`);
const mainController = new MainController(storage, tBodyContainer);
mainController.render();
