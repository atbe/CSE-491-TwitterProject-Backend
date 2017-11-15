import unittest
import logging
import sys
from tweepy.models import Status
from TwitterWatcher.tweet_tracker import TweetTracker
from tests.database.mock_database import MockDatabase


dummy_status = Status()
dummy_status._json = {
		'id': 1,
		'id_str': '1',
		'text': 'test',
		'user': {
				'screen_name': 'test_user'
		}
}

dummy_reply = Status()
dummy_reply._json = {
		'id': 2,
		'id_str': '2',
		'text': 'test reply',
		'user': {
				'screen_name': 'test_reply_user'
		},
		'in_reply_to_status_id': 1
}

class TwitterWatcherDatabaseTests(unittest.TestCase):
		def setUp(self):
				logging.disable(sys.maxsize) # disable loggers
				self._db_client: TweetTracker = TweetTracker('test_user')
				self._db: MockDatabase = MockDatabase()
				self._db_client._db = self._db

				self._db.reset()


		def test_insert_tweet(self):
				self._db_client.insert_tweet(dummy_status)
				self.assertEqual(
						dummy_status._json,
						self._db.get(f"tweets/{dummy_status._json['id']}"))


		def test_insert_tweet_for_untracked_user_should_not_insert(self):
				dummy_status._json['user']['screen_name'] = 'BOB'
				self._db_client.insert_tweet(dummy_status)
				self.assertIsNone(
						self._db.get(f"tweets/{dummy_status._json['id']}"))


		def test_insert_reply_from_tracked_tweeted(self):
				self._db_client.insert_tweet(dummy_status)
				self._db_client.insert_reply(dummy_reply)
				self.assertEqual(
						dummy_reply._json,
						self._db.get(f"replies/{dummy_reply._json['id']}"))


		def test_insert_reply_from_untracked_tweeted_should_not_insert(self):
				self._db_client.insert_tweet(dummy_status)
				dummy_reply._json['in_reply_to_status_id'] = 3
				self._db_client.insert_reply(dummy_reply)
				self.assertIsNone(
						self._db.get(f"replies/{dummy_reply._json['id']}"))

