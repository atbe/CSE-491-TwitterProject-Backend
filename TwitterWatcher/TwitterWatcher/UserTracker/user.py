from tweepy import StreamListener, models, API
from TwitterWatcher.Database import Database
import logging
import sys

logFormatter = logging.Formatter("%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s]  %(message)s")
logger = logging.getLogger()
logger.setLevel(logging.INFO)
consoleLogger = logging.StreamHandler(sys.stdout)
consoleLogger.setFormatter(logFormatter)
logger.addHandler(consoleLogger)

class UserStreamListener(StreamListener):
		def __init__(self, api: API, username: str):
				super().__init__(api=api)
				self._db = Database()
				self._username = username


		def on_error(self, status_code):
				logger.critical(f"\nAPI ERROR: {status_code}")


		def on_status(self, status):
				if status._json.get('in_reply_to_status_id_str', None):
						try:
								logger.info(f"Inserting reply {status.id}")
								self._handle_reply(status)
						except Exception as e:
								logger.error(f"Could not insert reply with id {status.id_str}")
								logger.exception(e)
								return True
				else:
						try:
								if status.user.screen_name != self._username:
										return True
								self._handle_status(status)
								logger.info(f"Inserting tweet {status.id}")
								self._handle_reply(status)
						except Exception as e:
								logger.error(f"Could not insert reply with id {status.id_str}")
								logger.exception(e)
								return True


		def on_delete(self, status_id, user_id):
				# TODO: Actually delete the reply/status and respective data
				logger.warning(f"Delete status {status_id} from user {user_id}")


		def _handle_reply(self, status) -> None:
				self._db.insert_reply(status)


		def _handle_status(self, status: models.Status):
				self._db.insert_tweet(status)
