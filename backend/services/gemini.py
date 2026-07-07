import os
import json
import base64
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY environment variable is not set!")

class GeminiService:
    @staticmethod
    def get_model(model_name="gemini-2.5-flash"):
        # Fallback to 1.5-flash if needed, but 2.5-flash is recommended
        try:
            return genai.GenerativeModel(model_name)
        except Exception:
            return genai.GenerativeModel("gemini-1.5-flash")

    @classmethod
    def generate_chat_reply(cls, message: str, language_code: str, history: list = None) -> dict:
        """
        Generates a chat reply with suggested follow-up actions in the target language.
        """
        model = cls.get_model()
        
        system_instruction = (
            "You are JanSetu AI, an expert, empathetic, and objective government concierge helper. "
            "Your primary role is to answer citizen queries regarding public services, civic duties, and documentation. "
            "Speak in a helpful, simplified tone. Avoid bureaucratic legalese. "
            "Structure your response in markdown. "
            "You must return your output in JSON format with two keys:\n"
            "1. 'reply': your markdown response string written in the user's preferred language.\n"
            "2. 'suggested_actions': a list of 2-3 strings representing short, actionable next steps in the user's preferred language."
        )

        language_names = {
            "en": "English",
            "hi": "Hindi (हिंदी)",
            "ta": "Tamil (தமிழ்)",
            "bn": "Bengali (বাংলা)"
        }
        target_lang = language_names.get(language_code, "English")

        prompt = (
            f"User preferred language: {target_lang}\n"
            f"User message: {message}\n\n"
            f"Chat History Context: {json.dumps(history or [])}\n\n"
            f"Respond using the requested JSON format."
        )

        try:
            # We can supply system_instruction to GenerativeModel initialization
            chat_model = genai.GenerativeModel(
                model_name=model.model_name,
                system_instruction=system_instruction
            )
            response = chat_model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling Gemini chat: {e}")
            return {
                "reply": f"Sorry, I encountered an issue: {str(e)}. Please try again.",
                "suggested_actions": ["Retry", "Contact Support"]
            }

    @classmethod
    def analyze_complaint_image(cls, base64_image: str, user_description: str) -> dict:
        """
        Performs multimodal analysis of a civic issue photo + description.
        Returns title, category, urgency, summary, and official draft letter.
        """
        model = cls.get_model()

        # Clean base64 string if it contains headers
        if "," in base64_image:
            header, base64_image = base64_image.split(",", 1)
            # Try to get mime type, e.g. "data:image/png;base64" -> "image/png"
            mime_type = header.split(";")[0].split(":")[1]
        else:
            mime_type = "image/jpeg"

        try:
            image_bytes = base64.b64decode(base64_image)
        except Exception as e:
            print(f"Base64 decoding failed: {e}")
            return {
                "title": "Unidentified Public Grievance",
                "category": "Others",
                "urgency": "Medium",
                "summary": "Could not parse visual evidence. " + user_description,
                "official_draft": f"To Whom It May Concern,\n\nWe would like to report: {user_description}"
            }

        image_part = {
            "mime_type": mime_type,
            "data": image_bytes
        }

        prompt = (
            "You are a public safety and municipal administration auditor.\n"
            "Analyze the provided image and user description of the public issue.\n"
            f"User description: {user_description}\n\n"
            "Generate a structured JSON output matching this schema:\n"
            "{\n"
            "  \"title\": \"Short descriptive title of the issue\",\n"
            "  \"category\": \"One of [Roads, Sanitation, Water Supply, Electricity, Public Safety, Others]\",\n"
            "  \"urgency\": \"One of [Low, Medium, High, Critical]\",\n"
            "  \"summary\": \"2-sentence objective summary of the visual evidence matching what is shown in the image\",\n"
            "  \"official_draft\": \"A formal, polite complaint letter template addressed to the local Municipal Commissioner. Do not use placeholding strings like '[Your Name]', auto-fill using the context name 'Citizen Citizen' and current dates.\"\n"
            "}\n"
            "Ensure the output is valid JSON."
        )

        try:
            response = model.generate_content(
                [image_part, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error calling Gemini Vision: {e}")
            return {
                "title": "Visual Public Issue",
                "category": "Others",
                "urgency": "Medium",
                "summary": f"Visual analysis failed. Description: {user_description}",
                "official_draft": f"To the Municipal Authority,\n\nI am writing to bring your attention to an issue: {user_description}.\n\nSincerely,\nConcerned Citizen"
            }
