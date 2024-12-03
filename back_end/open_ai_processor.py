import requests
import logging
from dotenv import dotenv_values

logger = logging.getLogger('cse580-process-data')

class OpenAIProcessor:
    config = dotenv_values(".env")
    endpoint = f"{config["OPEN_AI_API_BASE"]}/openai/deployments/{config["OPEN_AI_DEPLOYMENT_NAME"]}/chat/completions?api-version={config["OPEN_AI_API_VERSION"]}"

    # Request headers
    headers = {
        "Content-Type": "application/json",
        "api-key": config["OPEN_AI_API_KEY"]
    }
    # Method that calls the Open AI API with a prompt
    # and a list of articles, and gets the Open AI response
    def summarize_case_info_from_articles(self, prompt, articles):
        # Request payload
        data = {
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": articles}
            ],
            # Controls the randomness of the response
            # 0.0 - deterministic, 1.0 - creative/random responses
            "temperature": 0.7,
            # Length of the generated responses
            "max_tokens": 300,
            # Nucleus sampling for response diversity - using default value
            "top_p": 0.95,
            # Penalizes repeated phrases in responses - no penalty for repetition
            "frequency_penalty": 0,
            # Encourages introducing new topics - using 0 to avoid variance in responses
            "presence_penalty": 0
        }
        # Make the request
        response = requests.post(self.endpoint, headers=self.headers, json=data)

        # Handle response
        if response.status_code == 200:
            response_data = response.json()
            return response_data["choices"][0]["message"]["content"]
        else:
            logger.error(f"Error: {response.status_code}, {response.text}")