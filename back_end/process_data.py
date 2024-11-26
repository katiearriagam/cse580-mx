import json
import sys, os
import logging
import requests
from dotenv import dotenv_values

sys.path.append(os.path.join(sys.path[0], '..'))
# sys.path.append(os.path.join(sys.path[0], '../..'))

from db_storage import get_conn

config = dotenv_values(".env")

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s: %(message)s')
logger = logging.getLogger('cse580-process-data')

logger.setLevel(logging.INFO)


def query_news_api(name):
    # Fetch news API for the articles
    # associates with each name
    NEWS_API_ENDPOINT = 'https://newsapi.ai/api/v1/article/getArticles'
    NEWS_API_KEY = config['NEWS_API_KEY']
    logger.info('-- Fetching news API')
    # call API
    res = requests.post(NEWS_API_ENDPOINT, headers={
        'Content-Type': 'application/json'
    }, data=json.dumps({
        "query": {
            "$query": {
                "$and": [
                {
                    "keyword": name
                },
                {
                    "lang": "spa"
                },
                {
                    "sourceLocationUri": "http://en.wikipedia.org/wiki/Mexico"
                },
                ]
            },
            "$filter": {
                "forceMaxDataTimeWindow": "31"
            }
        },
        "resultType": "articles",
        "articlesSortBy": "date",
        "articlesCount": 20,
        "includeArticleLocation": True,
        "includeArticleOriginalArticle": True,
        "apiKey": NEWS_API_KEY
    }))
    logger.debug(res.text)
    res.raise_for_status()
    logger.info(f'-- {res.status_code}')
    result = res.json()
    articles = result["articles"]["results"]
    articles_processed = []
    for article in articles:
        article_metadata = {
            "id": article["uri"], 
            "name": name,
            "source": article["source"]["title"],
            "body": article["body"],
            "title": article["title"],
            "publication_date": article["dateTimePub"]
        }
        articles_processed.append(article_metadata)
    logger.info(f'Fetched {len(articles_processed)} articles.')
    return articles_processed

# Returns an array with the articles that are not already stored
def filter_existing_articles(articles):
    ARTICLES_TABLE_NAME = 'articles'
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    db_articles = set() 
    new_articles = set([x["id"] for x in articles])
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        cursor.execute(f"select id from {ARTICLES_TABLE_NAME}")
        for row in cursor.fetchall():
            id = row[0]
            db_articles.add(id)
    net_new_articles_id = new_articles - db_articles   
    return [article for article in articles if article["id"] in net_new_articles_id]

# Store news API
def store_news_articles(articles):
    # create a new entry in the DB for a new article
    # construct the composite key for each row
    net_new_articles = filter_existing_articles(articles)
    ARTICLES_TABLE_NAME = 'articles'
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        for article in net_new_articles:
            cursor.execute(f"insert into {ARTICLES_TABLE_NAME}(id, victim_name, title, publication_date, source, body) values (?, ?, ?, ?, ?, ?);", article["id"], article["name"], article["title"], article["publication_date"], article["source"], article["body"])
        conn.commit()
    logger.info(f'Inserted {len(net_new_articles)} rows to the table.')


# Query DB for rest of news
def fetch_articles_from_db(name):
    # query the DB to retrieve the news article
    TABLE_NAME = 'articles'
    pass

# Extract info with GPT
def process_data(name, articles):
    # given the list of articles, process the information
    # with GPT to extract the following information:
        # (a) Composite key: 
        # (b) Name of the victim
        # (c) Date when the victim went missing
        # (d) Location of the case: as specific as can be determined by the total text of the news articles for each reported case.
        # (e) Approximate coordinates of the location, derived from     # (c).
        # (f) Relationship with the aggressor   # (e.g., "unknown", "friend", "partner", "husband").
        # (g) Closed or Ongoing: Is the case closed or is an ongoing investigation?
        # (h) For closed cases: was the victim found: alive, dead or not found?
        # (i) A short summary describing what we know so far for the case.
    # return: a single JSON object with the processed GPT information
    GPT_API_KEY = ''
    GPT_API_ENDPOINT = ''
    pass

# Store extracted info to DB
def store_extracted_info(case_metadata):
    logger.info('Storing extracted info')
    TABLE_NAME = 'femicides_mexico'
    # given the case metadata, store a new row in the corresponding table
    pass


def process_name(name):
    logger.info(f'Processing {name}')
    articles = query_news_api(name)
    store_news_articles(articles)
    articles_in_db = fetch_articles_from_db(name)
    extracted_info = process_data(name, articles_in_db)
    store_extracted_info(extracted_info)
    
def run_pipeline():
    LIST_OF_NAMES = ['Bertha Guadalupe Cipriano']
    for name in LIST_OF_NAMES:
        process_name(name)

def test_db_connection():
    query = 'SELECT * FROM femicides_mexico;'
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    rows = []
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        for row in cursor.fetchall():
            print(row)


def main():
    run_pipeline()
    logger.info('Done')

if __name__ == '__main__':
    main()