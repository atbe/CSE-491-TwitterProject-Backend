from tweepy import StreamListener, models, API, Stream
from TwitterWatcher.Database import Database
import time

class UserStreamListener(StreamListener):
		def __init__(self, api: API, time_limit=999):
				super().__init__(api=api)
				self._db = Database()

				self.start_time = time.time()
				self.limit = time_limit
				self.tweets_reply = []
				self.tweets = []
				self.capacity = 10


		def on_error(self, status_code):
				print(f"\nERROR: {status_code}")


		def on_status(self, status):
			if(time.time() - self.start_time) < self.limit:
				if(status.in_reply_to_status_id == None and len(self.tweets) < self.capacity): #If a reply
					self.tweets.append((status.id_str, status.text))
					#print("original tweet: ", status.id_str, status.text)
					self._db.insert_tweet(status)
				
				elif(status.in_reply_to_status_id != None): 
					self.tweets_reply.append(((status.id_str, status.text)))
					#print("reply: ", status.id_str, status.text, status.in_reply_to_status_id_str)
					self._db.insert_reply(status)
					
				return True
		
			else:
				return False


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
