from TwitterWatcher import Client
from TwitterWatcher import TwitterUserTracker

def main():
	client: Client = Client()
	tracker = TwitterUserTracker('dse-msu', client)
	tracker.begin_tracking()

if __name__ == '__main__':
		main()