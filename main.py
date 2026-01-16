from fastapi import FastAPI
from agents.event_agent import discover_events
from db.firebase import get_db
from agents.langchain_event_agent import run_langchain_event_agent


app = FastAPI(title="Food Saviour – Agentic AI")

@app.get("/")
def root():
    return {"status": "Food Saviour API running"}

@app.get("/firebase-test")
def firebase_test():
    ref = get_db().child("test")
    ref.set({"status": "Firebase connected"})
    return {"message": "Firebase write successful"}


@app.post("/run-event-agent")
def run_event_agent(city: str):
    events = discover_events(city)

    db_ref = get_db().child("events")
    for e in events:
        db_ref.push(e)

    return {
        "message": "Event Discovery Agent executed",
        "events_found": len(events)
    }
@app.post("/run-langchain-agent")
def run_langchain(city: str):
    result = run_langchain_event_agent(city)
    return {
        "agent": "LangChain Event Discovery Agent",
        "output": result
    }

