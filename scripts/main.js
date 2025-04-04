import { initSignupForm } from './signup.js';

// 🌍 Dynamisk basePath – funkar både lokalt och på GitHub Pages
const isLocalhost = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
const basePath = isLocalhost ? '' : '/trafikwidget-projekt';

// ⛅ Fejkdata – används t.ex. i startsida
const fakeData = [
  { location: "Luleå", type: "Olycka", time: "08:30" },
  { location: "Boden", type: "Halka", time: "09:15" }
];

const outputDiv = document.getElementById("traffic-output");
if (outputDiv) {
  let html = "<ul>";
  fakeData.forEach(event => {
    html += `<li>${event.type} i ${event.location} kl ${event.time}</li>`;
  });
  html += "</ul>";
  outputDiv.innerHTML = html;
}

// 👉 Sätt rätt iframe-URL baserat på miljö
const widget = document.getElementById("traffic-widget");
if (widget) {
  widget.src = `${basePath}/widget/widget.html`;
}

// 🧠 Lyssna på postMessage från widgeten
window.addEventListener("message", async function (event) {
  if (event.data.type === "resize" && event.data.height) {
    const iframe = document.getElementById("traffic-widget");
    iframe.style.height = event.data.height + "px";
  }

  if (event.data.type === "open-signup") {
    const main = document.getElementById("main-content");
    if (!main) return;

    try {
      const res = await fetch(`${basePath}/components/signup.html`);
      const html = await res.text();
      main.innerHTML = html;
      initSignupForm(); // 💥 Nu körs Supabase-login
    } catch (err) {
      main.innerHTML = `<p style="color:red">Kunde inte ladda formuläret.</p>`;
      console.error("Fel vid fetch av signup.html:", err);
    }
  }
});
