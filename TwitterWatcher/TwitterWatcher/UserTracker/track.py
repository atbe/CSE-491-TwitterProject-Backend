from TwitterWatcher import Client
from TwitterWatcher.UserTracker import UserStreamListener
from tweepy import Stream
from TwitterWatcher.logger import Logger
import time

class TwitterUserTracker(object):


		def __init__(self, username: str, client: Client):
				self._username: str = username
				self._client: Client = client
				self._userStreamListener: UserStreamListener = UserStreamListener(
						api=self._client,
						username=username
				)


		def begin_tracking(self) -> None:
				while True:
						try:
								stream = Stream(
										auth=self._client.auth,
										listener=self._userStreamListener
								)
								stream.filter(
										follow=[self._client.lookup_users(screen_names=[self._username])[0].id_str],
										stall_warnings=True,
										async=False
								)
						except Exception as e:
								Logger.error('Error occured during stream loop, restarting in 5 sec')
								Logger.exception(e)
								time.sleep(5)
								continue
