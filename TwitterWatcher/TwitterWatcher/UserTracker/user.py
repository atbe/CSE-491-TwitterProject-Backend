from tweepy import StreamListener, API
from tweepy.models import Status
from TwitterWatcher.Database import Database
from TwitterWatcher.logger import Logger

class UserStreamListener(StreamListener):
		def __init__(self, api: API, username: str):
				super().__init__(api=api)
				self._db = Database(project_name='twittertweettracker')
				self._username = username
				self._tracked_tweets = set()


		def on_error(self, status_code):
				Logger.critical(f"\nAPI ERROR: {status_code}")


		def on_status(self, status):
				if status._json.get('in_reply_to_status_id_str', None):
						self._handle_reply(status)
				else:
						return self._handle_status(status)


		def on_delete(self, status_id, user_id):
				# TODO: Actually delete the reply/status and respective data
				Logger.warning(f"Delete status {status_id} from user {user_id}")


		def _handle_status(self, status: Status):
				if status.user.screen_name != self._username:
						return True
				try:
						Logger.info(f"Inserting tweet {status.id}")
						self._db.insert_tweet(status)
						self._tracked_tweets.add(status.id)
				except Exception as e:
						Logger.error(f"Could not insert tweet with id {status.id_str}")
						Logger.exception(e)
				return True


		def _handle_reply(self, status: Status) -> bool:
				if status.in_reply_to_status_id_str not in self._tracked_tweets:
						return True
				try:
						Logger.info(f"Inserting reply {status.id}")
						self._db.insert_reply(status)
				except Exception as e:
						Logger.error(f"Could not insert reply with id {status.id_str}")
						Logger.exception(e)
						return True
