from tweepy import StreamListener, models, API
from TwitterWatcher.Database import Database
from TwitterWatcher.logger import Logger

class UserStreamListener(StreamListener):
		def __init__(self, api: API, username: str):
				super().__init__(api=api)
				self._db = Database(project_name='twittertweettracker')
				self._username = username


		def on_error(self, status_code):
				Logger.critical(f"\nAPI ERROR: {status_code}")


		def on_status(self, status):
				if status._json.get('in_reply_to_status_id_str', None):
						try:
								Logger.info(f"Inserting reply {status.id}")
								self._handle_reply(status)
						except Exception as e:
								Logger.error(f"Could not insert reply with id {status.id_str}")
								Logger.exception(e)
								return True
				else:
						try:
								if status.user.screen_name != self._username:
										return True
								self._handle_status(status)
								Logger.info(f"Inserting tweet {status.id}")
								self._handle_reply(status)
						except Exception as e:
								Logger.error(f"Could not insert reply with id {status.id_str}")
								Logger.exception(e)
								return True


		def on_delete(self, status_id, user_id):
				# TODO: Actually delete the reply/status and respective data
				Logger.warning(f"Delete status {status_id} from user {user_id}")


		def _handle_reply(self, status) -> None:
				Database().insert_reply(status)


		def _handle_status(self, status: models.Status):
				Database().insert_tweet(status)
