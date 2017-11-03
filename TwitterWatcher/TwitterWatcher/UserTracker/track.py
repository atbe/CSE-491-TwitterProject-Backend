from TwitterWatcher import Client
from TwitterWatcher.UserTracker import UserStreamListener
from tweepy import Stream

class TwitterUserTracker(object):


		def __init__(self, username: str, client: Client):
				self._username: str = username
				self._client: Client = client
				self._userStreamListener: UserStreamListener = UserStreamListener(
						api=self._client.api
				)


		def begin_tracking(self) -> None:
				stream = Stream(
						auth=self._client.auth,
						listener=self._userStreamListener
				)
				#stream.userstream(
				#		_with=self._username,
				#		replies='all',
				#		stall_warnings=True
				#)
				stream.filter(async=True, follow=["1170568604"])

