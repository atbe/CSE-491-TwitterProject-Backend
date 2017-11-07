from tweepy import API, OAuthHandler
from os import environ


class Client(API):
		def __init__(self):
				self.auth = OAuthHandler(
						environ['TWITTER_CONSUMER_KEY'],
						environ['TWITTER_CONSUMER_SECRET']
				)
				self.auth.set_access_token(
						environ['TWITTER_ACCESS_KEY'],
						environ['TWITTER_ACCESS_TOKEN']
				)
				super().__init__(auth_handler=self.auth)
