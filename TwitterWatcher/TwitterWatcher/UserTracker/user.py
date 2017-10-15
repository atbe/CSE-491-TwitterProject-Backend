from tweepy import StreamListener, models, API
from TwitterWatcher.Database import Database


class UserStreamListener(StreamListener):
		def __init__(self, api: API):
				super().__init__(api=api)
				self._db = Database()


		def on_error(self, status_code):
				print(f"\nERROR: {status_code}")


		def on_status(self, status):
				if status._json.get('in_reply_to_status_id_str', None):
						self._handle_reply(status)
				else:
						self._handle_status(status)


		def on_delete(self, status_id, user_id):
				# TODO: Actually delete the reply/status and respective data
				print(f"Delete status {status_id} from user {user_id}")


		def _handle_reply(self, status) -> None:
				self._db.insert_reply(status)
				# TODO: Parse sentiment
				# TODO: Parse hashtags
				pass

		def _handle_status(self, status: models.Status):
				self._db.insert_tweet(status)
				# TODO: Monitor replies.
				pass
