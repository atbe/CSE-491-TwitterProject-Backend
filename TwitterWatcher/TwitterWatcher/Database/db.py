from google.cloud import firestore
from tweepy.models import Status

class Database(object):
		def __init__(self, project_name: str):
				self._project_name: str = project_name


		def insert_tweet(self, status: Status):
				firestore_client = firestore.Client(project=self._project_name)
				doc_ref: firestore.DocumentReference = firestore_client.collection('tweets').document(str(status._json['id']))
				doc_ref.set(status._json)


		def insert_reply(self, status: Status):
				firestore_client = firestore.Client(project=self._project_name)
				doc_ref: firestore.DocumentReference = firestore_client.collection('replies').document(str(status._json['id']))
				doc_ref.set(status._json)
