import os, \
       json, \
       base64, \
       requests
from flask import Flask, request, jsonify
from flask_cors import CORS



app = Flask(__name__)
CORS(app)  # Set CORS as a middleware in the Flask app

# Get the Assembly API token from the OS environment variables
ASSEMBLY_API_TOKEN = os.environ.get('ASSEMBLYAI_TOKEN')

@app.route('/', methods=['POST'])
def get_translation():
    # receive the audio data from the client as a base64 encoded string
    audio_data = request.json.get('audio_data')

    print(audio_data)

    # make a request to the Assembly AI API for a translation
    headers = {'authorization': ASSEMBLY_API_TOKEN, 'Content-Type': 'application/json'}
    payload = { 'audio_data': audio_data }
    response = requests.post('https://api.assemblyai.com/v2/stream', headers=headers, json=payload)
    data = response.json()
    print(data)

    # return the translation as a JSON object to the client
    if 'error' in data:
        return jsonify({'error': data['error']})
    else:
        return_data = {
            'text': data['text']
        }

        return jsonify(return_data)


if __name__ == '__main__':
    app.run(port=8000)
