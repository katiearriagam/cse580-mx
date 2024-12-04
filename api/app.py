import os
import sys

from flask import Flask

sys.path.append(os.path.join(sys.path[0], '..'))

from db_storage import get_conn

app = Flask(__name__)


@app.route('/')
def hello_world():
    return '<p>Hello, World!</p>'


@app.route('/cases')
def fetch_cases():
    return get_cases_from_db()


def get_cases_from_db():
    query = 'SELECT * FROM cases;'
    result = []
    with get_conn() as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        for row in cursor.fetchall():
            result.append(
                {
                    'id': row[0],
                    'victim_name': row[1],
                    'missing_date': row[2],
                    'location': row[3],
                    'lat': row[4],
                    'long': row[5],
                    'relationship_with_aggressor': row[6],
                    'status': row[7],
                    'victim_outcome': row[8],
                    'summary': row[9],
                }
            )
    return result
