import pickle
import time
import os

from flask import Flask, jsonify
from flask.helpers import send_file
from flask_caching import Cache
from flask_cors import CORS
from numpy import datetime64
import pandas as pd

from utils import *

cache_configuration = {
    "CACHE_TYPE": "simple",
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__)
app.config.from_mapping(cache_configuration)
CORS(app)

cache = Cache(app)

data_path = 'data'
fma_small_path = f'{data_path}/fma_small'
fma_meta_path = f'{data_path}/fma_metadata'

#######################################################
###################### Load Data ######################
#######################################################

start_time = time.time()

features = fma_load(f'{data_path}/features_small.csv')
tracks = fma_load(f'{data_path}/tracks_small.csv')
# genres = fma_load(f'{data_path}/genres.csv')
# echonest = fma_load(f'{data_path}/echonest.csv')

print(f'--- {time.time() - start_time} seconds for data read ---')

selected_features_small = features
test = tracks['set', 'split'] == 'test'
selected_tracks = tracks.loc[test].head(400)

with open(f'{data_path}/all_features_nn.pkl', 'rb') as f:
    all_features_nn = pickle.load(f)

with open(f'{data_path}/i_to_id.pkl', 'rb') as f:
    i_to_id = pickle.load(f)


#######################################################
####################### Routing #######################
#######################################################

@app.route('/tracks')
@cache.cached(timeout=0, key_prefix='tracks')
def get_all_audio_id():
    selection = pd.DataFrame([selected_tracks['artist', 'name'],
                              selected_tracks['album', 'title'],
                              selected_tracks['track', 'genre_top'],
                              selected_tracks['track', 'title'],
                              selected_tracks['track', 'date_created'],
                              selected_tracks['track', 'interest']]).transpose()
    selection.columns = ['artist', 'album', 'genre_top', 'title', 'date_created', 'interest']
    selection['id'] = selection.index
    selection = selection.astype({'date_created': datetime64})
    return jsonify(selection.to_dict(orient='records')), 200


@app.route('/tracks/<audio_id>/audio')
@cache.cached(timeout=0, key_prefix='tracks-audio')
def get_audio(audio_id):
    filepath = f'{fma_small_path}/{audio_id[0:3]}/{audio_id}.mp3'
    if os.path.isfile(filepath):
        return send_file(filepath), 200
    else:
        return 404


@app.route('/tracks/<audio_id>/similarities')
@cache.cached(timeout=0, key_prefix='tracks-similarities')
def query_audio(audio_id):
    audio_id = int(audio_id)
    audio_feature = selected_features_small.loc[selected_features_small.index == audio_id]
    # print(audio_id)
    # print(audio_feature)
    distances, indices = all_features_nn.kneighbors(audio_feature)
    # print(indices[0])
    # print(i_to_id[indices[0]].to_list())
    return jsonify({'distances': distances.tolist(), 'indices': i_to_id[indices[0]].to_list()}), 200


@app.route('/tracks/<audio_id>/genres')
@cache.cached(timeout=0, key_prefix='tracks-genres')
def get_audio_duration_predictions(audio_id):
    filepath = f'{data_path}/duration_predictions/{audio_id}_dp.csv'
    if os.path.isfile(filepath):
        df = pd.read_csv(filepath)
        return jsonify(df.to_dict(orient='records')), 200
    else:
        return 404
