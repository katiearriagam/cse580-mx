import os
import sys

import pyodbc

sys.path.append(os.path.join(sys.path[0], '..'))

from secrets import get_secret


def get_conn():
    # credential = identity.DefaultAzureCredential(exclude_interactive_browser_credential=False)
    # token_bytes = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
    # token_struct = struct.pack(f'<I{len(token_bytes)}s', len(token_bytes), token_bytes)
    connection_string = get_secret('cse580-sql-connectionstring')
    conn = pyodbc.connect(connection_string)
    return conn
