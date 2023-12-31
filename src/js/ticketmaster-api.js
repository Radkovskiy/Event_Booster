export class TicketmasterAPI {
  #API_KEY = 'Q9CFEyEjiv8Qjj3437KJQDG0EEwybvXT';
  #BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events';

  constructor() {
    this.searchQuery = '';
    this.searchCountry = '';
    this.page = 0;
    this.size = 16;
  }

  async fetchTickets() {
    const serchParams = new URLSearchParams({
      apikey: this.#API_KEY,
      keyword: this.searchQuery,
      countryCode: this.searchCountry,
      page: this.page,
      size: this.size,
    });

    if (this.searchCountry === 'none') {
      this.searchCountry = ''
    }

    const response = await fetch(`${this.#BASE_URL}?${serchParams}`);

    if (!response.ok) {
      throw new Error(response.staus);
    }

    return response.json();
  }
}