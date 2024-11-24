import json
import sys
import logging
import requests

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s: %(message)s')
logger = logging.getLogger('cse580-process-data')

logger.setLevel(logging.INFO)


def query_news_api(name):
    # Fetch news API for the articles
    # associates with each name
    NEWS_API_KEY = ''
    NEWS_API_ENDPOINT = ''
    logger.info('-- Fetching news API')
    res = requests.get(NEWS_API_ENDPOINT, headers={

    })
    res.raise_for_status()
    logger.info(f'-- {res.status_code}')
    result = res.json()
    print(result)
    # call API
    # return the list of articles for associated
    # with the name

# Store news API
def store_news_articles(articles):
    # create a new entry in the DB for a new article
    # construct the composite key for each row
    TABLE_NAME = 'Articles'
    pass

# Query DB for rest of news

def fetch_articles_from_db(name):
    # query the DB to retrieve the news article
    TABLE_NAME = 'Articles'
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
    TABLE_NAME = 'FemicidesMexico'
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
    LIST_OF_NAMES = ['A', 'B', 'C']
    for name in LIST_OF_NAMES:
        process_name(name)


def main():
    run_pipeline()
    logger.info('Done')

if __name__ == '__main__':
    main()