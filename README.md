# Audio Retrieval for the Free Music Archive (FMA)

## Run

### Data Import

Download `fma_small` and put it as: `./backend/code/data/fma_small/`

### Frontend

```shell
cd src/frontend
npm i
npm run development
```

### Backend

```shell
cd src/backend
conda install --file requirements.txt
# OR
pip install -r requirements.txt
env FLASK_APP=server.py python -m flask run --eager-loading
```

## Datasets

`fma_small`, `fma_metadata` downloaded from [mdeff/fma: FMA: A Dataset For Music Analysis](https://www.kaggle.com/ashishpatel26/feature-extraction-from-audio).

## Project Structure

```
└── src
    ├── backend
    └── frontend
```

## User Interface

The user interface consists of:

- a similarity graph at the center,
- the track view, the audio player, and the genre prediction at the bottom, as well as
- the settings and a legend in the top right corner.

In the similarity graph, each node represents a track where an edge connects to similar tracks. The size of a node represents a track's `interest` (i.e., popularity), whereas the color of the node represents the track's genre. The thickness of a node corresponds to the similarity between two tracks where a thicker edge signifies a higher similarity.

Initially, the graph displays the tracks similar to a randomly selected track. Hovering over a node displays the corresponding track in the lower left corner. Clicking a node selects and executes the similarity query for the corresponding track. The selected track is always represented by an animated node in the similarity graph.

Playing the audio of the selected track also displays the prediction of the track's genre if available. Due to limited computing resources, the genre prediction is only available for a small set of tracks.

## Use Case

As a user, I would like to find a number of other songs that are similar to a song that I like.
