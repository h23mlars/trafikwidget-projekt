from flask import Blueprint, request, jsonify
from sms_service.sms_handler import send_sms
from utils.auth import check_auth

sms_bp = Blueprint("sms", __name__)

@sms_bp.route("/send", methods=["POST"])
def send():
    if not check_auth(request):
        return jsonify({
            "status": "error",
            "statusText": "Unauthorized"
        }), 401

    data = request.get_json() or {}

    to = data.get("to")
    message = data.get("message", "").strip()
    short_links = data.get("shortLinks", False)
    sender = data.get("from")

    # Validera fält
    if not to or not message:
        return jsonify({
            "status": "error",
            "statusText": "Missing 'to' or 'message'"
        }), 400

    # Validera typ på 'to'
    if isinstance(to, str):
        to = [to]
    elif not isinstance(to, list) or not all(isinstance(num, str) for num in to):
        return jsonify({
            "status": "error",
            "statusText": "'to' must be a string or list of strings"
        }), 400

    if len(message) == 0:
        return jsonify({
            "status": "error",
            "statusText": "Message must not be empty"
        }), 400

    message_ids = send_sms(to, message, short_links, sender)

    return jsonify({
        "status": "ok",
        "statusText": f"{len(message_ids)} SMS skickade",
        "messageIds": message_ids
    }), 200
