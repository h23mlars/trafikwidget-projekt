const fakeData = [
    { location: "Luleå", type: "Olycka", time: "08:30" },
    { location: "Boden", type: "Halka", time: "09:15" }
  ];
  
  let html = "<ul>";
  fakeData.forEach(event => {
    html += `<li>${event.type} i ${event.location} kl ${event.time}</li>`;
  });
  html += "</ul>";
  
  document.getElementById("traffic-output").innerHTML = html;
  