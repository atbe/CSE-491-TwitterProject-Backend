from tweepy.models import Status

class Preprocessing:

		@staticmethod
		def compress_status(tweet: Status) -> Status:
				try:
						tweet._json['place']['bounding_box']['coordinates'] = \
								str(tweet._json['place']['bounding_box']['coordinates'])
				except KeyError:
						pass
				except TypeError:
						pass
				try:
						tweet._json['quoted_status']['place']['bounding_box']['coordinates'] = \
								str(tweet._json['quoted_status']['place']['bounding_box']['coordinates'])
				except KeyError:
						pass
				except TypeError:
						pass

				return tweet
