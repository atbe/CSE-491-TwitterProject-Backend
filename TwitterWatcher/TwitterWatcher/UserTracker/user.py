from tweepy import StreamListener, API
from tweepy.models import Status
from threading import Thread

from TwitterWatcher.tweet_tracker import TweetTracker
from TwitterWatcher.logger import Logger


class UserStreamListener(StreamListener):
		def __init__(self, api: API, username: str):
				super().__init__(api=api)
				self._tweet_tracker = TweetTracker(username)
				self._tracked_tweets = set()


		def on_error(self, status_code):
				Logger.critical(f"\nAPI ERROR: {status_code}")


		def on_status(self, status) -> bool:
				if status._json.get('in_reply_to_status_id_str', None):
						thread = Thread(target=self._tweet_tracker.insert_reply, args=(status,))
						thread.start()
				else:
						return self._tweet_tracker.insert_tweet(status)


		def on_delete(self, status_id, user_id):
				# TODO: Actually delete the reply/status and respective data
				Logger.warning(f"Delete status {status_id} from user {user_id}")
