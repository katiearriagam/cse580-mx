import os
import sys

sys.path.append(os.path.join(sys.path[0], '..'))

from key_vault import get_secret as get_secret_from_kv

env = os.getenv('ENVIRONMENT', None)


def get_secret(secret_name):
    if env == 'PRODUCTION':
        # Fetch from KV
        return get_secret_from_kv(secret_name)
    else:
        # Fetch from local conf
        from dotenv import dotenv_values

        config = dotenv_values('.env')
        return config[secret_name]
