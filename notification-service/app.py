from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# 🧩 Importera alla dina route-blueprints
from routes.sms import sms_bp
from routes.mail import mail_bp          # om du har en mail.py
from routes.trafik import trafik_bp      # för trafikinfo
from routes.geo_routes import geo_bp     # för geo-test eller koordinatmatch

load_dotenv()
app = Flask(__name__)
CORS(app)

# ✅ Registrera varje blueprint
app.register_blueprint(sms_bp)
app.register_blueprint(mail_bp)
app.register_blueprint(trafik_bp)
app.register_blueprint(geo_bp)

if __name__ == "__main__":
    app.run(debug=True)
