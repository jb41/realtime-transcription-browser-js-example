import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Set CORS as a middleware in the Flask app

# Get the Assembly API token from the OS environment variables
ASSEMBLY_API_TOKEN = os.environ.get('ASSEMBLYAI_TOKEN')

@app.route('/', methods=['GET'])
def get_temp_user_token():
    try:
        headers = {'authorization': ASSEMBLY_API_TOKEN}  # Use the Assembly API token from the OS environment variables
        payload = {'expires_in': 3600}
        response = requests.post('https://api.assemblyai.com/v2/realtime/token', headers=headers, json=payload)
        return jsonify(response.json())
    except requests.exceptions.RequestException as error:
        return jsonify({'status': error.response.status_code, 'data': error.response.json()})

if __name__ == '__main__':
    app.run(port=8000)
