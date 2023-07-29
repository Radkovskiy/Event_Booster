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
import { countries } from './constants'
const pagesEl = document.querySelector('.events__pages')
let totalPages = 0


export const ticketmasterAPI = new TicketmasterAPI();

let countryBefore = null;

renderCountries(countries)
renderBaseMarkup()
// кинул евентлистнер на форму, а не на инпут
searchForm.addEventListener('submit', onSerchQuerySubmit);
pagesEl.addEventListener('click', fetchAnotherPage)

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


      // console.log(JSON.parse(decode));
      // console.log(encodedCardData);
      return `
          <li class="events__item list" data-list=${encodedCardData}>
              <img class="events__img" src="${previewImgUrl}" alt="" width="120" height="120">
              <h2 class="events__name">${name.slice(0, 30)}${name.length > 30 && '...'}</h2>
              <p class="events__date">${localDate}</p>
              <p class="events__nameOfThePlace">${nameOfThePlace}</p>
          </li>`
    }).join('')

    renderPaginal(ticketmasterAPI.page)

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

function openModal({ target }) {
  if (target.nodeName === 'UL') {
    return
  }

  let data = null

  if (target.nodeName === 'LI') {
    data = target.dataset.list;
  } else {
    data = target.parentNode.dataset.list;
  }
  const parce = JSON.parse(decodeURIComponent(data))
  // console.log(parce);
  backdrop.classList.remove('is-hidden')
  const { name, previewImgUrl, info, localDate, localTime, timezone, nameOfCity, nameOfCountry, minPrice, maxPrice, currency } = parce;

  const modalHtml = `
  <div class="modal__closeWrapp">
    <img class="modal__close" width="24" height="24" src="${iconClose}" alt="">
  </div>
  <img class="modal__img" src="${previewImgUrl}" alt="${name}" width="100" height="100px">
  <div class="modal__firstWrapp">
    <img class="modal__bigImg" src="${previewImgUrl}" alt="${name}" width="100" height="100px">
    <div class="">
      <div class="modal__info modal__div">
        <h2>INFO</h2>
        <p>${info}</p>
      </div>
      <div class="modal__timeDate modal__div">
        <h2>WHEN</h2>
        <p>${localDate}</p>
        <p>${localTime} (${timezone})</p>
      </div>
      <div class="modal__location-desktop modal__div">
        <h2>WHERE</h2>
        <p>${nameOfCity}, ${nameOfCountry}</p>
      </div>
    </div>
  </div>
  <div class="modal__afterWhereWrapp">
    <div class="modal__location-tablet modal__div">
        <h2>WHERE</h2>
        <p>${nameOfCity}, ${nameOfCountry}</p>
      </div>
    <div class="modal__name modal__div">
       <h2>WHO</h2>
       <p>${name}</p>
     </div>
    <div class="modal__price modal__div" price>
     <h2 class="modal__priceTitle">PRICES</h2>
     <div class="modal__standartPrice modal__div">
      <svg class="barcode" width="24" height="16">
        <use href="../images/event_booster.svg#icon-barcode"></use>
      </svg>
      <p class="priceText">Standart ${minPrice} ${currency}</p>
       <button class="modal__standartBtn modal__button">BUY TICKETS</button>
     </div>
     <div class="modal__vipPrice modal__div">
      <svg class="barcode" width="24" height="16">
        <use href="../images/event_booster.svg#icon-barcode"></use>
      </svg>
      <p class="priceText">VIP ${maxPrice} ${currency}</p>
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
//
function renderPaginal(ticketPage) {

  const currentPage = Number(ticketPage)
  let btnsArr = []


  if (totalPages === 1) {
    list.innerHTML = '';
    return;
  }

  for (let i = 1; i <= totalPages; i++) {
    btnsArr.push(`<button class="paginalBtn ${currentPage === i || currentPage === 0 && i === 1 ? 'activePage' : ''}">${i}</button>`)
  }
  if (totalPages <= 5 && totalPages > 0) {
    pagesEl.innerHTML = btnsArr.join('');
  } else if (totalPages > 0) {
    if (currentPage >= totalPages - 3) {
      pagesEl.innerHTML =
        btnsArr[0] +
        '...' +
        btnsArr[currentPage - 1] +
        btnsArr[currentPage - 2] +
        btnsArr.slice(currentPage, currentPage + 3).join('');
    } else if (currentPage > 0 && currentPage < 2) {
      pagesEl.innerHTML =
        btnsArr[currentPage - 1] +
        btnsArr.slice(currentPage, currentPage + 2).join('') +
        '...' +
        btnsArr[totalPages - 1];
    } else if (currentPage === 2) {
      pagesEl.innerHTML =
        btnsArr[0] +
        btnsArr[currentPage - 1] +
        btnsArr.slice(currentPage, currentPage + 2).join('') +
        '...' +
        btnsArr[totalPages - 1];
    } else if (currentPage > 2) {
      const list = currentPage !== 3 ? btnsArr[0] +
        '...' +
        btnsArr[currentPage - 2] +
        btnsArr[currentPage - 1] +
        btnsArr.slice(currentPage, currentPage + 1).join('') +
        '...' +
        btnsArr[totalPages - 1] : btnsArr[0] +
        btnsArr[currentPage - 2] +
        btnsArr[currentPage - 1] +
        btnsArr.slice(currentPage, currentPage + 1).join('') +
        '...' +
      btnsArr[totalPages - 1];
      pagesEl.innerHTML = list
    } else {

      pagesEl.innerHTML =
        btnsArr.slice(currentPage, currentPage + 3).join('') +
        '...' +
        btnsArr[totalPages - 1];
    }
  } else {
    pagesEl.innerHTML =
      btnsArr.slice(currentPage, currentPage + 3).join('') +
      '...' +
      btnsArr[totalPages - 1];
  }
}

function fetchAnotherPage(e) {
  e.preventDefault()
  if (e.target.nodeName !== 'BUTTON') {
    return
  }
  ticketmasterAPI.page = e.target.textContent
  renderBaseMarkup();
}

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

// 🔴 сделать красивый error
// 🔴 разсортировать блоки кода по отдельным файлам
// 🔴 Модалка;
  // 🔴поставить свг штрихкоды на прайсы - поставил, но их не видно
  // 🔴модалку опускать ниже нужно только, когда ивент имеет очень много
  //    текста в инфо, только тогда можалка уходит наверх. Если же ивент
  //    имеет мало текста в инфо, то модалка спускается неестественно низко. Плюс к этому,
  //    сверху модалки много места и видно бекдроп, в то же время, модалка прислонена к низу
  //    сайта, получается несиметрично и некрасиво. Пробовал давать паддинги/марджаны и
  //    бекдропу и модалке — ничего не меняется.
  //    Как всё это пофиксить?
  // 🟢если нажать чуть правее картинки, то она не будет подгружаться в модалку
  // 🟢скролл внутри модалки не работает - дать оверфлоу скролл бекдропу и опустить модалку
  // 🟢крестика не видно и слушатель на него не вешается
  // 🟢некоторые свойства ундефайнд - заменить на дефолтное значение
  // 🟢запихать текст в дивы и расставить отступы от дивов, а не от пешек
  // 🟢при клике на картинку после переагрузки страницы, бывает, что
  //    в консоль два раза выводится значение. Мб нужно тогглить евнтлистнер
  //    по мере открытия/закрытия модалки? — жестко перезагружать после каждой правки
  // 🟢шрифты для адаптива
  // 🟢модалка открывается по нажатию на картинку, а не на див
  // 🟢адаптив модалки - при таблетке и при десктопе должно быть разное положение дивов
// 🟢 Сделать так, что бы при новом поиске, все стиралось и рендерилось заново;
// 🟢 Использовать слайс или цсс для максимальной ширины строки;
  // сделал, но помещается текст только одной строки
// 🟢 Добавить поиск по странам
  // 🟢сделать див с названиями стран и их id в дата атрибутах
  // 🟢добавить класс хидден и тогглить его по нажатию на див или на страну
  // 🟢сохранить id выбранной страны в value и передавать его в ticketmasterAPI
// 🟢 Перестал работать фетч
// 🟢 Пагинация;
  // 🟢 подсвечивать currentPage на первой страничке в условии № 2
  // 🟢 подсвечивать currentPage
  // 🟢 три точки между страничками, если их много
  // кажется, что в при запросе на нба и нажатии на странички, никакого запроса не
  // происходит но в нетворке все заебись(фетч с номером запрашиваемой страницы и статус ОК)
  // 🟢 нужен див и столько баттанов, сколько страничек прикодит от бека
  // 🟢 в каждой лишке ссылка на соответствующую страничку
// 🟢 пофиксить див со странами
  // 🟢 свг лепится сверху даже моалки, при том, что
  //     у свг z-index: 1, а у модлаки — 999
  // 🟢 если я открыл див со странами, то при нражатии на любую точку вьюпорта,
  //     кроме этого дива, повесить на него из-хиден
  // 🟢 свг пропадает при выборе страны
  // 🟢 добавить возможность выбрать нейтральный вариант, что удалит из
  //     запрса какую либо страну
// 🟢 растянуть максимальную высоту строки (в две строки), что бы, в случае привышения
//     размера строки, текст елся тремя точками.
//     🟢Слайс сделал, но как по условию добавить 3 точки — хз