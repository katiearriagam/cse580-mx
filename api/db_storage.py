import os
import sys

import pyodbc

sys.path.append(os.path.join(sys.path[0], '..'))

DB_KEY = 'DB_CONN_STRING'


def get_acs():
    if os.getenv('ENVIRONMENT', 'DEVELOPMENT') == 'PRODUCTION':
        return os.getenv(DB_KEY, None)
    from dotenv import dotenv_values

    config = dotenv_values('.env')
    return config[DB_KEY]


def get_conn():
    # credential = identity.DefaultAzureCredential(exclude_interactive_browser_credential=False)
    # token_bytes = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
    # token_struct = struct.pack(f'<I{len(token_bytes)}s', len(token_bytes), token_bytes)
    connection_string = get_acs()
    print(connection_string)
    conn = pyodbc.connect(connection_string)
    return conn
