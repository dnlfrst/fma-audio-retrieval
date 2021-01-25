from utils import *
from flask import Flask, json, jsonify, request
from flask.helpers import send_file
from flask_cors import CORS
from pathlib import Path
import pickle
import time

app = Flask(__name__)
CORS(app)

fma_small_path = 'data/fma_small'
fma_meta_path = 'data/fma_metadata'

#######################################################
###################### Load Data ######################
#######################################################

start_time = time.time()

features = fma_load(f'{fma_meta_path}/features.csv')
tracks = fma_load(f'{fma_meta_path}/tracks.csv')
genres = fma_load(f'{fma_meta_path}/genres.csv')
echonest = fma_load(f'{fma_meta_path}/echonest.csv')

# with open('data/features.pkl', 'rb') as f:
#     features = pickle.load(f)
# with open('data/tracks.pkl', 'rb') as f:
#     tracks = pickle.load(f)
# with open('data/genres.pkl', 'rb') as f:
#     genres = pickle.load(f)
# with open('data/echonest.pkl', 'rb') as f:
#     echonest = pickle.load(f)

print(f'--- {time.time() - start_time} seconds for data read ---')

small = tracks['set', 'subset'] <= 'small'
selected_features_small = features.loc[small, 'mfcc']

with open('data/model.pkl', 'rb') as f:
    model = pickle.load(f)

#######################################################
####################### Routing #######################
#######################################################

@app.route('/all-audio-id', methods=['GET'])
def get_all_audio_id():
    ids = [str(e).split('/')[-1].replace('.mp3', '') for e in list(Path(fma_small_path).rglob("*.mp3"))]
    return jsonify({'IDs': ids}), 200

@app.route('/audio/<audio_id>', methods=['GET'])
def get_audio(audio_id):
    path = f'{fma_small_path}/{audio_id[0:3]}/{audio_id}.mp3'
    return send_file(path), 200

@app.route('/audio-query/<audio_id>', methods=['GET'])
def query_audio(audio_id):
    audio_id = int(audio_id)
    audio_feature = selected_features_small.loc[selected_features_small.index == audio_id]
    distances, indices = model.kneighbors(audio_feature)
    return jsonify({ 'distances': distances.tolist(), 'indices': indices.tolist() }), 200