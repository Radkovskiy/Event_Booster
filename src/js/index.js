import countrySelector from './country-selector';
import { chooseCountry } from './country-selector';
import { TicketmasterAPI } from './ticketmaster-api';
import iconClose from '../images/close.svg'

const serchQuery = document.querySelector('.header__input');
const selectEl = document.querySelector('.header__select');
const searchForm = document.querySelector('.header__form');
const eventsList = document.querySelector('.events__list');
const selectCountry = document.querySelector('.countries__wrapp')
const countriesList = document.querySelector('.countries__list')
const backdrop = document.querySelector('.backdrop')
const modalEl = document.querySelector('.modal')
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
const pagesEl = document.querySelector('.events__pages')
let totalPages = 0


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

  // if (countryBefore === 'none') {
  //   countryBefore = ''
  // }
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
    // console.log(response);
    const baseMarkup = response._embedded.events
    totalPages = response.page.totalPages
    // eventsList.innerHTML = baseMarkup.map(({
    //   images: { [5]: { url: previewImgUrl } } = {},
    //   name,
    //   priceRanges: { [0]: { min: minPrice, max: maxPrice, currency, type } = {} } = {},
    //   accessibility: { info } = {},
    //   dates: { start: { localDate, localTime } } = {},
    //   _embedded: { venues: { [0]: { name: nameOfThePlace, timezone, city: { name: nameOfCity } = {}, country: { name: nameOfCountry } = {} } = {} } = {} } = {}
    // }) => {
    eventsList.innerHTML = baseMarkup.map((baseMarkup) => {
      const noInfo = "иди нахуй"
      const isVenues = baseMarkup?._embedded?.venues
      const venues = isVenues?.length && isVenues[0]
      // console.log(baseMarkup);

      const isPriceRanges = baseMarkup?.priceRanges
      const priceRanges = isPriceRanges?.length && isPriceRanges[0]

      const name = baseMarkup.name || noInfo
      const info = baseMarkup?.accessibility?.info || noInfo;
      const localDate = baseMarkup?.dates?.start?.localDate || noInfo;
      const localTime = baseMarkup?.dates?.start?.localTime || noInfo;
      const nameOfThePlace = venues?.name || noInfo;
      const timezone = venues?.timezone || noInfo;
      const nameOfCity = venues?.city?.name || noInfo;
      const nameOfCountry = venues?.country?.name || noInfo;
      const minPrice = priceRanges?.min || noInfo;
      const maxPrice = priceRanges?.max || noInfo;
      const currency = priceRanges?.currency || noInfo;
      const type = priceRanges?.type || noInfo;
      const previewImgUrl = baseMarkup?.images[5]?.url || noInfo;


      // console.log(info);
      const cardData = {
        info, localDate, localTime, timezone, nameOfCity, nameOfCountry,
        name, minPrice, maxPrice, maxPrice, currency, type, previewImgUrl,
        localDate, localDate, nameOfThePlace
      }
      const encodedCardData = encodeURIComponent(JSON.stringify(cardData));


      // console.dir(cardData);
      return `
          <li class="events__item list" data-list=${encodeURIComponent}>
              <img class="events__img" src="${previewImgUrl}" alt="" width="120" height="120">
              <h2 class="events__name">${name}</h2>
              <p class="events__date">${localDate}</p>
              <p class="events__nameOfThePlace">${nameOfThePlace}</p>
          </li>`
    }).join('')

    // paginal(ticketmasterAPI.page)

  } catch (error) {
    // Report.failure(
    //   'Error',
    //   'Sorry, no matches were found. Try a new search or use our suggestions.',
    //   'Okay'
    // );
    console.error(error);
  }
}

eventsList.addEventListener('click', openModal)

function openModal({ target, currentTarget }) {
  const eventItemEl = document.querySelector('.events__item')
  // console.dir(target.classList.contains('events__card'));

  if (target.parentNode !== eventItemEl) {
    return
  }
  backdrop.classList.remove('is-hidden')
  console.log(target.parentNode);

  const data = target.dataset.list;
  // console.dir(data);

  // console.log(data.timezone);
  // повесить слушателя на див
  const modalHtml = `
  <div class="modal__closeWrapp">
    <img class="modal__close" width="24" height="24" src="${iconClose}" alt="">
  </div>
  <img class="modal__img" src="${target.src}" alt="${data.name}" width="100" height="100px">
  <img class="modal__bigImg" src="${target.src}" alt="${data.name}" width="100" height="100px">
  <div class="modal__info modal__div">
    <h2>INFO</h2>
    <p>${data.info}</p>
  </div>
  <div class="modal__timeDate modal__div">
    <h2>WHEN</h2>
    <p class="modal__date">${data.date}</p>
    <p>${data.time} (${data.timezone})</p>
  </div>
  <div class="modal__location modal__div">
    <h2>WHERE</h2>
    <p>${data.city}, ${data.country}</p>
  </div>
  <div class="modal__afterWhereWrapp">
  <div class="modal__name modal__div">
  <h2>WHO</h2>
  <p>${data.name}</p>
</div>
<div class="modal__price modal__div"price>
  <h2 class="modal__priceTitle">PRICES</h2>
  <div class="modal__standartPrice modal__div">
    <p>Standart ${data.minprice} ${data.currency}</p>
    <button class="modal__standartBtn modal__button">BUY TICKETS</button>
  </div>
  <div class="modal__vipPrice modal__div">
    <p>VIP ${data.maxprice} ${data.currency}</p>
    <button class="modal__button">BUY TICKETS</button>
  </div>
</div>
<button class="modal__buttonMore modal__button">MORE FROM THIS AUTHOR</button>
</div>`

  modalEl.innerHTML = modalHtml

  const closeBtn = document.querySelector('.modal__closeWrapp')

  document.body.style.overflow = 'hidden';
  modalEl.addEventListener('wheel', preventScroll);

  closeBtn.addEventListener('click', closeModal)
  document.addEventListener('keydown', closeModal)
  document.addEventListener('click', closeModal)

  function closeModal(e) {
    // 🟠почему e.currentTarget - это див?
    if (e.target === backdrop ||
      e.currentTarget === closeBtn ||
      e.code === "Escape") {
      // console.log(123);
      backdrop.classList.add('is-hidden')
      document.removeEventListener('keydown', closeModal)
      document.removeEventListener('click', closeModal)

      document.body.style.overflow = '';
      modalEl.removeEventListener('wheel', preventScroll);
    }
  }
}



function preventScroll(event) {
  // Предотвращаем прокрутку на основной странице
  event.stopPropagation();
}
// функция должна рендерить лишки с номерами страниц
// function paginal(currentPage) {

//   let pagesArr = []


//   if (totalPages === 1) {
//     list.innerHTML = '';
//     return;
//   }

//   for (let i = 1; i <= totalPages; i++) {  // вместо "3" ебануть переменную "totalPages"
//     pagesArr.push(`<button class="paginalBtn">${i}</button>`)
//   }
//   // console.log(pagesArr);
//   const paginalBtn = document.querySelector('.paginalBtn')
//   paginalBtn.addEventListener('click', callback)
//   function callback(numPage) {
//     try {
//       console.log(ticketmasterAPI.page);
//       // const response = await ticketmasterAPI.fetchTickets();
//       // const baseMarkup = response._embedded.events
//       // eventsList.innerHTML = baseMarkup.map(({ images: { [5]: { url: previewImgUrl } }, name, dates: { start: { localDate } }, _embedded: { venues: { [0]: { name: nameOfThePlace } } } }) => {
//       //   return `
//       //       <li class="events__item list">
//       //         <div class="events__card">
//       //           <img class="events__img" src="${previewImgUrl}" alt="" width="120" height="120">
//       //           <h2 class="events__name">${name}</h2>
//       //           <p class="events__date">${localDate}</p>
//       //           <p class="events__nameOfThePlace">${nameOfThePlace}</p>
//       //         </div>
//       //       </li>`
//       // }).join('')
//     } catch (error) {
//       Report.failure(
//         'Error',
//         'Sorry, no matches were found. Try a new search or use our suggestions.',
//         'Okay'
//       );
//       console.log(err);
//     }
//     pagesEl.innerHTML = pagesArr.join('')
//   }

function renderCountries(arr) {
  const html = arr.map(({ code, name }) => {
    return `
      <li class="option list">
        <input type="radio" class="radio" name="category" id="${code}">
        <label for="${code}">${name}</label>
      </li>`
  }).join('')
  countriesList.innerHTML = `
  <li class="option list">
        <input type="radio" class="radio" name="category" id="none">
        <label for="none">Choose country</label>
      </li>
  ${html}`;
  chooseCountry()
}


// 🟢 Сделать так, что бы при новом поиске, все стиралось и рендерилось заново;
// 🟢 Использовать слайс или цсс для максимальной ширины строки;
  // сделал, но помещается текст только одной строки
// 🟢 Добавить поиск по странам
  // 🟢сделать див с названиями стран и их id в дата атрибутах
  // 🟢добавить класс хидден и тогглить его по нажатию на див или на страну
  // 🟢сохранить id выбранной страны в value и передавать его в ticketmasterAPI
// 🟢 Перестал работать фетч
// 🟢 Модалка;
  // 🟢скролл внутри модалки не работает - дать оверфлоу скролл бекдропу и опустить модалку
  // 🟢крестика не видно и слушатель на него не вешается
  // 🟢некоторые свойства ундефайнд - заменить на дефолтное значение
  // 🟢запихать текст в дивы и расставить отступы от дивов, а не от пешек
  // 🟢при клике на картинку после переагрузки страницы, бывает, что
  //    в консоль два раза выводится значение. Мб нужно тогглить евнтлистнер
  //    по мере открытия/закрытия модалки? — жестко перезагружать после каждой правки
  // 🟢шрифты для адаптива
  // 🔴поставить свг штрихкоды на прайсы
  // 🔴модалка открывается по нажатию на картинку, а не на див
  // 🔴адаптив модалки - при таблетке и при десктопе должно быть разное положение дивов
// 🔴 Пагинация;
  // 🔴 нужна юлка и столько лишек, сколько страничек прикодит от бека
  // 🔴 в каждой лишке ссылка на соответствующую страничку
// 🔴 пофиксить див со странами
  // 🟢 если я открыл див со странами, то при нражатии на любую точку вьюпорта,
  //     кроме этого дива, повесить на него из-хиден
  // 🔴 свг пропадает при выборе страны
  // 🟢 добавить возможность выбрать нейтральный вариант, что удалит из
  //     запрса какую либо страну
// 🔴 растянуть максимальную высоту строки (в две строки), что бы, в случае привышения
//     размера строки, текст елся тремя точками


