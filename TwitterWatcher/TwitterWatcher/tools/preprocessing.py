from tweepy.models import Status

class Preprocessing:

		@staticmethod
		def compress_status(tweet: Status) -> Status:
				if tweet._json.get('place', None):
						if 'bounding_box' in tweet._json['place']:
								if 'coordinates' in tweet._json['place']['bounding_box']:
										tweet._json['place']['bounding_box']['coordinates'] = str(tweet._json['place']['bounding_box']['coordinates'])
				if 'quoted_status' in tweet._json:
						if 'place' in tweet._json['quoted_status']:
								if 'bounding_box' in tweet._json['quoted_status']['place']:
										if 'coordinates':
												tweet._json['quoted_status']['place']['bounding_box']['coordinates'] = \
														str(tweet._json['quoted_status']['place']['bounding_box']['coordinates'])
				return tweet
