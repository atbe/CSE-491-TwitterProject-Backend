from google.cloud import firestore
from tweepy import models

class Database(object):

		def __init__(self):
				self._db: firestore.Client = firestore.Client()

		def insert_tweet(self, status):
				doc_ref: firestore.DocumentReference = self._db.collection('tweets').document(str(status._json['id']))
				doc_ref.set(status._json)

		def insert_reply(self, status):
				doc_ref: firestore.DocumentReference = self._db.collection('replies').document(str(status._json['id']))
				doc_ref.set(status._json)
