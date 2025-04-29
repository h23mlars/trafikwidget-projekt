import os
import base64
from flask import request

USERNAME = os.getenv("API_USER", "user")
PASSWORD = os.getenv("API_PASS", "pass")

def check_auth(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Basic "):
        return False

    encoded = auth_header.split(" ")[1]
    decoded = base64.b64decode(encoded).decode("utf-8")
    user, pwd = decoded.split(":", 1)
    return user == USERNAME and pwd == PASSWORD
