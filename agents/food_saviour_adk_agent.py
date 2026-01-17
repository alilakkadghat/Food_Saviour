from google.adk.agents import ParallelAgent, LlmAgent

GEMINI_MODEL = "gemini-2.5-flash"


# 🗓 Event Discovery Agent
event_agent = LlmAgent(
    name="EventDiscoveryAgent",
    model=GEMINI_MODEL,
    instruction="""
You are an event research agent.

Given a city name:
- Identify upcoming large events (weddings, conferences, college fests)
- Mention event name, date (if known), location, and organizer
- Focus on events that may generate surplus food

Output in JSON format.
""",
    output_key="events"
)


# 🍽 Catering Service Agent
catering_agent = LlmAgent(
    name="CateringAgent",
    model=GEMINI_MODEL,
    instruction="""
You are a catering service analyst.

Given a city name:
- Identify popular catering companies or event food providers
- Mention service name, event type they serve, and contact hints

Output in JSON format.
""",
    output_key="caterers"
)


# 🏢 NGO / Food Bank Agent
ngo_agent = LlmAgent(
    name="NGOMatchingAgent",
    model=GEMINI_MODEL,
    instruction="""
You are an NGO researcher.

Given a city name:
- Find food bank NGOs or hunger relief organizations
- Mention NGO name, area of operation, and type of food accepted

Output in JSON format.
""",
    output_key="ngos"
)


# 🤖 Parallel Food Saviour Agent
food_saviour_agent = ParallelAgent(
    name="FoodSaviourAgent",
    sub_agents=[event_agent, catering_agent, ngo_agent],
    description="Finds events, caterers, and NGOs in parallel to reduce food wastage."
)


# 🌱 Root Agent (REQUIRED BY ADK)
root_agent = food_saviour_agent
