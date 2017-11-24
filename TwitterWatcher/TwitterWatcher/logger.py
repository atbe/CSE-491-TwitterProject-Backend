import logging
import sys
from time import time

Logger = logging.getLogger('twitterTweetTracker')
logFormatter = logging.Formatter("%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s]  %(message)s")
Logger.setLevel(logging.INFO)

consoleLogger = logging.StreamHandler(sys.stdout)
consoleLogger.setFormatter(logFormatter)
consoleLogger.setLevel(logging.WARN)
Logger.addHandler(consoleLogger)

fileLogger = logging.FileHandler(f"./twitterTweetTracker-f{int(time())}.log")
fileLogger.setFormatter(logFormatter)
fileLogger.setLevel(logging.INFO)
Logger.addHandler(fileLogger)
