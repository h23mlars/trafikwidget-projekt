from flask import Blueprint, request, jsonify
from services.geo_filter import find_municipality_for_point

geo_bp = Blueprint("geo", __name__)

@geo_bp.route("/geo/match", methods=["POST"])
def geo_match():
    data = request.get_json()
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        return jsonify({"error": "Både lat och lon krävs"}), 400

    municipality = find_municipality_for_point(lon, lat)

    return jsonify({
        "municipality": municipality
    })
