from duckduckgo_search import DDGS
from services.scraper import scrape_page
from services.llm_extractor import extract_event

def discover_events(city: str):
    queries = [
        f"upcoming events in {city}",
        f"wedding events in {city}",
        f"corporate conference {city}",
        f"college fest {city}"
    ]

    events = []

    for q in queries:
     with DDGS() as ddg:
        results = ddg(q, max_results=3)
        for r in results:
            url = r.get("href")
            if not url:
                continue

            page_text = scrape_page(url)
            if len(page_text) < 300:
                continue

            structured = extract_event(page_text)
            events.append({
                "source_url": url,
                "data": structured
            })

    return events
