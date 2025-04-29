import os
import json
from shapely.geometry import shape, Point

# Dynamiskt sökväg till GeoJSON-filen
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
geojson_path = os.path.join(BASE_DIR, "..", "geo_data", "swedish_municipalities.geojson")

# Ladda geojson-data (bara en gång vid import)
with open(geojson_path, encoding="utf-8") as f:
    geojson_data = json.load(f)

def find_municipality_for_point(lon, lat):
    """
    Returnerar kommunnamn om punkten (lon, lat) ligger inom en kommunpolygon.
    """
    point = Point(lon, lat)

    for feature in geojson_data["features"]:
        polygon = shape(feature["geometry"])
        if polygon.contains(point):
            return feature["properties"]["kom_namn"]
    return None

def get_polygon_by_municipality(name):
    """
    Returnerar en polygon (shapely) för en kommun utifrån dess namn.
    """
    for feature in geojson_data["features"]:
        if feature["properties"]["kom_namn"].lower() == name.lower():
            return shape(feature["geometry"])
    return None

def find_municipality_by_id(kommun_id):
    """
    Returnerar kommunnamn utifrån kommun-ID.
    """
    for feature in geojson_data["features"]:
        if feature["properties"]["kom_kod"] == kommun_id:
            return feature["properties"]["kom_namn"]
    return None

def find_municipality_for_point_by_id(lon, lat):
    """
    Returnerar kommunnamn om punkten (lon, lat) ligger inom en kommunpolygon.
    """
    point = Point(lon, lat)

    for feature in geojson_data["features"]:
        polygon = shape(feature["geometry"])
        if polygon.contains(point):
            return feature["properties"]["kom_kod"]
    return None