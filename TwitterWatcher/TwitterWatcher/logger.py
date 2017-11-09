import logging
import sys

logFormatter = logging.Formatter("%(asctime)s [%(threadName)-12.12s] [%(levelname)-5.5s]  %(message)s")
Logger = logging.getLogger()
Logger.setLevel(logging.INFO)
consoleLogger = logging.StreamHandler(sys.stdout)
consoleLogger.setFormatter(logFormatter)
Logger.addHandler(consoleLogger)
