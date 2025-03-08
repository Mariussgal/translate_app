from flask import Flask, jsonify
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

app = Flask(__name__)

@app.route('/')
def home():
    app.logger.info("Route racine appelée")
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/health')
def health():
    app.logger.info("Route health check appelée")
    return "OK", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)