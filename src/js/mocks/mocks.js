import {getItemId} from "../utils/utils";

export const DELIVERY_OPTIONS = {
  Russia: [`Saratov`, `Moskov`, `St.Petersburg`],
  Belorus: [`Minsk`, `Gomel`, `Mogilev`],
  USA: [`New York`, `Los Angeles`, `Chicago`, `Philadelphia`],
  China: [`Shanghai`, `Beijing`, `Tianjin`, `Guangzhou`, `Dongguan`],
};

export const items = [
  {
    id: getItemId(),
    name: `Bosh`,
    email: `email@mail.ru`,
    count: 213,
    price: 150.25,
    country: `Belorus`,
    cities: [`Gomel`, `Mogilev`]
  },
  {
    id: getItemId(),
    name: `Panasonic`,
    email: `email@mail.ru`,
    count: 15,
    price: 100.3,
    country: `Belorus`,
    cities: [`Gomel`, `Mogilev`]
  },
  {
    id: getItemId(),
    name: `Electrolux`,
    email: `email@mail.ru`,
    count: 2,
    price: 300.99,
    country: `Belorus`,
    cities: [`Gomel`, `Mogilev`]
  },
  {
    id: getItemId(),
    name: `Lg-phone`,
    email: `email@mail.ru`,
    count: 20,
    price: 300,
    country: `Belorus`,
    cities: [`Gomel`, `Mogilev`]
  },
];
