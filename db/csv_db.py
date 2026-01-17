import pandas as pd

EVENTS_PATH = "data/Event Dataset Updated.xlsx"

def get_events():
    return pd.read_excel(EVENTS_PATH)
