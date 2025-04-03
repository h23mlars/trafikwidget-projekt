const fetch = require('node-fetch');

async function getTrafficData() {
    const response = await fetch('https://api.trafikverket.se/v1/traffic-data-endpoint');
    const data = await response.json();
    console.log(data);
}

getTrafficData();
