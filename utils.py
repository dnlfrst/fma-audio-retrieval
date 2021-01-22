from pathlib import Path

def get_all_audio_paths(path):
    return [str(e) for e in list(Path(path).rglob("*.mp3"))]