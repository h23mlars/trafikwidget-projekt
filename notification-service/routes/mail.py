from flask import Blueprint, jsonify

mail_bp = Blueprint("mail", __name__)

@mail_bp.route("/mail/status", methods=["GET"])
def mail_status():
    return jsonify({
        "status": "ok",
        "message": "Mail-tjänsten är inte aktiv ännu."
    })
