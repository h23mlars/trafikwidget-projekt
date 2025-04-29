const countySelect = document.getElementById("county");
const locationSelect = document.getElementById("location");
let municipalityMap = {};

async function loadLocationData() {
  const res = await fetch("../location_data/municipalities_by_county.json");
  municipalityMap = await res.json();

  const counties = Object.keys(municipalityMap);
  counties.forEach(county => {
    const opt = document.createElement("option");
    opt.value = county;
    opt.textContent = county;
    countySelect.appendChild(opt);
  });
}

countySelect.addEventListener("change", () => {
  locationSelect.innerHTML = '<option disabled selected>Välj plats...</option>';
  locationSelect.disabled = false;

  const selectedCounty = countySelect.value;
  const municipalities = municipalityMap[selectedCounty] || [];

  municipalities.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    locationSelect.appendChild(opt);
  });
});

// 📨 Prenumerera via SMS
document.getElementById('subscribe-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone = document.getElementById('phone').value.trim();
  const county = countySelect.value;
  const location = locationSelect.value;
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const types = Array.from(checkboxes).map(cb => cb.value);
  const message = `📍 Trafikinfo för ${location}, ${county}: ${types.join(', ')}`;

  const res = await fetch('http://localhost:5000/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZGVtbzpkZW1v'
    },
    body: JSON.stringify({ to: phone, message })
  });

  const data = await res.json();
  document.getElementById("response-message").textContent =
    data.statusText || "Tack! Du är nu prenumerant.";
});

// 🚦 Testa trafikinfo från vald plats
document.getElementById("test-trafik")?.addEventListener("click", async () => {
  const location = locationSelect.value;
  if (!location) {
    alert("Välj en plats först.");
    return;
  }

  const res = await fetch("http://localhost:5000/trafikinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ municipality: location })
  });

  const result = await res.json();
  const list = result.results?.map(r =>
    `• ${r.Header || r.Message || r.MessageCode || "Okänd händelse"}`
  ) || [];

  document.getElementById("response-message").textContent =
    list.length > 0
      ? `🔍 Händelser i ${location}:\n${list.join("\n")}`
      : "Inga aktuella trafikstörningar hittades.";
});

loadLocationData();
