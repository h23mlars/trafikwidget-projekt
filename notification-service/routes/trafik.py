from flask import Blueprint, request, jsonify
from services.trafikverket_api import get_trafikdata_for_municipality

trafik_bp = Blueprint("trafik", __name__)

@trafik_bp.route("/trafikinfo", methods=["POST"])
def trafikinfo():
    data = request.get_json()
    kommun = data.get("municipality")
    if not kommun:
        return jsonify({"error": "Kommun krävs"}), 400

    results = get_trafikdata_for_municipality(kommun)
    return jsonify({
        "municipality": kommun,
        "results": results
    })
