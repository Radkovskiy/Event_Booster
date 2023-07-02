import countrySelector from './country-selector';
import { chooseCountry } from './country-selector';
import { TicketmasterAPI } from './ticketmaster-api';

const serchQuery = document.querySelector('.header__input');
const selectEl = document.querySelector('.header__select');
const searchForm = document.querySelector('.header__form');
const eventsList = document.querySelector('.events__list');
const selectCountry = document.querySelector('.countries__input')
const countriesList = document.querySelector('.countries__list')
const countries = [
  { code: "US", name: "United States Of America" },
  { code: "AD", name: "Andorra" },
  { code: "AI", name: "Anguilla" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BB", name: "Barbados" },
  { code: "BE", name: "Belgium" },
  { code: "BM", name: "Bermuda" },
  { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EE", name: "Estonia" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GB", name: "Great Britain" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MY", name: "Malaysia" },
  { code: "MT", name: "Malta" },
  { code: "MX", name: "Mexico" },
  { code: "MC", name: "Monaco" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" },
  { code: "AN", name: "Netherlands Antilles" },
  { code: "NZ", name: "New Zealand" },
  { code: "ND", name: "Northern Ireland" },
  { code: "NO", name: "Norway" },
  { code: "PE", name: "Peru" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "LC", name: "Saint Lucia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "RS", name: "Serbia" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ZA", name: "South Africa" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" }
];


export const ticketmasterAPI = new TicketmasterAPI();

let countryBefore = null;

renderCountries(countries)
renderBaseMarkup()
// кинул евентлистнер на форму, а не на инпут
searchForm.addEventListener('submit', onSerchQuerySubmit);

// запрос на бек
async function onSerchQuerySubmit(e) {
  e.preventDefault();

  const searchValue = e.currentTarget.elements.serchQuery.value;
  let searchQuery = ticketmasterAPI.searchQuery;


  if (
    searchQuery === searchValue && searchValue &&
    countryBefore === ticketmasterAPI.searchCountry
  ) {
    return;
  }

  countryBefore = ticketmasterAPI.searchCountry;
  ticketmasterAPI.searchQuery = searchValue;
  ticketmasterAPI.page = 0;

  renderBaseMarkup();
}
// рендер ивентов
async function renderBaseMarkup() {
  try {
    // нужен await, иначе вернется пуской промис, так как, он не будет
    // ждать выполнения запроса на бек
    const response = await ticketmasterAPI.fetchTickets();
    const baseMarkup = response._embedded.events
    const totalPages = response.page.totalPages
    eventsList.innerHTML = baseMarkup.map(({ images: { [5]: { url: previewImgUrl } }, name, dates: { start: { localDate } }, _embedded: { venues: { [0]: { name: nameOfThePlace } } } }) => {
      return `
          <li class="events__item list">
            <div class="events__card">
              <img class="events__img" src="${previewImgUrl}" alt="" width="120" height="120">
              <h2 class="events__name">${name}</h2>
              <p class="events__date">${localDate}</p>
              <p class="events__nameOfThePlace">${nameOfThePlace}</p>
            </div>
          </li>`
    }).join('')

    paginal()

  } catch (error) {
    Report.failure(
      'Error',
      'Sorry, no matches were found. Try a new search or use our suggestions.',
      'Okay'
    );
    console.log(err);
  }
}

// функция должна рендерить лишки с номерами страниц
function paginal() {
  console.log(totalPages);

  const totalItems = response.length; // Общее количество элементов
  const totalPages = Math.ceil(totalItems / pageSize); // Рассчитываем общее количество страниц
}

function renderCountries(arr) {
  const html = arr.map(({ code, name }) => {
    return `
        <li class="option list">
          <input type="radio" class="radio" name="category" id="${code}">
          <label for="${code}">${name}</label>
        </li>`
  }).join('')
  countriesList.innerHTML = html;
  chooseCountry()
}

// 🟢 Сделать так, что бы при новом поиске, все стиралось и рендерилось заново;
// 🟢 Использовать слайс или цсс для максимальной ширины строки;
  // сделал, но помещается текст только одной строки
// 🟢 Добавить поиск по странам
  // 🟢сделать див с названиями стран и их id в дата атрибутах
  // 🟢добавить класс хидден и тогглить его по нажатию на див или на страну
  // 🟢сохранить id выбранной страны в value и передавать его в ticketmasterAPI
// 🔴 Пагинация;
  // 🔴 нужна юлка и столько лишек, сколько страничек прикодит от бека
  // 🔴 в каждой лишке ссылка на соответствующую страничку
// 🔴 пофиксить див со странами
  // 🔴 если я открыл див со странами, то при нражатии на любую точку вьюпорта,
  //     кроме этого дива, повесить на него из-хиден
  // 🔴 ввести поиск вречную по странам
// 🔴 растянуть максимальную высоту строки (в две строки), что бы, в случае привышения
//     размера строки, текст елся тремя точками


// импорт countrySelector нигде не юзается, это норм?