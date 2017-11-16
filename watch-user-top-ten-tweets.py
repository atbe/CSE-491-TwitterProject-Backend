from TwitterWatcher import Client
from TwitterWatcher import TwitterUserTracker
from TwitterWatcher.logger import Logger


def main():
	client: Client = Client()
	username = input("Username to track: ").lower().strip()
	tracker = TwitterUserTracker(username, client)
	Logger.info(f"Starting collection for user '{username}'")
	tracker.begin_tracking()

if __name__ == '__main__':
		main()
