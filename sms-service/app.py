from flask import Flask, request, jsonify
from sms import send_sms
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)

# 🔧 Funktion för att spara prenumerationer
def save_subscription(phone, location):
    path = "subscriptions.json"
    
    # Om filen inte finns, skapa den med en tom lista
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)

    with open(path, "r") as f:
        data = json.load(f)

    data.append({"phone": phone, "location": location})

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# 🚪 API-route för att ta emot prenumeration
@app.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.json
    phone = data.get("phone")
    location = data.get("location")

    if not phone or not location:
        return jsonify({"error": "Phone and location required"}), 400

    # ✅ Spara prenumerationen
    save_subscription(phone, location)

    # ✅ Skicka (eller mocka) SMS
    message = f"Tack! Du är nu prenumerant på trafikinfo för {location} 🚦"
    send_sms(phone, message)

    return jsonify({"status": "ok", "message": f"SMS skickat till {phone}"}), 200




# Broadcast

@app.route("/broadcast", methods=["POST"])
def broadcast():
    data = request.json
    location_filter = data.get("location")  # Valfritt filter
    alert_message = data.get("message")

    if not alert_message:
        return jsonify({"error": "Message required"}), 400

    # Läs prenumerationer
    with open("subscriptions.json", "r") as f:
        subscriptions = json.load(f)

    sent = []

    for sub in subscriptions:
        phone = sub["phone"]
        location = sub["location"]

        if location_filter and location_filter.lower() != location.lower():
            continue  # Hoppa över andra områden

        personalized = f"[Trafikvarning {location}] {alert_message}"
        send_sms(phone, personalized)
        sent.append(phone)

    return jsonify({"sent_to": sent, "count": len(sent)}), 200


if __name__ == "__main__":
    app.run(debug=True)
