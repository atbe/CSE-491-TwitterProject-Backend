from mock import patch
from TwitterWatcher import Database
import sys
import types

class MockDatabase():
		def __init__(self):
				self._data = {}


		def get(self, path: str):
				return self._data.get(path, None)


		def set(self, path: str, value):
				self._data[path] = value


		def reset(self):
				self._data = {}
