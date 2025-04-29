import os
import requests

MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() == "true"

def send_sms(recipients, message, short_links=False, sender="TrafikInfo"):
    if isinstance(recipients, str):
        recipients = [recipients]

    result = []

    for number in recipients:
        formatted_number = number.replace(" ", "")
        if MOCK_MODE:
            print(f"[MOCK] SMS till {formatted_number}: {message}")
            result.append({ "to": formatted_number, "id": f"mock-{formatted_number[-4:]}" })
        else:
            payload = {
                "from": sender,
                "to": formatted_number,
                "message": message
            }

            try:
                response = requests.post(
                    "https://api.46elks.com/a1/sms",
                    data=payload,
                    auth=(os.getenv("ELKS_USER"), os.getenv("ELKS_PASS"))
                )

                print("➡️ Payload:", payload)
                print("🔁 46elks status:", response.status_code)
                print("🧾 Body:", response.text)

                if response.status_code == 200:
                    msg_id = response.json().get("id", f"elks-{formatted_number[-4:]}")
                    result.append({ "to": formatted_number, "id": msg_id })
                else:
                    result.append({
                        "to": formatted_number,
                        "id": "error",
                        "error": response.text
                    })

            except Exception as e:
                result.append({
                    "to": formatted_number,
                    "id": "error",
                    "error": str(e)
                })

    return result
