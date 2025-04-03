const fetch = require('node-fetch');

// Hämta trafikdata från Trafikverket API (exempel-URL)
async function getTrafficData() {
  try {
    const response = await fetch('https://api.trafikverket.se/v1/trafficdata');
    const data = await response.json();

    // Bearbeta och returnera data
    return data;
  } catch (error) {
    console.error('Fel vid hämtning av trafikdata:', error);
    throw new Error('Kan inte hämta trafikdata.');
  }
}

// Exportera funktionerna
module.exports = {
  getTrafficData
};
