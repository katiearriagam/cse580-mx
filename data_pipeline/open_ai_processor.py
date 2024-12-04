import logging
import os
import sys

import requests

sys.path.append(os.path.join(sys.path[0], '..'))

from secrets import get_secret

from config import auto_config as config

logger = logging.getLogger('cse580-process-data')


class OpenAIProcessor:
    domain = config.OPEN_AI_API_BASE
    model_name = config.OPEN_AI_DEPLOYMENT_NAME
    api_version = config.OPEN_AI_API_VERSION
    api_key = get_secret('cse580-oaikey')

    endpoint = f'{domain}/openai/deployments/{model_name}/chat/completions?api-version={api_version}'

    # Request headers
    headers = {'Content-Type': 'application/json', 'api-key': api_key}

    # Method that calls the Open AI API with a prompt
    # and a list of articles, and gets the Open AI response
    def summarize_case_info_from_articles(self, prompt, articles):
        # Request payload
        data = {
            'messages': [
                {'role': 'system', 'content': prompt},
                {'role': 'user', 'content': articles},
            ],
            # Controls the randomness of the response
            # 0.0 - deterministic, 1.0 - creative/random responses
            'temperature': 0.3,
            # Length of the generated responses
            'max_tokens': 300,
            # Nucleus sampling for response diversity - using default value
            'top_p': 0.95,
            # Penalizes repeated phrases in responses - no penalty for repetition
            'frequency_penalty': 0,
            # Encourages introducing new topics - using 0 to avoid variance in responses
            'presence_penalty': 0,
        }
        # Make the request
        response = requests.post(self.endpoint, headers=self.headers, json=data)

        # Handle response
        if response.status_code == 200:
            response_data = response.json()
            return response_data['choices'][0]['message']['content']
        else:
            logger.error(f'Error: {response.status_code}, {response.text}')
