import requests
import os
from requests.auth import HTTPBasicAuth

def send_sms(to_number, message):
    if os.getenv("MOCK_MODE") == "True":
        print(f"[MOCK] Skickar SMS till {to_number}: {message}")
        return

    USERNAME = os.getenv("ELKS_USER")
    PASSWORD = os.getenv("ELKS_PASS")

    url = "https://api.46elks.com/a1/SMS"
    data = {
        "from": "TrafikInfo",
        "to": to_number,
        "message": message
    }

    response = requests.post(url, data=data, auth=HTTPBasicAuth(USERNAME, PASSWORD))

    if response.status_code == 200:
        print("[✓] SMS skickat:", response.json())
    else:
        print("[!] Fel:", response.status_code, response.text)
