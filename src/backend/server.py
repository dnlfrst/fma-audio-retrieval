import pickle
import time
import os

from flask import Flask, jsonify, abort
from flask.helpers import send_file
from flask_caching import Cache
from flask_cors import CORS
from numpy import datetime64
import pandas as pd
from pandas.core import generic
import sklearn as skl

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

all_features = fma_load(f'{data_path}/features_small.csv')
beats_features = pd.read_csv(f'{data_path}/beats_features.csv', index_col=0)
timbre_features = all_features['mfcc']
tracks = fma_load(f'{data_path}/tracks_small.csv')
# genres = fma_load(f'{data_path}/genres.csv')
# echonest = fma_load(f'{data_path}/echonest.csv')

print(f'--- {time.time() - start_time} seconds for data read ---')

# selected_features_small = features
test = tracks['set', 'split'] == 'test'

with open(f'{data_path}/all_features_nn.pkl', 'rb') as f:
    all_features_nn = pickle.load(f)

with open(f'{data_path}/i_to_id.pkl', 'rb') as f:
    all_i_to_id = pickle.load(f)

with open(f'{data_path}/beats_i_to_id.pkl', 'rb') as f:
    beats_i_to_id = pickle.load(f)

with open(f'{data_path}/beats_features_nn.pkl', 'rb') as f:
    beats_nn = pickle.load(f)

with open(f'{data_path}/timbre_i_to_id.pkl', 'rb') as f:
    timbre_i_to_id = pickle.load(f)

with open(f'{data_path}/timbre_features_nn.pkl', 'rb') as f:
    timbre_nn = pickle.load(f)

scaler = skl.preprocessing.StandardScaler(copy=False)
scaler.fit_transform(all_features)
scaler.fit_transform(beats_features)
scaler.fit_transform(timbre_features)

#######################################################
####################### Routing #######################
#######################################################

@app.route('/tracks')
@cache.cached(timeout=0)
def get_all_audio_id():
    selection = pd.DataFrame([tracks['artist', 'name'],
                              tracks['album', 'title'],
                              tracks['track', 'genre_top'],
                              tracks['track', 'title'],
                              tracks['track', 'date_created'],
                              tracks['track', 'interest']]).transpose()
    selection.columns = ['artist', 'album', 'genre_top', 'title', 'date_created', 'interest']
    selection['id'] = selection.index
    selection = selection.astype({'date_created': datetime64})
    return jsonify(selection.to_dict(orient='records')), 200


@app.route('/tracks/<audio_id>/audio')
@cache.cached(timeout=0)
def get_audio(audio_id):
    filepath = f'{fma_small_path}/{audio_id[0:3]}/{audio_id}.mp3'
    if os.path.isfile(filepath):
        return send_file(filepath), 200
    else:
        return 404


@app.route('/tracks/<audio_id>/similarities')
@cache.cached(timeout=0)
def query_audio(audio_id):
    audio_id = int(audio_id)

    all_dist, all_tids = similarities(audio_id, all_features_nn,
                                      all_features.loc[all_features.index == audio_id])
    beats_dist, beats_tids = similarities(audio_id, beats_nn,
                                      beats_features.loc[beats_features.index == audio_id])
    timbre_dist, timbre_tids = similarities(audio_id, timbre_nn,
                                      timbre_features.loc[timbre_features.index == audio_id])

    return jsonify({ 'all_features': {'distances': all_dist, 'indices': all_tids},
                     'beats_features': {'distances': beats_dist, 'indices': beats_tids},
                     'timbre_features': {'distances': timbre_dist, 'indices': timbre_tids},
                    }), 200

def similarities(audio_id, model, features):
    # print('########### similarities ###########')
    # print(features)
    # print(audio_id)
    distances, indices = model.kneighbors(features)
    tids = all_i_to_id[indices[0]].to_list()
    distances = distances[0].tolist()
    # if contains self
    if int(audio_id) in tids:
        tids = tids[1:]
        distances = distances[1:]
    else:
        tids = tids[:10]
        distances = distances[:10]

    return distances, tids

@app.route('/tracks/<audio_id>/genre')
@cache.cached(timeout=0, key_prefix='tracks-genre')
def get_audio_genres(audio_id):
    audio_id = int(audio_id)
    genre = tracks['track', 'genre_top'].loc[tracks.index == audio_id].values[0]
    return jsonify({'genre': genre}), 200

@app.route('/tracks/<audio_id>/duration_genres')
@cache.cached(timeout=0, key_prefix='duration_genres')
def get_audio_duration_predictions(audio_id):
    filepath = f'{data_path}/duration_predictions/{audio_id}_dp.csv'
    if os.path.isfile(filepath):
        df = pd.read_csv(filepath)
        return jsonify(df.to_dict(orient='records')), 200
    else:
        return abort(404)
