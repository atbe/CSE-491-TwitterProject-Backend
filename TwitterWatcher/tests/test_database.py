import unittest
from TwitterWatcher.Database import Database
from tweepy.models import Status

class TwitterWatcherDatabaseTests(unittest.TestCase):


		def setUp(self):
				self._db: Database = Database()


		def test_insert_tweet(self):
				status = Status()
				status._json = {
						'id': 1,
						'text': 'test'
				}
				self._db.insert_tweet(status)

