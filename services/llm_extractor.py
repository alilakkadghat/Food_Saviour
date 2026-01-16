from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

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
