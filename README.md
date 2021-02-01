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
## Use Cases

### Single-Sample Query (SSQ)

As a user, I would like to find other songs that are similar to a song that I like.

### Multiple-Samples Query (MSQ)

As a user, I would like to receive a playlist with songs that are similar to the ones in a playlist that I like.
