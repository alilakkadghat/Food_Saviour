from langchain_core.tools import Tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from services.scraper import scrape_page

load_dotenv()

# ---- TOOL 1: Web Search ----
def web_search(query: str):
    with DDGS() as ddgs:
        return list(ddgs.text(query, max_results=5))


# ---- TOOL 2: Web Scraping ----
def web_scrape(url: str):
    return scrape_page(url)


# ---- REGISTER TOOLS (still valid, even if not auto-invoked) ----
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
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)


# ---- PROMPT ----
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an assistant that finds upcoming large events in a city. "
        "Use web search results to extract accurate event information."
    ),
    ("human", "{input}")
])


# ---- SIMPLE RUNNABLE CHAIN ----
chain = (
    {"input": RunnablePassthrough()}
    | prompt
    | llm
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
    return chain.invoke(task)
