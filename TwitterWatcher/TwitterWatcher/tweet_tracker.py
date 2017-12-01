from tweepy import Status
from TwitterWatcher.Database import Database
from TwitterWatcher.logger import Logger
from TwitterWatcher.tools.preprocessing import Preprocessing
from TwitterWatcher.tools.retry import retry
from google.api_core.exceptions import NotFound


class TweetTracker():

		def __init__(self, username: str):
				self._db = Database(project_name='twittertweettracker-ba5f2')
				self._tracked_tweets = set()
				self._username: str = username


		@retry(5)
		def insert_reply(self, status: Status):
				original_tweet_id = status._json['in_reply_to_status_id_str']
				try:
						self._db.get(f"tweets/{original_tweet_id}")
				except NotFound:
						return True
				except Exception as e:
						Logger.error('Unhandled exception while getting tweet from database.')
						Logger.error(e)
						return True

				try:
						Logger.info(f"Inserting reply {status._json['id']}")
						self._db.set(f"replies/{status._json['id']}", Preprocessing.compress_status(status)._json)
						return True
				except Exception as e:
						Logger.error(f"Could not insert reply with id {status._json['id_str']}. Retrying.")
						Logger.exception(e)
						Logger.info(status._json)
						return False


		@retry(5)
		def insert_tweet(self, status: Status):
				if status._json['user']['screen_name'].lower() != self._username:
						return True

				try:
						Logger.info(f"Inserting tweet {status._json['id']}")
						self._db.set(f"tweets/{status._json['id']}", Preprocessing.compress_status(status)._json)
						self._tracked_tweets.add(status._json['id'])
						return True
				except Exception as e:
						Logger.error(f"Could not insert tweet with id {status._json['id_str']}. Retrying.")
						Logger.exception(e)
						Logger.info(status._json)
						return False
