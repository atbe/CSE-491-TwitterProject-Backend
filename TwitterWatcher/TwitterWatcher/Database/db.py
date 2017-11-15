from google.cloud.firestore import DocumentReference, Client

class Database(object):
		def __init__(self, project_name: str):
				self._project_name: str = project_name
				self._client = Client(project=self._project_name)


		def get(self, path: str):
				document: DocumentReference = self._client.document(path)
				return document.get()


		def set(self, path: str, value):
				document: DocumentReference = self._client.document(path)
				document.set(value)
