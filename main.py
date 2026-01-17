from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# standard imports
from agents.event_agent import discover_events
from db.firebase import get_db
from agents.langchain_event_agent import run_langchain_event_agent

# ADK Imports (REQUIRED)
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# Import your ADK agent
from agents.food_saviour_adk_agent import root_agent

app = FastAPI(title="Food Saviour – Agentic AI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# --- THIS IS THE FIXED ENDPOINT ---
@app.post("/run-food-saviour-agent")
async def run_food_saviour(city: str):
    # 1. Initialize the Session Service (stores the conversation & data)
    session_service = InMemorySessionService()
    
    # 2. Create a unique session (in a real app, manage session_ids dynamically)
    session = await session_service.create_session(
        app_name="food_saviour",
        user_id="api_user",
        session_id="session_01" 
    )

    # 3. Create the Runner with your defined root_agent
    runner = Runner(
        agent=root_agent, 
        app_name="food_saviour", 
        session_service=session_service
    )

    # 4. Construct the user prompt properly using Google's Type system
    user_message = types.Content(
        role="user", 
        parts=[types.Part(text=f"Find events, caterers, and NGOs in {city}")]
    )

    # 5. Execute the Agent
    # The agent will run, talk to sub-agents, and update the Session State
    async for event in runner.run_async(
        user_id="api_user",
        session_id="session_01",
        new_message=user_message
    ):
        pass  # You can log intermediate events here if needed

    # 6. Retrieve the structured data from the Session State
    # These keys ("events", "caterers", "ngos") matched what you defined in `output_key` in your agent file
    current_state = session.state
    
    return {
        "agent": "Food Saviour ADK Parallel Agent",
        "result": {
            "events": current_state.get("events"),
            "caterers": current_state.get("caterers"),
            "ngos": current_state.get("ngos"),
            # Optional: Return the conversation history if needed
            # "history": [t.part.text for t in session.turn_history]
        }
    }