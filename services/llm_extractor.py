from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def extract_event(text: str):
    prompt = f"""
Extract event details from the text.

Return JSON with:
event_name, event_type, event_date, location, organizer

TEXT:
{text}
"""
    response = llm.invoke(prompt)
    return response.content
