import { ticketmasterAPI } from './index';

const selectCountry = document.querySelector('.countries__input')
const countriesList = document.querySelector('.countries__list')
const selected = document.querySelector('.countries__input');


selectCountry.addEventListener('click', onShowCountriesList)

function onShowCountriesList() {
  countriesList.classList.toggle('is-hidden');
}

export function chooseCountry() {
  const optionsList = document.querySelectorAll('.option');

  optionsList.forEach(element => {
    element.addEventListener('click', event => {
      selected.innerHTML = element.querySelector('label').innerHTML;
      ticketmasterAPI.searchCountry = event.target.id;
      // console.log(ticketmasterAPI.searchCountry);
      countriesList.classList.add('is-hidden');
    });
  });
}




