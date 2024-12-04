import json
import logging
import os
import sys
from typing import Dict

import requests
from dotenv import dotenv_values

sys.path.append(os.path.join(sys.path[0], '..'))
# sys.path.append(os.path.join(sys.path[0], '../..'))

from back_end.open_ai_processor import OpenAIProcessor

from config import auto_config as config2
from db_storage import get_conn

config = dotenv_values('.env')

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s: %(message)s')
logger = logging.getLogger('cse580-process-data')

logger.setLevel(logging.INFO)


def query_news_api(name):
    logger.info('Querying News API.')
    # Fetch news API for the articles
    # associates with each name
    NEWS_API_ENDPOINT = 'https://newsapi.ai/api/v1/article/getArticles'
    NEWS_API_KEY = config['NEWS_API_KEY']
    logger.info('-- Fetching news API')
    # call API
    res = requests.post(
        NEWS_API_ENDPOINT,
        headers={'Content-Type': 'application/json'},
        data=json.dumps(
            {
                'query': {
                    '$query': {
                        '$and': [
                            {'keyword': name},
                            {'lang': 'spa'},
                            {'sourceLocationUri': 'http://en.wikipedia.org/wiki/Mexico'},
                        ]
                    },
                    '$filter': {'forceMaxDataTimeWindow': '31'},
                },
                'resultType': 'articles',
                'articlesSortBy': 'date',
                'articlesCount': 20,
                'includeArticleLocation': True,
                'includeArticleOriginalArticle': True,
                'apiKey': NEWS_API_KEY,
            }
        ),
    )
    logger.debug(res.text)
    res.raise_for_status()
    logger.info(f'-- {res.status_code}')
    result = res.json()
    articles = result['articles']['results']
    articles_processed = []
    for article in articles:
        article_metadata = {
            'id': article['uri'],
            'name': name,
            'source': article['source']['title'],
            'body': article['body'],
            'title': article['title'],
            'publication_date': article['dateTimePub'],
        }
        articles_processed.append(article_metadata)
    logger.info(f'-- Fetched {len(articles_processed)} articles.')
    return articles_processed


# Returns an array with the articles that are not already stored
def filter_existing_articles(articles):
    # connect to the database
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    db_articles = set()
    get_articles_query = 'SELECT id FROM articles'
    # store the id of all the newly fetched articles
    new_articles = set([x['id'] for x in articles])
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        # get all the articles form the articles table
        cursor.execute(get_articles_query)
        for row in cursor.fetchall():
            id = row[0]
            db_articles.add(id)
    # get the set of all the articles fetched that do not currently
    # exist in the database (the net new articles)
    net_new_articles_id = new_articles - db_articles
    # return the net new articles
    return [article for article in articles if article['id'] in net_new_articles_id]


# Store news API
def store_news_articles(articles):
    logger.info('Storing the articles for the case in the database.')
    # get the list of the articles fetched that do not yet exist in the database
    net_new_articles = filter_existing_articles(articles)
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    # store the net new articles in the database
    insert_article_query = (
        'insert into articles(id, victim_name, title, publication_date, source, body) values (?, ?, ?, ?, ?, ?);'
    )
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        for article in net_new_articles:
            # create a new entry in the DB for a new article
            cursor.execute(
                insert_article_query,
                article['id'],
                article['name'],
                article['title'],
                article['publication_date'],
                article['source'],
                article['body'],
            )
        conn.commit()
    logger.info(f'-- Inserted {len(net_new_articles)} rows to the articles table.')


# Query DB for news articles associated with a case
def fetch_articles_from_db(name):
    logger.info('Fetching the articles for the case from the database.')
    # query the DB to retrieve the news article
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    db_articles = []
    select_articles_query = 'SELECT title, body, publication_date FROM articles WHERE victim_name = ?;'
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        # create a new entry in the DB for a new article
        cursor.execute(select_articles_query, name)
        for row in cursor.fetchall():
            db_articles.append({'title': row[0], 'body': row[1], 'date_published': row[2].isoformat()})
    logger.info(f'-- Found {len(db_articles)} articles in the database.')
    return json.dumps(db_articles, ensure_ascii=False)


# Extract info with GPT
def process_data(articles) -> Dict | None:
    logger.info('Processing articles with Open AI')
    open_ai_processor = OpenAIProcessor()
    try:
        # open the file that contains the prompt
        with open('coding_prompt.txt', 'r') as f:
            # read the entire content of the file as a string
            prompt = f.read()
            logger.info('-- Calling Open AI to summarize the case.')
            case_summary = open_ai_processor.summarize_case_info_from_articles(prompt, articles)
            try:
                case_json = json.loads(case_summary)
                return case_json
            except Exception as e:
                logger.error(f'-- Error while converting the response to an object, {e}')
    except Exception as e:
        logger.error(f'-- Error while reading prompt, {e}')
    return None


def check_existing_case(case_metadata):
    logger.info('Checking for matching existing case in the database')
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    check_query = 'SELECT id FROM cases WHERE victim_name LIKE ? AND missing_date = ?;'
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        logger.info(f'Case metadata we are checking against {case_metadata}')
        cursor.execute(check_query, f"%{case_metadata["victim_name"]}%", case_metadata['date_last_seen'])
        existing_entry = cursor.fetchone()
        logger.info(f'Finished checking for existing entry and found {existing_entry}')
        return existing_entry[0] if existing_entry else None


# Store extracted info to DB
def store_case_summary(case_metadata):
    logger.info('Storing extracted Open AI info')
    acs = config['AZURE_SQL_CONNECTIONSTRING']
    # store the net new articles in the database
    with get_conn(acs) as conn:
        cursor = conn.cursor()
        existing_entry_id = check_existing_case(case_metadata)
        # decide if we should update or insert a new row in the cases table
        # based on whether an entry for this case already exists
        if existing_entry_id is None:
            logger.info('-- Creating a new row')
            # insert query using parameterized SQL
            insert_query = f'INSERT INTO cases (victim_name, missing_date, case_location, case_coordinates_latitude, case_coordinates_longitude, relationship_with_aggressor, case_status, victim_outcome, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
            # create a new entry in the DB for a new case
            cursor.execute(
                insert_query,
                case_metadata['victim_name'],
                case_metadata['date_last_seen'],
                case_metadata['location'],
                case_metadata['coordinates']['lat'],
                case_metadata['coordinates']['long'],
                case_metadata['relationship_with_aggressor'],
                case_metadata['status'],
                case_metadata['victim_status'],
                case_metadata['summary'],
            )
        else:
            logger.info('-- Updating existing row')
            # update query using parameterized SQL
            update_query = 'UPDATE cases SET victim_name = ?, missing_date = ?, case_location = ?, case_coordinates_latitude = ?, case_coordinates_longitude = ?, relationship_with_aggressor = ?, case_status = ?, victim_outcome = ?, summary = ? WHERE id = ?;'
            # update the row for the existing case entry
            cursor.execute(
                update_query,
                case_metadata['victim_name'],
                case_metadata['date_last_seen'],
                case_metadata['location'],
                case_metadata['coordinates']['lat'],
                case_metadata['coordinates']['long'],
                case_metadata['relationship_with_aggressor'],
                case_metadata['status'],
                case_metadata['victim_status'],
                case_metadata['summary'],
                existing_entry_id,
            )
        conn.commit()


def process_name(name):
    logger.info(f'Processing {name}')
    articles = query_news_api(name)
    store_news_articles(articles)
    articles_in_db = fetch_articles_from_db(name)
    case_summary = process_data(articles_in_db)
    if case_summary is not None:
        store_case_summary(case_summary)


def run_pipeline():
    LIST_OF_NAMES = ['Bertha Guadalupe Cipriano']
    for name in LIST_OF_NAMES:
        process_name(name)


def main():
    run_pipeline()
    logger.info('Done')


if __name__ == '__main__':
    main()
