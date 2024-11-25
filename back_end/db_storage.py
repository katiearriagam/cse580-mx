import pyodbc

def get_conn(connection_string: str):
    # credential = identity.DefaultAzureCredential(exclude_interactive_browser_credential=False)
    # token_bytes = credential.get_token("https://database.windows.net/.default").token.encode("UTF-16-LE")
    # token_struct = struct.pack(f'<I{len(token_bytes)}s', len(token_bytes), token_bytes)
    conn = pyodbc.connect(connection_string)
    return conn