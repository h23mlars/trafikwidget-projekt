import os
import requests
from shapely.geometry import Point
from services.geo_filter import get_polygon_by_municipality
import json

TRV_API_KEY = os.getenv("TRV_API_KEY")

def get_trafikdata_for_municipality(name):
    polygon = get_polygon_by_municipality(name)
    if not polygon:
        print(f"❗ Kommun '{name}' hittades inte i geojson.")
        return []

    # XML-fråga till Trafikverket (för senaste 24h)
    xml = f"""
    <REQUEST>
      <LOGIN authenticationkey="{TRV_API_KEY}" />
      <QUERY objecttype="Situation" schemaversion="1.5">
        <FILTER>
          <GT name="Deviation.StartTime" value="$dateadd(-1.00:00:00)" />
        </FILTER>
        <INCLUDE>Deviation.Header</INCLUDE>
        <INCLUDE>Deviation.Message</INCLUDE>
        <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
      </QUERY>
    </REQUEST>
    """

    print("🔍 XML som skickas:\n", xml)

    try:
        res = requests.post(
            "https://api.trafikinfo.trafikverket.se/v2/data.json",
            data=xml,
            headers={"Content-Type": "text/xml"}
        )
        res.raise_for_status()
    except Exception as e:
        print("❌ FEL från Trafikverket:", e)
        return []

    print("📬 Statuskod:", res.status_code)

    try:
        data = res.json()
    except Exception as e:
        print("❌ Kunde inte tolka svaret som JSON:", e)
        return []

    situations = data.get("RESPONSE", {}).get("RESULT", [])[0].get("Situation", [])
    matched = []

    for situation in situations:
        for deviation in situation.get("Deviation", []):
            geo = deviation.get("Geometry", {}).get("WGS84")
            if not geo or "POINT" not in geo:
                continue

            try:
                coords = geo.replace("POINT (", "").replace(")", "").split()
                if len(coords) != 2:
                    continue
                lon, lat = map(float, coords)
                point = Point(lon, lat)

                if polygon.contains(point):
                    print("✅ Matchad i polygon:", name, point)
                    matched.append({
                        "Header": deviation.get("Header"),
                        "Message": deviation.get("Message")
                    })
            except Exception as e:
                print("⚠️ Fel vid koordinatmatchning:", e)
                continue

    print(f"🎯 Totalt matchade händelser i {name}: {len(matched)}")
    return matched
