from langchain.agents import Tool, initialize_agent
from langchain_openai import ChatOpenAI
from duckduckgo_search import DDGS
from services.scraper import scrape_page


# ---- TOOL 1: Web Search ----
def web_search(query: str):
    with DDGS() as ddgs:
        return list(ddgs.text(query, max_results=5))


# ---- TOOL 2: Web Scraping ----
def web_scrape(url: str):
    return scrape_page(url)


# ---- REGISTER TOOLS ----
tools = [
    Tool(
        name="WebSearch",
        func=web_search,
        description="Search the web for upcoming events"
    ),
    Tool(
        name="WebScraper",
        func=web_scrape,
        description="Scrape event webpage content"
    )
]


# ---- LLM ----
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)


# ---- AGENT ----
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent="zero-shot-react-description",
    verbose=True
)


# ---- ENTRY FUNCTION ----
def run_langchain_event_agent(city: str):
    task = f"""
    Find upcoming large events in {city}.
    Extract:
    - Event name
    - Event date
    - Location
    - Organizer
    Return results clearly.
    """
    return agent.run(task)
