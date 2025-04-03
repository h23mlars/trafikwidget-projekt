// För att hämta användarens plats via GPS
function getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject("Kunde inte hämta plats: " + error.message);
          }
        );
      } else {
        reject("Geolocation är inte stödjat i den här webbläsaren.");
      }
    });
  }
  
  // För att hämta användarens plats manuellt (kan ersättas med formulär för input)
  function getManualLocation() {
    // Här kan du lägga till ett formulär för att hämta plats via textinput
    const location = prompt("Skriv in din plats:");
    return location;
  }
  
  // Exportera funktionerna
  module.exports = {
    getLocation,
    getManualLocation
  };
  